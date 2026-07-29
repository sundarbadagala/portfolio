const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");
const { stripHTMLTags } = require('./helpers');
const Content = require("../models/content");

require("dotenv").config();

// Initialize Gemini AI client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Initialize OpenAI client if API key is present
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

const MONTHS_MAP = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
};

const STOP_WORDS = new Set([
    "show", "me", "the", "a", "an", "and", "or", "but", "is", "are", "was", "were",
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could",
    "should", "would", "will", "shall", "may", "might", "must", "blogs", "blog",
    "articles", "article", "posts", "post", "content", "contents", "related", "relate",
    "relating", "about", "topic", "topics", "on", "for", "with", "find", "get",
    "search", "list", "all", "any", "some", "of", "in", "to", "from", "at", "by",
    "this", "that", "these", "those", "my", "your", "his", "her", "its", "their",
    "which", "what", "where", "when", "who", "whom", "whose", "why", "how", "please",
    "give", "display"
]);

/**
 * Extract core topic keywords by removing stop words.
 * Fallback to all non-empty words if all words in query are stop words.
 */
function extractCoreKeywords(queryText) {
    if (!queryText) return [];
    const cleanWords = queryText
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

    const nonStopWords = cleanWords.filter((w) => !STOP_WORDS.has(w));
    return nonStopWords.length > 0 ? nonStopWords : cleanWords;
}

/**
 * Extract date criteria from user search query
 */
function parseDateFromQuery(queryText) {
    if (!queryText) return null;
    const q = queryText.toLowerCase().trim();

    const isoMatch = q.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
    if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const month = parseInt(isoMatch[2], 10) - 1;
        const day = parseInt(isoMatch[3], 10);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return { month, day, year };
        }
    }

    const monthFirstMatch = q.match(/\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\b/);
    if (monthFirstMatch) {
        const month = MONTHS_MAP[monthFirstMatch[1]];
        const day = parseInt(monthFirstMatch[2], 10);
        const year = monthFirstMatch[3] ? parseInt(monthFirstMatch[3], 10) : null;
        if (month !== undefined && day >= 1 && day <= 31) {
            return { month, day, year };
        }
    }

    const dayFirstMatch = q.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)(?:\s*,?\s*(\d{4}))?\b/);
    if (dayFirstMatch) {
        const day = parseInt(dayFirstMatch[1], 10);
        const month = MONTHS_MAP[dayFirstMatch[2]];
        const year = dayFirstMatch[3] ? parseInt(dayFirstMatch[3], 10) : null;
        if (month !== undefined && day >= 1 && day <= 31) {
            return { month, day, year };
        }
    }

    return null;
}

/**
 * Check if a document date matches target date criteria
 */
function matchesDate(docDateVal, target) {
    if (!docDateVal || !target) return false;
    const d = new Date(docDateVal);
    if (isNaN(d.getTime())) return false;

    const utcMatch = (
        d.getUTCMonth() === target.month &&
        d.getUTCDate() === target.day &&
        (target.year === null || d.getUTCFullYear() === target.year)
    );

    const localMatch = (
        d.getMonth() === target.month &&
        d.getDate() === target.day &&
        (target.year === null || d.getFullYear() === target.year)
    );

    return utcMatch || localMatch;
}

/**
 * Format document date for search text and LLM prompt context
 */
function getFormattedDocDate(dateVal) {
    if (!dateVal) return { display: "Unknown", searchable: "" };
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return { display: "Unknown", searchable: "" };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[d.getUTCMonth()];
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const isoDate = d.toISOString().split("T")[0];

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return {
        iso: isoDate,
        display: `${monthName} ${day}, ${year}`,
        displayWithSuffix: `${monthName} ${day}${suffix}, ${year}`,
        searchable: `${monthName} ${day} ${monthName} ${day}${suffix} ${day} ${monthName} ${day}${suffix} ${monthName} ${isoDate} ${year}`
    };
}

/**
 * Extract a relevant content snippet centered around matching search keywords
 */
function getContentSnippet(cleanContent, coreKeywords) {
    if (!cleanContent) return "";
    const lowerContent = cleanContent.toLowerCase();

    for (const kw of coreKeywords) {
        if (!kw || kw.length < 2) continue;
        const idx = lowerContent.indexOf(kw.toLowerCase());
        if (idx !== -1) {
            const start = Math.max(0, idx - 120);
            const end = Math.min(cleanContent.length, idx + 380);
            return (start > 0 ? "..." : "") + cleanContent.slice(start, end) + (end < cleanContent.length ? "..." : "");
        }
    }

    return cleanContent.slice(0, 500) + (cleanContent.length > 500 ? "..." : "");
}

