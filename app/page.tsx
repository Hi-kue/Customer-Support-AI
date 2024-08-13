"use client";
//testing
import { ChatLayout } from "@/app/components/chat/chat-layout";
import { Button } from "@/app/components/ui/button";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogContent,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import UsernameForm from "@/app/components/username-form";
// import Gamma from "@/lib/gamma"; // TODO: Implement this .ts File
// import { getSelectedModel } from "@/lib/model-helper"; // TODO: Implement this .ts File
// import { AIMessage, HumanMessage } from "@langchain/core/messages"; // TODO: Implement this .ts File
// import { BytesOutputParser } from "@langchain/core/output_parsers"; // TODO: Implement this .ts File
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
	const {
		messages,
		input,
		handleInputChange,
		setInput,
		handleSubmit,
		isLoading,
		error,
		stop,
		setMessages,
	} = useChat({
		onResponse: (response) => {
			if (response) {
				setLoadingSubmit(false);
			}
		},
		onError: (error) => {
			setLoadingSubmit(false);
			toast.error("An error occurred. Please try again.");
		},
	});
	const [chatId, setChatId] = React.useState<string>("");
	const [selectedModel, setSelectedModel] = React.useState<string>(
		getSelectedModel()
	);
	const [open, setOpen] = React.useState(false);
	const [gamma, setGamma] = React.useState<Gamma | null>(null);
	const [ollama, setOllama] = useState<ChatOllama>();
	const env = process.env.NODE_ENV;
	const [loadingSubmit, setLoadingSubmit] = React.useState(false);

	React.useEffect(() => {
		if (!isLoading && !error && chatId && messages.length > 0) {
			if (typeof window !== "undefined") {
				// Save messages to local storage
				localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
			}
			// Trigger the storage event to update the sidebar component
			window.dispatchEvent(new Event("storage"));
		}
	}, [messages, chatId, isLoading, error]);

	useEffect(() => {
		if (env === "production") {
			const newOllama = new ChatOllama({
				baseUrl: "http://localhost:11434",
				model: selectedModel,
			});
			setOllama(newOllama);
		}

		console.log("selectedModel:", selectedModel);
		if (!localStorage.getItem("ollama_user")) {
			setOpen(true);
		}
	}, [selectedModel]);

	useEffect(() => {
		if (selectedModel === "Browser Model") {
			console.log("Selected model: Browser");
			const gammaInstance = Gamma.getInstance();
			setGamma(gammaInstance);
		}
	}, [setSelectedModel, selectedModel]);

	const addMessage = (Message: any) => {
		console.log("addMessage:", Message);
		messages.push(Message);
		window.dispatchEvent(new Event("storage"));
		setMessages([...messages]);
	};

	// Function to handle chatting with Ollama in production (client side)
	const handleSubmitProduction = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		addMessage({ role: "user", content: input, id: chatId });
		setInput("");

		if (ollama) {
			try {
				const parser = new BytesOutputParser();

				console.log(messages);
				const stream = await ollama
					.pipe(parser)
					.stream(
						(messages as Message[]).map((m) =>
							m.role == "user"
								? new HumanMessage(m.content)
								: new AIMessage(m.content)
						)
					);

				const decoder = new TextDecoder();

				let responseMessage = "";
				for await (const chunk of stream) {
					const decodedChunk = decoder.decode(chunk);
					responseMessage += decodedChunk;
				}
				setMessages([
					...messages,
					{ role: "assistant", content: responseMessage, id: chatId },
				]);
				setLoadingSubmit(false);
			} catch (error) {
				toast.error("An error occurred. Please try again.");
				setLoadingSubmit(false);
			}
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoadingSubmit(true);

		if (messages.length === 0) {
			// Generate a random id for the chat
			console.log("Generating chat id");
			const id = uuidv4();
			setChatId(id);
		}

		if (selectedModel === "Browser Model") {
			try {
				// Add the user message to the chat
				addMessage({ role: "user", content: input, id: chatId });
				setInput("");

				if (gamma === null) {
					const gammaInstance = Gamma.getInstance();
					setGamma(gammaInstance);
				}

				// Generate a response
				const responseGenerator = gamma
					? await gamma.summarize(input)
					: (async function* () {})();
				console.log("Response from Browser Model:", responseGenerator);

				let responseMessage = "";
				// Display response chunks as they arrive and append them to the message
				for await (const chunk of responseGenerator) {
					responseMessage += chunk;

					window.dispatchEvent(new Event("storage"));
					setMessages([
						...messages,
						{ role: "assistant", content: responseMessage, id: chatId },
					]);
					setLoadingSubmit(false);
				}
			} catch (error) {
				console.error("Error processing message with Browser Model:", error);
			}
		} else {
			setMessages([...messages]);

			// Prepare the options object with additional body data, to pass the model.
			const requestOptions: ChatRequestOptions = {
				options: {
					body: {
						selectedModel: selectedModel,
					},
				},
			};

			if (env === "production" && selectedModel !== "REST API") {
				handleSubmitProduction(e);
			} else {
				// use the /api/chat route
				// Call the handleSubmit function with the options
				handleSubmit(e, requestOptions);
			}
		}
	};
