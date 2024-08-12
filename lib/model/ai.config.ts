import OpenAi, { OpenAI } from "openai";

const openAI: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// TODO: Implement the Initial Response for the AI.
const initialPrompt: string = `
    
`;


export default async function getAIResponse(
    model: string,
    prompt: string,
    role: string,
    maxTokens: number = 150) {
    const response: any = await openAI.completions.create({
        model: model,
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0, // NOTE: Adjust Temperature for Creativity
        top_p: 1, // NOTE: Use Nuclear Sampling
        frequency_penalty: 0, // NOTE: Penalty Range 0 - 1, no Penalty
        presence_penalty: 0, // NOTE: Penalty Range 0 - 1, no Penalty
    })

    return response.choices[0].message.text.trim();
}
