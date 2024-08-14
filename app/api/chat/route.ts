import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import getAIResponse from "@/lib/model/ai.config";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// IMPORTANT!: Set the Runtime To Edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { model, prompt, maxTokens } = await req.json();
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            stream: true,
        });

        let data: any = "";
        for await (const chunk of response) {
            data += chunk.choices[0]?.delta?.content || "";
        }

        return new Response(JSON.stringify({ data }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}