//this is a component for ai
	const [aiMessages, setAiMessages] = useState([{
		role: 'assistant', 
		content: "Hi!, I'm Headstarter support assistant. How can I help you today?"
	},
	])
	const [userMessage, setUserMessage] = useState('')

	const sendMessage = async () => {
		setUserMessage('')
		setAiMessages((messages) => [
			...messages,
			{role:'user', content: userMessage},
			{role: 'assistant', content:''}
		])

		const response = fetch('/api/chat', {
			method: 'POST',
			headers:{
				'Content-Type': 'application'
			},
			body: JSON.stringify([...messages, {role: 'user', content: userMessage}]),
		}).then(async(res)=> {
			const reader = res.body.getReader()
			const decoder = new TextDecoder()

			let result =""
			return reader.read().then(function processText({done,value}){
				if(done){
					return result
				}
				const text = decoder.decode(value || new Uint8Array(), {stream: true})
				setMessages((aIMessages)=> {
					let lastMessage = aIMessages[aIMessages.length -1]
						let otherMessages = messages.slice(0, aIMessages.length - 1) 
						return [
							...otherMessages,
							{...lastMessage, content: lastMessage.content + text},
						]
				})
				return reader.read().then(processText)
			})
	‹	})
	}
	//
	return (
		<Box>
				<Box>
					<Box>
						{aiMessages.map((message, index)=>(
							<Box key={index} justifyContent ={ message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
								<Box>{message.content}</Box>
							</Box>
						))}
					</Box>
					<Box>
						<Textarea label="Message" value={userMessage} onChange={(e)=> setUserMessage(e.target.value)}/>
						<Button onClick={sendMessage}>Send</Button>
					</Box>
				</Box>
			</Box>

		
		<main className="flex h-[calc(100dvh)] flex-col items-center ">
			<Dialog open={open} onOpenChange={setOpen}>
				<ChatLayout
					chatId={chatId}
					setSelectedModel={setSelectedModel}
					messages={messages}
					input={input}
					handleInputChange={handleInputChange}
					handleSubmit={onSubmit}
					isLoading={isLoading}
					loadingSubmit={loadingSubmit}
					error={error}
					stop={stop}
					navCollapsedSize={10}
					defaultLayout={[30, 160]}
				/>
				<DialogContent className="flex flex-col space-y-4">
					<DialogHeader className="space-y-2">
						<DialogTitle>Welcome to Ollama!</DialogTitle>
						<DialogDescription>
							Enter your name to get started. This is just to personalize your
							experience.
						</DialogDescription>
						<UsernameForm setOpen={setOpen} />
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
}
