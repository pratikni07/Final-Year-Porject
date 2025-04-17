// const fs = require("fs-extra");
// const path = require("path");
// const { exec } = require("child_process");
// const Problem = require("../models/Problem");

// const BASE_DIR = path.join(__dirname, "../jobcode");

// // const runCode = async (language, filePath, input) => {
// //   return new Promise((resolve, reject) => {
// //     let command = "";
// //     console.log(language, filePath, input);

// //     if (language === "c++") {
// //       command = `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`;
// //     } else if (language === "java") {
// //       command = `javac ${filePath} && java -cp ${path.dirname(
// //         filePath
// //       )} ${path.basename(filePath, ".java")}`;
// //     } else if (language === "python") {
// //       command = `python3 ${filePath}`;
// //     } else {
// //       return reject("Unsupported language");
// //     }

// //     exec(command, { input }, (error, stdout, stderr) => {
// //       if (error) return reject(stderr || error.message);
// //       resolve(stdout.trim());
// //     });
// //   });
// // };

// exports.getCode = async (req, res) => {
//   try {
//     const { jobId } = req.body;
//     const problem = await Problem.find({ jobId: jobId });

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     res.status(200).json(problem);
//   } catch (error) {
//     console.error("Error fetching problem:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// const cleanupFiles = async (filePath) => {
//   try {
//     // Remove the source file
//     await fs.remove(filePath);
//     // Remove compiled files if they exist
//     await fs.remove(`${filePath}.out`);
//     await fs.remove(`${filePath.replace(/\.[^/.]+$/, "")}.class`);
//   } catch (error) {
//     console.error("Cleanup error:", error);
//   }
// };

// // Function to format code based on language
// const formatCode = (code, language, input) => {
//   switch (language.toLowerCase()) {
//     case "python":
//       return `
// import sys
// ${code}
// if __name__ == "__main__":
//     input_data = """${input}""".strip().split()
//     # Convert input to appropriate types if needed
//     nums = [int(x) for x in input_data]
//     print(solution(nums))`;

//     case "javascript":
//       return `
// ${code}
// const input = \`${input}\`.trim().split(' ').map(Number);
// console.log(solution(input));`;

//     case "java":
//       return `
// import java.util.*;
// public class Solution {
//     ${code}
//     public static void main(String[] args) {
//         String[] input = "${input}".trim().split(" ");
//         int[] nums = new int[input.length];
//         for(int i = 0; i < input.length; i++) {
//             nums[i] = Integer.parseInt(input[i]);
//         }
//         Solution solution = new Solution();
//         System.out.println(solution.solution(nums));
//     }
// }`;

//     case "c++":
//       return `
// #include <iostream>
// #include <string>
// #include <vector>
// #include <sstream>
// using namespace std;
// ${code}
// int main() {
//     string input = "${input}";
//     stringstream ss(input);
//     vector<int> nums;
//     int temp;
//     while (ss >> temp) {
//         nums.push_back(temp);
//     }
//     Solution solution;
//     cout << solution.solution(nums) << endl;
//     return 0;
// }`;

//     default:
//       throw new Error("Unsupported language");
//   }
// };

// // Function to get file extension for language
// const getFileExtension = (language) => {
//   switch (language.toLowerCase()) {
//     case "python":
//       return ".py";
//     case "javascript":
//       return ".js";
//     case "java":
//       return ".java";
//     case "c++":
//       return ".c++";
//     default:
//       throw new Error("Unsupported language");
//   }
// };

// // Function to execute code
// const runCode = async (language, filePath, input) => {
//   return new Promise((resolve, reject) => {
//     let command = "";
//     const timeoutMs = 5000; // 5 second timeout

//     switch (language.toLowerCase()) {
//       case "python":
//         command = `python3 "${filePath}"`;
//         break;
//       case "javascript":
//         command = `node "${filePath}"`;
//         break;
//       case "java":
//         command = `javac "${filePath}" && java -cp "${path.dirname(
//           filePath
//         )}" Solution`;
//         break;
//       case "c++":
//         const outputFile = `"${filePath}.out"`;
//         command = `g++ "${filePath}" -o ${outputFile} && ${outputFile}`;
//         break;
//       default:
//         return reject(new Error("Unsupported language"));
//     }

