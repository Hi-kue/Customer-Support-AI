import OpenAi, { OpenAI } from "openai";

/** @type {OpenAI} */
const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TODO: Implement the Initial Response for the AI
/** @type {string} */
const initialPrompt = ``;

/**
 * Function to get the AI's response for user input.
 *
 * @export getAIResponse
 * @param {*} model - The model to use for generating the response.
 * @param {*} prompt - The user's prompt for generating the response.
 * @param {*} role - The role of the AI in the response.
 * @param {*} maxTokens - The maximum number of tokens to generate in the response.
 */
export async function getAIResponse(model, prompt, role, maxTokens) {
    const response = await openAI.completions.create({
        model: model,
        prompt: prompt,
        max_tokens: maxTokens,
    });
}
