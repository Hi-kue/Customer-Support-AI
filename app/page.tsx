"use client";
//testing
import { ChatLayout } from "@/app/components/chat/chat-layout";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogContent,
} from "@/app/components/ui/dialog";
import UsernameForm from "@/app/components/username-form";
import { Message, useChat } from "ai/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

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
		onError: (error: Error) => {
			setLoadingSubmit(false);
			toast.error("An error occurred. Please try again.");
		},
	});
	const env = process.env.NODE_ENV;
	const [chat, setChat] = useState("");
	const [open, setOpen] = React.useState(false);
	const [chatId, setChatId] = React.useState<string>("");
	const [loadingSubmit, setLoadingSubmit] = React.useState(false);

	React.useEffect(() => {
		if (!isLoading && !error && chatId && messages.length > 0) {
			if(typeof window !== "undefined") {
				localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
			}

			window.dispatchEvent(new Event("storage"));
		}
	}, [messages, chatId, isLoading, error]);

	const addMessage = (Message: any) => {
		console.log("addMessage:", Message);
		messages.push(Message);
		window.dispatchEvent(new Event("storage"));
		setMessages([...messages]);
	};

	const handleSubmitOpenAI = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		addMessage({ role: "user", content: input, id: chatId });
		setInput("");

		try {
			const response = await axios.post("/api/openai", {
				messages: messages.map((m) => ({
					role: m.role,
					content: m.content,
				})),
			});

			const responseMessage = response.data.choices[0].message.content;
			setMessages([
				...messages,
				{ role: "assistant", content: responseMessage, id: chatId },
			]);
			setLoadingSubmit(false);
		} catch (error) {
			toast.error("An error occurred. Please try again.");
			setLoadingSubmit(false);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoadingSubmit(true);

		if (messages.length === 0) {
			// Note: Generates a Random UUID for ChatId
			console.log("Generating a ChatId.");
			const id = uuidv4();
			setChatId(id);
		}
		setMessages([...messages]);

		handleSubmitOpenAI(e);
	};

	return (
	
		
		<main className="flex h-[calc(100dvh)] flex-col items-center ">
			<Dialog open={open} onOpenChange={setOpen}>
				<ChatLayout
					chatId={chatId}
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
						<DialogTitle>Welcome to Customer Support AI!</DialogTitle>
						<DialogDescription>
							Enter your name to get started; This is just to personalize your
							experience.
						</DialogDescription>
						<UsernameForm setOpen={setOpen} />
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
}