/**
 * Compute cosine similarity between two vector arrays
 */
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate text embedding vector using Gemini or OpenAI fallback
 */
async function getEmbedding(text) {
    if (!text) return null;

    if (ai) {
        try {
            const response = await ai.models.embedContent({
                model: "text-embedding-004",
                contents: text,
            });
            if (response && response.embedding && response.embedding.values) {
                return response.embedding.values;
            }
        } catch (err) {
            console.warn("Gemini embedding error:", err.message);
        }
    }

    if (openai) {
        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
            });
            if (response && response.data && response.data[0] && response.data[0].embedding) {
                return response.data[0].embedding;
            }
        } catch (err) {
            console.warn("OpenAI embedding error:", err.message);
        }
    }

    return null;
}

/**
 * Calculate weighted keyword score for full document content, title, tags, and headlines
 */
function getWeightedKeywordScore(doc, coreKeywords, cleanContent, queryText) {
    const titleLower = (doc.title || "").toLowerCase();
    const headlinesLower = (doc.headlines || "").toLowerCase();
    const tagsLower = Array.isArray(doc.tags)
        ? doc.tags.map((t) => (t.label || t.value || "").toLowerCase()).join(" ")
        : "";
    const groupbyLower = (doc.groupby || "").toLowerCase();
    const contentLower = (cleanContent || "").toLowerCase();
    const queryLower = (queryText || "").toLowerCase().trim();

    let score = 0;
    let matchedKeywordsCount = 0;

    // Full query phrase match bonus
    if (queryLower.length > 2) {
        if (titleLower.includes(queryLower)) score += 10;
        if (headlinesLower.includes(queryLower)) score += 8;
        if (tagsLower.includes(queryLower)) score += 8;
        if (contentLower.includes(queryLower)) score += 6;
    }

    const wordsToTest = coreKeywords.length > 0
        ? coreKeywords
        : queryLower.split(/\s+/).filter(Boolean);

    for (const keyword of wordsToTest) {
        if (!keyword) continue;
        let matched = false;
        const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, "i");

        if (regex.test(titleLower) || titleLower.includes(keyword)) {
            score += 4;
            matched = true;
        }
        if (tagsLower.includes(keyword)) {
            score += 4;
            matched = true;
        }
        if (regex.test(headlinesLower) || headlinesLower.includes(keyword)) {
            score += 3;
            matched = true;
        }
        if (groupbyLower.includes(keyword)) {
            score += 2;
            matched = true;
        }
        if (regex.test(contentLower) || contentLower.includes(keyword)) {
            score += 2;
            matched = true;
        }

        if (matched) {
            matchedKeywordsCount += 1;
        }
    }

    if (matchedKeywordsCount === 0 && score === 0) {
        return 0;
    }

    return score;
}

/**
 * Reusable RAG Search Function
 * Performs date filtering, full-content keyword/vector similarity retrieval + LLM context re-ranking on Content documents.
 * 
 * @param {string} queryText - User search query text
 * @returns {Promise<Array>} - List of matching Content documents from Content model
 */
