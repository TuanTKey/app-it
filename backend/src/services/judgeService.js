const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

// Language configurations
const LANGUAGE_CONFIG = {
  python: {
    extension: 'py',
    compileCmd: null,
    runCmd: (filename) => `python ${filename}`
  },
  javascript: {
    extension: 'js',
    compileCmd: null,
    runCmd: (filename) => `node ${filename}`
  },
  cpp: {
    extension: 'cpp',
    compileCmd: (filename) => `g++ ${filename} -o ${filename}.out`,
    runCmd: (filename) => `./${filename}.out`
  },
  java: {
    extension: 'java',
    compileCmd: (filename) => `javac ${filename}`,
    runCmd: (filename) => `java ${path.basename(filename, '.java')}`
  }
};

class JudgeService {
  async judgeSubmission(submissionId, problem, testCases, code, language) {
    try {
      // Update status to judging
      await Submission.findByIdAndUpdate(submissionId, { 
        status: 'judging' 
      });

      const langConfig = LANGUAGE_CONFIG[language];
      if (!langConfig) {
        await this.updateSubmissionError(submissionId, 'Unsupported language');
        return;
      }

      // Create temp directory for this submission
      const tempDir = path.join(__dirname, '../../temp', submissionId.toString());
      await fs.mkdir(tempDir, { recursive: true });

      const filename = path.join(tempDir, `solution.${langConfig.extension}`);
      await fs.writeFile(filename, code);

      // Compile if needed
      if (langConfig.compileCmd) {
        const compileResult = await this.executeCommand(
          langConfig.compileCmd(filename),
          tempDir,
          5000
        );

        if (compileResult.error) {
          await this.updateSubmissionError(
            submissionId, 
            compileResult.stderr || 'Compilation error',
            'compile_error'
          );
          await this.cleanup(tempDir);
          return;
        }
      }

      // Run test cases
      let passedTests = 0;
      let totalTime = 0;
      let maxMemory = 0;

      for (const testCase of testCases) {
        const result = await this.runTestCase(
          langConfig.runCmd(filename),
          tempDir,
          testCase.input,
          testCase.expectedOutput,
          problem.timeLimit,
          problem.memoryLimit
        );

        if (result.status === 'passed') {
          passedTests++;
        } else if (result.status === 'time_limit') {
          await this.updateSubmissionError(
            submissionId,
            'Time Limit Exceeded',
            'time_limit',
            passedTests,
            testCases.length
          );
          await this.cleanup(tempDir);
          return;
        } else if (result.status === 'runtime_error') {
          await this.updateSubmissionError(
            submissionId,
            result.error,
            'runtime_error',
            passedTests,
            testCases.length
          );
          await this.cleanup(tempDir);
          return;
        } else if (result.status === 'wrong_answer') {
          await this.updateSubmissionError(
            submissionId,
            'Wrong Answer',
            'wrong_answer',
            passedTests,
            testCases.length
          );
          await this.cleanup(tempDir);
          return;
        }

        totalTime += result.time;
        maxMemory = Math.max(maxMemory, result.memory || 0);
      }

      // All tests passed
      await Submission.findByIdAndUpdate(submissionId, {
        status: 'accepted',
        testCasesPassed: passedTests,
        totalTestCases: testCases.length,
        executionTime: totalTime,
        memory: maxMemory
      });

      // Update problem stats
      await Problem.findByIdAndUpdate(problem._id, {
        $inc: { acceptedCount: 1, submissionCount: 1 }
      });

      // Update user stats
      await User.findByIdAndUpdate(
        (await Submission.findById(submissionId)).userId,
        { $inc: { solvedProblems: 1 } }
      );

      // Cleanup
      await this.cleanup(tempDir);

    } catch (error) {
      console.error('Judge error:', error);
      await this.updateSubmissionError(submissionId, 'Internal judge error');
    }
  }

  async runTestCase(runCmd, cwd, input, expectedOutput, timeLimit, memoryLimit) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const child = exec(runCmd, {
        cwd,
        timeout: timeLimit,
        maxBuffer: memoryLimit * 1024 * 1024
      }, (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;

        if (error) {
          if (error.killed || error.signal === 'SIGTERM') {
            return resolve({ status: 'time_limit', time: executionTime });
          }
          return resolve({ 
            status: 'runtime_error', 
            error: stderr || error.message,
            time: executionTime
          });
        }

        // Compare output (trim whitespace)
        const actualOutput = stdout.trim();
        const expected = expectedOutput.trim();

        if (actualOutput === expected) {
          return resolve({ 
            status: 'passed', 
            time: executionTime,
            memory: 0 // TODO: Get actual memory usage
          });
        } else {
          return resolve({ 
            status: 'wrong_answer',
            time: executionTime
          });
        }
      });

      // Send input to stdin
      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }
    });
  }

  async executeCommand(cmd, cwd, timeout) {
    return new Promise((resolve) => {
      exec(cmd, { cwd, timeout }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr });
      });
    });
  }

  async updateSubmissionError(submissionId, errorMessage, status = 'runtime_error', passed = 0, total = 0) {
    await Submission.findByIdAndUpdate(submissionId, {
      status,
      errorMessage,
      testCasesPassed: passed,
      totalTestCases: total
    });

    // Increment submission count
    const submission = await Submission.findById(submissionId);
    await Problem.findByIdAndUpdate(submission.problemId, {
      $inc: { submissionCount: 1 }
    });
  }

  async cleanup(tempDir) {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new JudgeService();