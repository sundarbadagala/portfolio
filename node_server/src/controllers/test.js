const Test = require("../models/test");
const { getNanoId } = require("../utils/methods");
const { GenerateTestDto } = require("../dto/test.dto");
const { model } = require("../utils/llm");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { setTest, getTest, deleteTest: removeTestFromRedis } = require("../utils/redis");

/**
 * Standard list of available subjects with descriptions and categories
 */
const AVAILABLE_SUBJECTS = [
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    category: "Programming Language",
    description: "Core JavaScript concepts, ES6+, closures, event loop, async/await, DOM manipulation, and modern JS features."
  },
  {
    id: "react.js",
    name: "React.js",
    slug: "react-js",
    category: "Frontend Framework",
    description: "React fundamentals, JSX, hooks (useState, useEffect, custom hooks), component lifecycle, state management, and Virtual DOM."
  },
  {
    id: "next.js",
    name: "Next.js",
    slug: "next-js",
    category: "Fullstack Framework",
    description: "Next.js App Router, SSR, SSG, ISR, API Routes, middleware, server actions, and performance optimization."
  },
  {
    id: "css",
    name: "CSS",
    slug: "css",
    category: "Styling & Layout",
    description: "CSS3 fundamentals, Flexbox, CSS Grid, animations, transitions, responsive web design, media queries, and specificity."
  },
  {
    id: "html",
    name: "HTML",
    slug: "html",
    category: "Markup Language",
    description: "Semantic HTML5, web accessibility (a11y), forms & validation, SEO best practices, audio/video, and DOM structure."
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    category: "Programming Language",
    description: "Static typing, generics, interfaces, types, decorators, union types, and TypeScript compiler configurations."
  },
  {
    id: "node.js",
    name: "Node.js",
    slug: "node-js",
    category: "Runtime & Backend",
    description: "Node.js runtime, event-driven architecture, streams, buffer, file system, HTTP module, and Express.js backend patterns."
  }
];

// Initialize LangChain JsonOutputParser
const jsonOutputParser = new JsonOutputParser();

// Build LangChain ChatPromptTemplate
const testPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert technical interviewer and educator creating a high-quality technical multiple-choice assessment.

Generate exactly {number_questions} unique multiple-choice questions for subject: "{subject}" at difficulty level: "{level}".

STRICT REQUIREMENTS:
1. Return ONLY a valid JSON array of question objects.
2. Every question must have EXACTLY 4 options in the "options" array.
3. Exactly ONE option must have "is_correct": true, and the other 3 options must have "is_correct": false.
4. The "options" array MUST contain 4 option objects.
5. Each option object MUST contain:
   - "option_1": the text of the option (a clear, unambiguous answer choice)
   - "options_id": a unique option id string (e.g., "OPT_1", "OPT_2", etc.)
   - "is_correct": boolean (true for the single correct answer, false for the other 3 options)
6. Ensure questions are technically accurate, relevant to "{subject}", and match the "{level}" difficulty level.
7. Include a helpful hint for each question in the "hint" field that assists the user without revealing the answer.
8. Specify the exact sub-concept tested in the "concept" field (e.g., "Closures", "useEffect hook", "Flexbox alignment", "Event Delegation").
9. "marks" must be 1, and "question_type" must be "single_select".

