import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '@monaco-editor/react';
import { Play, Clock, Database, AlertCircle, CheckCircle } from 'lucide-react';

const ProblemSolve = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const languageTemplates = {
<<<<<<< HEAD
    python: '# Write your solution here\n\ndef solution():\n    pass\n',
    javascript: '// Write your solution here\n\nfunction solution() {\n    \n}\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
    java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n'
=======
    python: '# Write your solution here\ns = input().strip()\nreversed_s = s[::-1]\nprint(reversed_s)\n',
    javascript: '// Write your solution here\nconst input = require("fs").readFileSync(0, "utf-8").trim();\nconst reversed = input.split("").reverse().join("");\nconsole.log(reversed);\n',
    cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}\n',
    java: 'import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String reversed = new StringBuilder(s).reverse().toString();\n        System.out.println(reversed);\n    }\n}\n'
>>>>>>> b5656b1 (fix AI chấm bài thi)
  };

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const fetchProblem = async () => {
    try {
<<<<<<< HEAD
      const response = await api.get(`/problems/slug/${slug}`);
=======
      console.log('Fetching problem with slug:', slug);
      const response = await api.get(`/problems/slug/${slug}`);
      console.log('Problem fetched:', response.data);
>>>>>>> b5656b1 (fix AI chấm bài thi)
      setProblem(response.data.problem);
      setSampleTestCases(response.data.sampleTestCases);
      setCode(languageTemplates[language]);
    } catch (error) {
      console.error('Error fetching problem:', error);
<<<<<<< HEAD
=======
      console.error('Error details:', error.response);
      alert('Failed to load problem. Redirecting to problems page.');
>>>>>>> b5656b1 (fix AI chấm bài thi)
      navigate('/problems');
    }
  };

  const handleSubmit = async () => {
<<<<<<< HEAD
    if (!code.trim()) {
=======
    console.log('=== SUBMIT BUTTON CLICKED ===');
    console.log('Code:', code);
    console.log('Code length:', code.trim().length);
    console.log('Language:', language);
    console.log('Problem:', problem);

    if (!code.trim()) {
      console.error('Code is empty!');
>>>>>>> b5656b1 (fix AI chấm bài thi)
      alert('Please write some code first!');
      return;
    }

<<<<<<< HEAD
=======
    if (!problem || !problem._id) {
      console.error('Problem or Problem ID is missing!');
      alert('Problem not loaded. Please refresh the page.');
      return;
    }

    console.log('Validation passed. Preparing submission...');

    const submissionData = {
      problemId: problem._id,
      code: code,
      language: language
    };

    console.log('Submission data:', submissionData);

>>>>>>> b5656b1 (fix AI chấm bài thi)
    setSubmitting(true);
    setResult(null);

    try {
<<<<<<< HEAD
      const response = await api.post('/submissions', {
        problemId: problem._id,
        code,
        language
      });

      const submissionId = response.data.submissionId;

      // Poll for result
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await api.get(`/submissions/${submissionId}`);
          const submission = statusResponse.data.submission;

          if (submission.status !== 'pending' && submission.status !== 'judging') {
=======
      console.log('Sending POST request to /submissions...');
      console.log('API base URL:', api.defaults.baseURL);
      
      const response = await api.post('/submissions', submissionData);
      
      console.log('✅ Submit response:', response);
      console.log('Response data:', response.data);

      const submissionId = response.data.submissionId;
      console.log('Submission ID:', submissionId);

      if (!submissionId) {
        throw new Error('No submission ID received from server');
      }

      // Poll for result
      console.log('Starting to poll for results...');
      let pollCount = 0;
      const maxPolls = 30;

      const pollInterval = setInterval(async () => {
        try {
          pollCount++;
          console.log(`Polling attempt ${pollCount}/${maxPolls}...`);
          
          const statusResponse = await api.get(`/submissions/${submissionId}`);
          const submission = statusResponse.data.submission;

          console.log('Current status:', submission.status);

          if (submission.status !== 'pending' && submission.status !== 'judging') {
            console.log('✅ Final result received:', submission);
>>>>>>> b5656b1 (fix AI chấm bài thi)
            setResult(submission);
            setSubmitting(false);
            clearInterval(pollInterval);
          }
<<<<<<< HEAD
        } catch (error) {
          console.error('Error polling submission:', error);
          clearInterval(pollInterval);
          setSubmitting(false);
        }
      }, 1000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (submitting) {
          setSubmitting(false);
          setResult({ status: 'error', errorMessage: 'Submission timeout' });
        }
      }, 30000);

    } catch (error) {
      console.error('Error submitting solution:', error);
      setSubmitting(false);
      alert(error.response?.data?.error || 'Submission failed');
=======

          if (pollCount >= maxPolls) {
            console.warn('Max polling attempts reached');
            clearInterval(pollInterval);
            setSubmitting(false);
            setResult({ 
              status: 'error', 
              errorMessage: 'Judging timeout. Please check submissions history.' 
            });
          }
        } catch (error) {
          console.error('Error polling submission:', error);
          console.error('Polling error details:', error.response);
          clearInterval(pollInterval);
          setSubmitting(false);
          setResult({ 
            status: 'error', 
            errorMessage: error.response?.data?.error || 'Error checking submission status' 
          });
        }
      }, 1000);

    } catch (error) {
      console.error('❌ SUBMISSION ERROR:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      setSubmitting(false);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message
        || error.message 
        || 'Submission failed. Please check console for details.';
      
      alert('Submission Error: ' + errorMessage);
      
      setResult({ 
        status: 'error', 
        errorMessage: errorMessage 
      });
>>>>>>> b5656b1 (fix AI chấm bài thi)
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'wrong_answer':
      case 'time_limit':
      case 'runtime_error':
      case 'compile_error':
<<<<<<< HEAD
=======
      case 'error':
>>>>>>> b5656b1 (fix AI chấm bài thi)
        return <AlertCircle className="text-red-600" size={24} />;
      default:
        return <Clock className="text-yellow-600" size={24} />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      accepted: 'Accepted ✅',
      wrong_answer: 'Wrong Answer ❌',
      time_limit: 'Time Limit Exceeded ⏰',
      runtime_error: 'Runtime Error 💥',
      compile_error: 'Compilation Error 🔧',
<<<<<<< HEAD
=======
      error: 'Error ❌',
>>>>>>> b5656b1 (fix AI chấm bài thi)
      pending: 'Pending...',
      judging: 'Judging...'
    };
    return statusMap[status] || status;
  };

  if (!problem) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {problem.difficulty.toUpperCase()}
              </span>
              <span className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                {problem.timeLimit}ms
              </span>
              <span className="flex items-center text-gray-600">
                <Database size={16} className="mr-1" />
                {problem.memoryLimit}MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Problem Description</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {problem.description}
            </div>
          </div>

          {problem.inputFormat && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-2">Input Format</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{problem.inputFormat}</p>
            </div>
          )}

          {problem.outputFormat && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-2">Output Format</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{problem.outputFormat}</p>
            </div>
          )}

          {problem.constraints && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="font-bold mb-2">Constraints</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{problem.constraints}</p>
            </div>
          )}

          {/* Sample Test Cases */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold mb-4">Sample Test Cases</h3>
            {sampleTestCases.map((testCase, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-50 rounded">
                <div className="mb-2">
                  <strong>Input:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-sm">{testCase.input}</pre>
                </div>
                <div>
                  <strong>Expected Output:</strong>
                  <pre className="mt-1 p-2 bg-white rounded border text-sm">{testCase.expectedOutput}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={submitting}
<<<<<<< HEAD
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              <Play size={18} />
              <span>{submitting ? 'Submitting...' : 'Submit'}</span>
=======
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} />
              <span>{submitting ? 'Judging...' : 'Submit'}</span>
>>>>>>> b5656b1 (fix AI chấm bài thi)
            </button>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Result Panel */}
          {result && (
            <div className={`p-4 ${
              result.status === 'accepted' ? 'bg-green-900' : 'bg-red-900'
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(result.status)}
                <span className="text-white font-bold text-lg">
                  {getStatusText(result.status)}
                </span>
              </div>

              {result.status === 'accepted' ? (
                <div className="text-white">
                  <p>✨ All test cases passed!</p>
                  <p className="text-sm mt-1">
                    {result.testCasesPassed}/{result.totalTestCases} test cases • 
                    {result.executionTime}ms
                  </p>
                </div>
              ) : (
                <div className="text-white">
<<<<<<< HEAD
                  <p>{result.errorMessage}</p>
                  <p className="text-sm mt-1">
                    {result.testCasesPassed}/{result.totalTestCases} test cases passed
                  </p>
=======
                  <p>{result.errorMessage || 'Submission failed'}</p>
                  {result.testCasesPassed !== undefined && (
                    <p className="text-sm mt-1">
                      {result.testCasesPassed}/{result.totalTestCases} test cases passed
                    </p>
                  )}
>>>>>>> b5656b1 (fix AI chấm bài thi)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;