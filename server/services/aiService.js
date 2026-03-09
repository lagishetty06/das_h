const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Initialize the Google AI Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY not found in .env. Relying on environment injection.");
  // NOTE: In environments like Google Cloud Shell or Canvas, the key might be injected automatically.
  // If running locally without injection, API calls will fail unless you add a key to .env.
}
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY"); // Use dummy key if none provided

// 2. Select the Model
// We use gemini-2.5-flash as it's fast and capable for our needs.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

// 3. Helper Function for Exponential Backoff (Professional Error Handling)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateWithBackoff = async (prompt, generationConfig = {}, safetySettings = [], maxRetries = 5) => {
  let attempt = 0;
  let delay = 1000; // Start with 1 second delay

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(
          prompt,
          generationConfig,
          safetySettings
      );
      const response = result.response;
      const text = response.text();
      return text; // Success! Return the generated text.
    } catch (error) {
      attempt++;
      // Check if it's a rate limit error (often status code 429) or temporary server error (5xx)
      const isRetryable = error.status === 429 || (error.status >= 500 && error.status < 600);

      if (isRetryable && attempt < maxRetries) {
        console.warn(`Gemini API call failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay / 1000}s... Error: ${error.message}`);
        await sleep(delay);
        delay *= 2; // Double the delay for the next retry
      } else {
        console.error(`Gemini API call failed after ${attempt} attempts or with non-retryable error:`, error);
        throw new Error('Failed to generate content from AI service after multiple retries.'); // Give up after max retries or for non-retryable errors
      }
    }
  }
};

// 4. Export the core function to be used by controllers
module.exports = {
  generateText: (prompt) => generateWithBackoff(prompt),
  generateStructuredText: (prompt, responseSchema) => {
    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    };
    return generateWithBackoff(prompt, generationConfig);
  }
};