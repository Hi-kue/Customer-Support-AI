import chalk from "chalk";
import axios, { AxiosResponse } from 'axios';

const log = console.log;

export default async function handleRequest(messages: any[]) {
    // TODO: Complete the Implementation
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not found in the .env variables, please add it.");
        log(`${chalk.red("Error:")} OPENAI_API_KEY is not found in the .env variables, please add it.`);
        return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not found in the .env variables, please add it." }), { status: 500 });
    }
}