//     exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
//       if (error) {
//         return reject(new Error(stderr || error.message));
//       }
//       resolve(stdout.trim());
//     });
//   });
// };

// // Execute code endpoint
// exports.executeCode = async (req, res) => {
//   const { jobId, problemId, userId, language, code } = req.body;

//   if (!jobId || !problemId || !userId || !language || !code) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   let filePath = null;

//   try {
//     // Find the problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ error: "Problem not found" });
//     }

//     // Create directory for this execution
//     const problemDir = path.join(
//       BASE_DIR,
//       `jobcode-${jobId}`,
//       problemId.toString()
//     );
//     await fs.ensureDir(problemDir);

//     // Create unique file for this submission
//     const fileExtension = getFileExtension(language);
//     filePath = path.join(problemDir, `${userId}_${Date.now()}${fileExtension}`);

//     const results = [];

//     // Run sample test cases
//     for (const testCase of problem.sampleTestCase) {
//       try {
//         // Format code with the test case input
//         const formattedCode = formatCode(code, language, testCase.input);

//         // Write formatted code to file
//         await fs.writeFile(filePath, formattedCode);

//         // Execute code
//         const output = await runCode(language, filePath, testCase.input);

//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: output,
//           passed: output.trim() === testCase.output.trim(),
//         });
//       } catch (error) {
//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: error.message,
//           passed: false,
//           error: true,
//         });
//       }
//     }

//     res.json({ success: true, results });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     // Cleanup generated files
//     if (filePath) {
//       await cleanupFiles(filePath);
//     }
//   }
// };

// // Submit code endpoint
// exports.submitCode = async (req, res) => {
//   const { jobId, problemId, userId, language, code } = req.body;

//   if (!jobId || !problemId || !userId || !language || !code) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   let filePath = null;

//   try {
//     // Find the problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ error: "Problem not found" });
//     }

//     // Create directory for this submission
//     const problemDir = path.join(
//       BASE_DIR,
//       `jobcode-${jobId}`,
//       problemId.toString()
//     );
//     await fs.ensureDir(problemDir);

//     // Create unique file for this submission
//     const fileExtension = getFileExtension(language);
//     filePath = path.join(problemDir, `${userId}_${Date.now()}${fileExtension}`);

//     const results = [];
//     let allPassed = true;

//     // Run all test cases
//     for (const testCase of problem.TestCase) {
//       try {
//         // Format code with the test case input
//         const formattedCode = formatCode(code, language, testCase.input);

//         // Write formatted code to file
//         await fs.writeFile(filePath, formattedCode);

//         // Execute code
//         const output = await runCode(language, filePath, testCase.input);

//         const passed = output.trim() === testCase.output.trim();
//         if (!passed) allPassed = false;

//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: output,
//           passed,
//         });
//       } catch (error) {
//         allPassed = false;
//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: error.message,
//           passed: false,
//           error: true,
//         });
//       }
//     }

//     if (!allPassed) {
//       return res.json({
//         success: false,
//         message: "Some test cases failed",
//         results,
//       });
//     }

//     res.json({
//       success: true,
//       message: "All test cases passed",
//       results,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     // Cleanup generated files
//     if (filePath) {
//       await cleanupFiles(filePath);
//     }
//   }
// };
// // exports.executeCode = async (req, res) => {
// //   try {
// //     const { jobId, problemId, userId, language, code } = req.body;
// //     // console.log(jobId, problemId, userId, language, code);

// //     if (!jobId || !problemId || !userId || !language || !code) {
// //       return res.status(400).json({ error: "All fields are required" });
// //     }

// //     const problem = await Problem.findById(problemId);
// //     if (!problem) return res.status(404).json({ error: "Problem not found" });

// //     const problemDir = path.join(
// //       BASE_DIR,
// //       `jobcode-${jobId}`,
// //       problemId.toString()
// //     );
// //     await fs.ensureDir(problemDir);

// //     const filePath = path.join(problemDir, `${userId}.${language}`);
// //     await fs.writeFile(filePath, code);