async function performRAGSearch(queryText) {
    const trimmedQuery = (queryText || "").trim();
    if (!trimmedQuery) {
        return [];
    }

    // Step 1: Retrieval - Fetch all content records from Content model
    const allContents = await Content.find({}).sort({ date: -1 });
    if (!allContents || allContents.length === 0) {
        return [];
    }

    // Step 2: Extract Date Criteria and Core Topic Keywords
    const targetDate = parseDateFromQuery(trimmedQuery);
    const coreKeywords = extractCoreKeywords(trimmedQuery);
    let candidateContents = allContents;

    if (targetDate) {
        candidateContents = allContents.filter((doc) =>
            matchesDate(doc.date || doc.createdAt, targetDate)
        );

        if (candidateContents.length === 0) {
            return [];
        }
    }

    // Prepare full text representation and matching snippets
    const preparedDocs = candidateContents.map((doc) => {
        const tagsText = Array.isArray(doc.tags)
            ? doc.tags.map((t) => t.label || t.value || "").join(" ")
            : "";
        const cleanContent = stripHTMLTags(doc.content || "");
        const docDateInfo = getFormattedDocDate(doc.date || doc.createdAt);
        const fullText = `${doc.title || ""} ${doc.headlines || ""} ${cleanContent} ${tagsText} ${doc.groupby || ""} ${docDateInfo.searchable}`.trim();
        const snippet = getContentSnippet(cleanContent, coreKeywords);
        return { doc, fullText, cleanContent, docDateInfo, snippet };
    });

    // Step 3: Vector Embedding & Weighted Keyword Similarity Matching
    const queryEmbedding = await getEmbedding(trimmedQuery);

    let docScored = [];
    if (queryEmbedding) {
        docScored = await Promise.all(
            preparedDocs.map(async ({ doc, fullText, cleanContent, docDateInfo, snippet }) => {
                const docEmbedding = await getEmbedding(fullText.slice(0, 1500));
                const kwScore = getWeightedKeywordScore(doc, coreKeywords, cleanContent, trimmedQuery);
                const vecSim = docEmbedding ? cosineSimilarity(queryEmbedding, docEmbedding) : 0;

                const similarity = (coreKeywords.length > 0 && kwScore === 0 && vecSim < 0.4)
                    ? 0
                    : (vecSim * 0.4 + kwScore * 0.6);

                return { doc, similarity, fullText, cleanContent, docDateInfo, snippet };
            })
        );
    } else {
        docScored = preparedDocs.map(({ doc, fullText, cleanContent, docDateInfo, snippet }) => {
            const similarity = getWeightedKeywordScore(doc, coreKeywords, cleanContent, trimmedQuery);
            return { doc, similarity, fullText, docDateInfo, snippet };
        });
    }

    // Sort documents by similarity score descending
    docScored.sort((a, b) => b.similarity - a.similarity);

    // Pick top candidate documents for LLM RAG Re-ranking (strictly similarity > 0)
    const topCandidates = docScored.filter((item) => item.similarity > 0).slice(0, 10);

    if (topCandidates.length === 0) {
        return [];
    }

    const candidatePool = topCandidates;

    // Step 4: Augmentation & RAG Re-ranking via LLM
    let finalResults = [];
    let llmEvaluated = false;

    if (ai && candidatePool.length > 0) {
        try {
            const promptContext = candidatePool
                .map(
                    (item, idx) => `
Item Index: ${idx}
ID: ${item.doc.content_id || item.doc._id}
Title: ${item.doc.title}
Headlines: ${item.doc.headlines}
Date: ${item.docDateInfo?.displayWithSuffix || item.doc.date || "Unknown"}
Tags: ${(item.doc.tags || []).map((t) => t.label).join(", ")}
Content Preview/Snippet: ${item.snippet}
---`
                )
                .join("\n");

            const prompt = `You are a Retrieval-Augmented Generation (RAG) search module for a technical blog platform.
User Search Query: "${trimmedQuery}"
Core Topic Keywords: "${coreKeywords.join(", ") || trimmedQuery}"

Candidate Content Items:
${promptContext}

CRITICAL RELEVANCE RULES:
1. Select ONLY the content items that match the user's search query ("${trimmedQuery}") or contain the requested words/topic ("${coreKeywords.join(", ")}").
2. Check the Title, Headlines, Tags, AND Content Preview/Snippet. If the candidate contains or discusses the search words, include it.
3. Exclude any candidate item that is completely unrelated to the query.
4. If only 1 item matches, return a JSON array containing just that index, e.g.: [0].
5. If NO candidate item matches, return [].

Respond ONLY with a valid JSON array of index numbers ordered by relevance.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const responseText = response.text || "";
            const jsonMatch = responseText.match(/\[[\s\S]*?\]/);

            if (jsonMatch) {
                llmEvaluated = true;
                const selectedIndices = JSON.parse(jsonMatch[0]);
                if (Array.isArray(selectedIndices)) {
                    finalResults = selectedIndices
                        .map((idx) => candidatePool[idx])
                        .filter(Boolean)
                        .map((item) => item.doc);
                }
            }
        } catch (llmErr) {
            console.warn("LLM RAG re-ranking failed, falling back to keyword similarity order:", llmErr.message);
        }
    }

    // Fallback ONLY if LLM re-ranking was not executed (e.g. AI unconfigured or API error)
    if (!llmEvaluated) {
        finalResults = candidatePool.filter((item) => item.similarity > 0).map((item) => item.doc);
    }

    return finalResults;
}

module.exports = { performRAGSearch };