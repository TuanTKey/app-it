const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    await TestCase.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@codejudge.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
      rating: 2000
    });

    console.log('✅ Created admin user');

    // Create test users
    const users = await User.insertMany([
      {
        username: 'alice',
        email: 'alice@example.com',
        password: 'password123',
        fullName: 'Alice Johnson',
        rating: 1500
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: 'password123',
        fullName: 'Bob Smith',
        rating: 1300
      }
    ]);

    console.log('✅ Created test users');

    // Create sample problems
    const problem1 = await Problem.create({
      title: 'Two Sum',
      slug: 'two-sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
      difficulty: 'easy',
      timeLimit: 2000,
      memoryLimit: 256,
      inputFormat: 'First line: array of integers\nSecond line: target integer',
      outputFormat: 'Two indices separated by space',
      constraints: '2 <= nums.length <= 10^4',
      tags: ['array', 'hash-table'],
      createdBy: admin._id
    });

    // Add test cases for Two Sum
    await TestCase.insertMany([
      {
        problemId: problem1._id,
        input: '2 7 11 15\n9',
        expectedOutput: '0 1',
        isHidden: false
      },
      {
        problemId: problem1._id,
        input: '3 2 4\n6',
        expectedOutput: '1 2',
        isHidden: false
      },
      {
        problemId: problem1._id,
        input: '1 5 3 7 9\n8',
        expectedOutput: '1 3',
        isHidden: true
      }
    ]);

    console.log('✅ Created problem: Two Sum');

    const problem2 = await Problem.create({
      title: 'Reverse String',
      slug: 'reverse-string',
      description: `Write a function that reverses a string.

Example:
Input: "hello"
Output: "olleh"`,
      difficulty: 'easy',
      timeLimit: 1000,
      memoryLimit: 128,
      inputFormat: 'A single line containing the string',
      outputFormat: 'The reversed string',
      constraints: '1 <= s.length <= 10^5',
      tags: ['string', 'two-pointers'],
      createdBy: admin._id
    });

    await TestCase.insertMany([
      {
        problemId: problem2._id,
        input: 'hello',
        expectedOutput: 'olleh',
        isHidden: false
      },
      {
        problemId: problem2._id,
        input: 'CodeJudge',
        expectedOutput: 'egduJedoC',
        isHidden: true
      }
    ]);

    console.log('✅ Created problem: Reverse String');

    const problem3 = await Problem.create({
      title: 'Palindrome Number',
      slug: 'palindrome-number',
      description: `Given an integer x, return true if x is a palindrome, and false otherwise.

Example:
Input: 121
Output: true

Input: -121
Output: false`,
      difficulty: 'easy',
      timeLimit: 1500,
      memoryLimit: 128,
      inputFormat: 'A single integer',
      outputFormat: 'true or false',
      constraints: '-2^31 <= x <= 2^31 - 1',
      tags: ['math'],
      createdBy: admin._id
    });

    await TestCase.insertMany([
      {
        problemId: problem3._id,
        input: '121',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        problemId: problem3._id,
        input: '-121',
        expectedOutput: 'false',
        isHidden: false
      },
      {
        problemId: problem3._id,
        input: '12321',
        expectedOutput: 'true',
        isHidden: true
      }
    ]);

    console.log('✅ Created problem: Palindrome Number');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('User1: username=alice, password=password123');
    console.log('User2: username=bob, password=password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();