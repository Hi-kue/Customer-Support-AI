import OpenAi, { OpenAI } from "openai";

const openAI: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// TODO: Implement the Initial Response for the AI.
const initialPrompt: string = ``;


export default async function getAIResponse(model, prompt, role, maxTokens) {
    const response: any = await openAI.completions.create({
        model: model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0, // TODO: Define temperature
        top_p: 1, // TODO: Define top_p
        frequency_penalty: 0, // TODO: Define frequency_penalty
    })

    return response.choices[0].message.text;
}