Format instructions:
{format_instructions}`
  ],
  [
    "human",
    "Please generate the technical assessment questions for {subject} ({level} level) now."
  ]
]);

// Build LangChain LCEL (LangChain Expression Language) Runnable Chain
const testGenerationChain = testPromptTemplate.pipe(model).pipe(jsonOutputParser);

/**
 * Fallback parser to extract JSON array if raw string parsing is needed
 */
function extractJsonArray(rawText) {
  if (!rawText) {
    throw new Error("Empty response received from AI model");
  }

  let cleaned = typeof rawText === "string" ? rawText.trim() : JSON.stringify(rawText);
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  const parsed = JSON.parse(cleaned);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
  throw new Error("Parsed content is not an array of questions");
}

/**
 * @desc Get all available subjects for tests
 * @route GET /api/v1/tests/subjects
 * @access Public
 */
async function getAvailableSubjects(req, res, next) {
  try {
    return res.sendSuccess(
      AVAILABLE_SUBJECTS,
      "Available subjects retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Generate AI-powered online test questions using LangChain
 * @route POST /api/v1/tests/generate
 * @access Public / Private (records user ID if authenticated)
 */
async function generateTest(req, res, next) {
  try {
    const dto = new GenerateTestDto(req.body);
    dto.validate();

    const { subject, level, number_questions } = dto;

    const nanoidFn = await getNanoId();
    const testId = `TEST_${nanoidFn(10).toUpperCase()}`;

    let rawQuestions;
    try {
      rawQuestions = await testGenerationChain.invoke({
        subject,
        level,
        number_questions,
        format_instructions: jsonOutputParser.getFormatInstructions()
      });
    } catch (chainErr) {
      console.warn("LangChain JSON parser error, falling back to raw extraction:", chainErr.message);
      const formattedMessages = await testPromptTemplate.formatMessages({
        subject,
        level,
        number_questions,
        format_instructions: jsonOutputParser.getFormatInstructions()
      });
      const fallbackResponse = await model.invoke(formattedMessages);
      const rawContent = typeof fallbackResponse === "string" ? fallbackResponse : fallbackResponse?.content;
      rawQuestions = extractJsonArray(rawContent);
    }

    if (!rawQuestions || !Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      throw Object.assign(new Error("No questions were generated by the AI model"), { status: 502 });
    }

    // Process and normalize questions to ensure strict compliance with user format
    const processedQuestions = rawQuestions.slice(0, number_questions).map((q, qIndex) => {
      const qId = `QST_${nanoidFn(8).toUpperCase()}`;
      const questionText = q.question || q.question_1 || q.text || `Question ${qIndex + 1} on ${subject}`;

      // Normalize options
      let rawOptions = Array.isArray(q.options) ? q.options : [];

      // Ensure exactly 4 options
      if (rawOptions.length !== 4) {
        while (rawOptions.length < 4) {
          rawOptions.push({
            option_1: `Option ${rawOptions.length + 1}`,
            is_correct: false
          });
        }
        if (rawOptions.length > 4) {
          rawOptions = rawOptions.slice(0, 4);
        }
      }

      // Check correct options count: ensure exactly 1 is true
      const correctCount = rawOptions.filter(o => Boolean(o.is_correct)).length;
      if (correctCount === 0) {
        rawOptions[0].is_correct = true;
      } else if (correctCount > 1) {
        let firstFound = false;
        rawOptions.forEach(o => {
          if (o.is_correct && !firstFound) {
            firstFound = true;
          } else {
            o.is_correct = false;
          }
        });
      }

      const formattedOptions = rawOptions.map((opt, optIndex) => {
        const optId = `OPT_${nanoidFn(6).toUpperCase()}`;
        const optText = opt.option_1 || opt.option_text || opt.text || opt[`option_${optIndex + 1}`] || String(opt);

        const optionObj = {
          options_id: opt.options_id || optId,
          option_1: optText,
          option_text: optText,
          is_correct: Boolean(opt.is_correct)
        };
        // Add dynamic index alias (option_2, option_3, option_4) for convenience
        optionObj[`option_${optIndex + 1}`] = optText;

        return optionObj;
      });

      return {
        question: questionText,
        question_id: q.question_id || qId,
        options: formattedOptions,
        subject: subject,
        concept: q.concept || `${subject} Core Concepts`,
        hint: q.hint || "Review core documentation for this topic.",
        level: level,
        marks: Number(q.marks) || 1,
        question_type: "single_select"
      };
    });

    // Cache original test with true answer keys in Redis
    try {
      await setTest(testId, {
        test_id: testId,
        subject,
        level,
        number_of_questions: processedQuestions.length,
        questions: processedQuestions
      });
    } catch (redisErr) {
      console.warn("Failed to cache test in Redis:", redisErr.message);
    }

    // Persist generated test in MongoDB
    try {
      const newTest = new Test({
        test_id: testId,
        subject,
        level,
        number_of_questions: processedQuestions.length,
        questions: processedQuestions,
        created_by: req.user?.id || null
      });
      await newTest.save();
    } catch (dbErr) {
      console.error("Warning: Failed to persist test to database:", dbErr);
    }

    // Sanitize client questions: mark every option's is_correct to false
    const clientQuestions = processedQuestions.map((q) => ({
      ...q,
      test_id: testId,
      options: q.options.map((opt) => ({
        options_id: opt.options_id,
        option_1: opt.option_1,
        option_text: opt.option_text,
        is_correct: false
      }))
    }));

    // Support ?raw=true to return direct JSON array if requested
    if (req.query.raw === "true") {
      return res.status(200).json(clientQuestions);
    }

    return res.sendSuccess(
      clientQuestions,
      "Test questions generated successfully"
    );
  } catch (error) {
    console.error("generateTest error:", error);
    next(error);
  }
}

/**
 * @desc Get all saved tests with pagination
 * @route GET /api/v1/tests
 * @access Public
 */
async function getAllTests(req, res, next) {
  try {
    const { subject, level, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (subject) {
      filter.subject = new RegExp(`^${subject}$`, "i");
    }
    if (level) {
      filter.level = level.toLowerCase();
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [tests, total] = await Promise.all([
      Test.find(filter)
        .select("test_id subject level number_of_questions createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Test.countDocuments(filter)
    ]);

    return res.sendSuccess(
      {
        tests,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      },
      "Tests retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Get test details by test_id or _id
 * @route GET /api/v1/tests/:id
 * @access Public
 */
async function getTestById(req, res, next) {
  try {
    const { id } = req.params;
    const test = id.startsWith("TEST_")
      ? await Test.findOne({ test_id: id }).lean()
      : await Test.findById(id).lean();

    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }

    return res.sendSuccess(test, "Test retrieved successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Delete a test by test_id or _id
 * @route DELETE /api/v1/tests/:id
 * @access Private
 */
async function deleteTest(req, res, next) {
  try {
    const { id } = req.params;
    const test = id.startsWith("TEST_")
      ? await Test.findOneAndDelete({ test_id: id })
      : await Test.findByIdAndDelete(id);

    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }

    // Also clear from Redis if present
    if (id.startsWith("TEST_")) {
      await removeTestFromRedis(id);
    }

    return res.sendSuccess(null, "Test deleted successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Submit answered test, compare with saved data in Redis, compute total score, and clear Redis
 * @route POST /api/v1/tests/submit
 * @access Public / Private
 */
async function submitTest(req, res, next) {
  try {
    const body = req.body;
    let testId = req.query.test_id || req.headers["x-test-id"];
    let submittedQuestions = [];

    // Parse submitted questions payload (supports array or { test_id, questions })
    if (Array.isArray(body)) {
      submittedQuestions = body;
      if (!testId && submittedQuestions.length > 0) {
        testId = submittedQuestions[0].test_id;
      }
    } else if (body && typeof body === "object") {
      testId = testId || body.test_id;
      submittedQuestions = body.questions || body.answers || [];
      if (!testId && Array.isArray(submittedQuestions) && submittedQuestions.length > 0) {
        testId = submittedQuestions[0].test_id;
      }
    }

    if (!testId) {
      res.status(400);
      throw new Error("test_id is required to submit test");
    }

    if (!Array.isArray(submittedQuestions) || submittedQuestions.length === 0) {
      res.status(400);
      throw new Error("Submitted questions array is required");
    }

    // Retrieve original test data from Redis
    let cachedTest = await getTest(testId);

    // Fallback to MongoDB if Redis TTL expired or server restarted
    if (!cachedTest) {
      const dbTest = await Test.findOne({ test_id: testId }).lean();
      if (dbTest) {
        cachedTest = dbTest;
      }
    }

    if (!cachedTest || !cachedTest.questions) {
      res.status(404);
      throw new Error("Test session not found or has expired. Please generate a new test.");
    }

    const originalQuestions = cachedTest.questions;
    let totalMarks = 0;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = 0;

    const detailedReview = [];

    // Index submitted questions by question_id
    const submissionMap = new Map();
    for (const sq of submittedQuestions) {
      if (sq && sq.question_id) {
        submissionMap.set(sq.question_id, sq);
      }
    }

    for (const originalQ of originalQuestions) {
      const marks = Number(originalQ.marks) || 1;
      totalMarks += marks;

      // Find original correct option
      const correctOpt = originalQ.options.find((o) => Boolean(o.is_correct));
      const correctOptId = correctOpt ? correctOpt.options_id : null;
      const correctOptText = correctOpt ? correctOpt.option_1 : "";

      // Find user submission for this question
      const userQ = submissionMap.get(originalQ.question_id);
      let userSelectedOpt = null;

      if (userQ && Array.isArray(userQ.options)) {
        // User marked option as is_correct: true
        userSelectedOpt = userQ.options.find((o) => Boolean(o.is_correct));
      }

      const isAttempted = Boolean(userSelectedOpt);
      let isUserCorrect = false;

      if (isAttempted) {
        attemptedCount++;
        // Compare by options_id or option text
        if (
          (userSelectedOpt.options_id && userSelectedOpt.options_id === correctOptId) ||
          (userSelectedOpt.option_1 && userSelectedOpt.option_1 === correctOptText)
        ) {
          isUserCorrect = true;
          correctCount++;
          score += marks;
        } else {
          incorrectCount++;
        }
      }

      detailedReview.push({
        question_id: originalQ.question_id,
        question: originalQ.question,
        concept: originalQ.concept,
        hint: originalQ.hint,
        attempted: isAttempted,
        user_selected_option: userSelectedOpt ? {
          options_id: userSelectedOpt.options_id,
          option_1: userSelectedOpt.option_1
        } : null,
        correct_option: correctOpt ? {
          options_id: correctOpt.options_id,
          option_1: correctOpt.option_1
        } : null,
        is_correct: isUserCorrect,
        marks_awarded: isUserCorrect ? marks : 0
      });
    }

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    // Clear test data from Redis
    await removeTestFromRedis(testId);

    return res.sendSuccess(
      {
        test_id: testId,
        subject: cachedTest.subject,
        level: cachedTest.level,
        total_questions: originalQuestions.length,
        total_marks: totalMarks,
        score,
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: originalQuestions.length - attemptedCount,
        attempted: attemptedCount,
        percentage: `${percentage}%`,
        results: detailedReview
      },
      "Test submitted and graded successfully"
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailableSubjects,
  generateTest,
  getAllTests,
  getTestById,
  deleteTest,
  submitTest
};