// //     const results = [];
// //     for (const testCase of problem.sampleTestCase) {
// //       const output = await runCode(language, filePath, testCase.input);
// //       results.push({
// //         input: testCase.input,
// //         expected: testCase.output,
// //         received: output,
// //         passed: output === testCase.output,
// //       });
// //     }
// //     console.log(5);

// //     res.json({ success: true, results });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // exports.submitCode = async (req, res) => {
// //   try {
// //     const { jobId, problemId, userId, language, code } = req.body;

// //     if (!jobId || !problemId || !userId || !language || !code) {
// //       return res.status(400).json({ error: "All fields are required" });
// //     }

// //     const problem = await Problem.findById(problemId);
// //     if (!problem) return res.status(404).json({ error: "Problem not found" });

// //     const problemDir = path.join(
// //       BASE_DIR,
// //       `jobcode-${jobId}`,
// //       problemId.toString()
// //     );
// //     await fs.ensureDir(problemDir);

// //     const filePath = path.join(problemDir, `${userId}.${language}`);
// //     await fs.writeFile(filePath, code);

// //     const results = [];
// //     let allPassed = true;

// //     for (const testCase of problem.TestCase) {
// //       const output = await runCode(language, filePath, testCase.input);
// //       const passed = output === testCase.output;
// //       results.push({
// //         input: testCase.input,
// //         expected: testCase.output,
// //         received: output,
// //         passed,
// //       });

// //       if (!passed) {
// //         allPassed = false;
// //       }
// //     }

// //     if (!allPassed) {
// //       return res.json({
// //         success: false,
// //         message: "Some test cases failed",
// //         results,
// //       });
// //     }

// //     res.json({ success: true, message: "All test cases passed" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const Problem = require("../models/Problem");

const BASE_DIR = path.join(__dirname, "../jobcode");
console.log(BASE_DIR);

exports.getCode = async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log(jobId);
    const problem = await Problem.find({ jobId: jobId });
    console.log(problem);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cleanupFiles = async (filePath) => {
  try {
    await fs.remove(filePath);
    await fs.remove(`${filePath}.out`);
    await fs.remove(`${filePath.replace(/\.[^/.]+$/, "")}.class`);
  } catch (error) {
    console.error("Cleanup error:", error);
  }
};

const fileExtensions = {
  cpp: ".cpp",
  "c++": ".cpp",
  java: ".java",
  python: ".py",
  javascript: ".js",
};
const getFileExtension = (language) => {
  switch (language.toLowerCase()) {
    case "python":
      return ".py";
    case "javascript":
      return ".js";
    case "java":
      return ".java";
    case "c++":
      return ".cpp";
    default:
      throw new Error("Unsupported language");
  }
};

const getCommands = (language, filePath) => {
  switch (language.toLowerCase()) {
    case "python":
      return {
        compile: null,
        execute: `python3 "${filePath}"`,
      };
    case "javascript":
      return {
        compile: null,
        execute: `node "${filePath}"`,
      };
    case "java":
      return {
        compile: `javac "${filePath}"`,
        execute: `java -cp "${path.dirname(filePath)}" Solution`,
      };
    case "c++": {
      const outputFile = `"${filePath}.out"`;
      return {
        compile: `g++ -std=c++11 "${filePath}" -o ${outputFile}`,
        execute: outputFile,
      };
    }
    default:
      throw new Error("Unsupported language");
  }
};

// Function to execute code
const runCode = async (language, filePath, input) => {
  return new Promise((resolve, reject) => {
    const timeoutMs = 5000;
    const commands = getCommands(language, filePath);

    const executeCode = () => {
      const process = exec(
        commands.execute,
        { timeout: timeoutMs },
        (error, stdout, stderr) => {
          if (error && !stderr.includes("Warning")) {
            return reject(new Error(stderr || error.message));
          }
          resolve(stdout.trim());
        }
      );

      if (input) {
        process.stdin.write(input + "\n");
        process.stdin.end();
      }
    };

    // If compilation is needed
    if (commands.compile) {
      exec(commands.compile, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr || error.message));
        }
        executeCode();
      });
    } else {
      executeCode();
    }
  });
};

// Execute code endpoint
exports.executeCode = async (req, res) => {
  const { jobId, problemId, userId, language, code } = req.body;
  let filePath = null;

  try {
    if (!jobId || !problemId || !userId || !language || !code) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const problemDir = path.join(
      BASE_DIR,
      `jobcode-${jobId}`,
      problemId.toString()
    );
    await fs.ensureDir(problemDir);

    const fileExtension = getFileExtension(language);
    filePath = path.join(problemDir, `${userId}_${Date.now()}${fileExtension}`);
    await fs.writeFile(filePath, code);

    const results = [];

    for (const testCase of problem.sampleTestCase) {
      try {
        const output = await runCode(language, filePath, testCase.input);
        results.push({
          input: testCase.input,
          expected: testCase.output,
          received: output,
          passed: output.trim() === testCase.output.trim(),
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.output,
          received: error.message,
          passed: false,
          error: true,
        });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath) {
      await cleanupFiles(filePath);
    }
  }
};

// exports.submitCode = async (req, res) => {
//   const { jobId, problemId, userId, language, code } = req.body;
//   let filePath = null;
//   try {
//     if (!jobId || !problemId || !userId || !language || !code) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ error: "Problem not found" });
//     }

//     const jobCodeDir = path.join(BASE_DIR, `jobcode-${jobId}`);
//     await fs.ensureDir(jobCodeDir);

//     // Generate filename with specific extension
//     const fileExtensions = {
//       cpp: ".cpp",
//       "c++": ".cpp",
//       java: ".java",
//       python: ".py",
//     };

//     const ext = fileExtensions[language.toLowerCase()];
//     if (!ext) {
//       return res.status(400).json({ error: "Unsupported language" });
//     }

//     const filename = `${problemId}-${userId}${ext}`;
//     filePath = path.join(jobCodeDir, filename);

//     await fs.writeFile(filePath, code);

//     const results = [];
//     let allPassed = true;
//     for (const testCase of problem.TestCase) {
//       try {
//         const output = await runCode(language, filePath, testCase.input);
//         const passed = output.trim() === testCase.output.trim();
//         if (!passed) allPassed = false;
//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: output,
//           passed,
//         });
//       } catch (error) {
//         allPassed = false;
//         results.push({
//           input: testCase.input,
//           expected: testCase.output,
//           received: error.message,
//           passed: false,
//           error: true,
//         });
//       }
//     }

//     if (!allPassed) {
//       return res.json({
//         success: false,
//         message: "Some test cases failed",
//         results,
//       });
//     }

//     res.json({
//       success: true,
//       message: "All test cases passed",
//       results,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (filePath) {
//       await cleanupFiles(filePath);
//     }
//   }
// };

exports.submitCode = async (req, res) => {
  const { jobId, problemId, userId, language, code } = req.body;
  let filePath = null;

  try {
    if (!jobId || !problemId || !userId || !language || !code) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const ext = fileExtensions[language.toLowerCase()];
    if (!ext) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const jobCodeDir = path.join(BASE_DIR, `jobcode-${jobId}`);
    await fs.ensureDir(jobCodeDir);

    // Save file in the format: jobcode/jobcode-jobId/problemId-userId.ext
    const filename = `${problemId}-${userId}${ext}`;
    filePath = path.join(jobCodeDir, filename);

    await fs.writeFile(filePath, code);

    const results = [];
    let allPassed = true;

    for (const testCase of problem.TestCase) {
      try {
        const output = await runCode(language, filePath, testCase.input);
        const passed = output.trim() === testCase.output.trim();
        if (!passed) allPassed = false;
        results.push({
          input: testCase.input,
          expected: testCase.output,
          received: output,
          passed,
        });
      } catch (error) {
        allPassed = false;
        results.push({
          input: testCase.input,
          expected: testCase.output,
          received: error.message,
          passed: false,
          error: true,
        });
      }
    }

    if (!allPassed) {
      return res.json({
        success: false,
        message: "Some test cases failed",
        results,
      });
    }

    res.json({
      success: true,
      message: "All test cases passed",
      results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath) {
      await cleanupFiles(filePath);
    }
  }
};
