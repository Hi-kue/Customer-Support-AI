import React, { useState } from "react";
import ChatTopBar from "@/app/components/chat/chat-topbar";
import ChatList from "@/app/components/chat/chat-list";
import ChatBottomBar from "@/app/components/chat/chat-bottombar";
import { Message, useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";
import { ChatRequestOptions } from "ai";

export interface ChatProps {
	chatId?: string;
	setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
	messages: Message[];
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmit: (
		e: React.FormEvent<HTMLFormElement>,
		chatRequestOptions?: ChatRequestOptions
	) => void;
	isLoading: boolean;
	loadingSubmit?: boolean;
	error: undefined | Error;
	stop: () => void;
}

export default function Chat({
	messages,
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	error,
	stop,
	setSelectedModel,
	chatId,
	loadingSubmit,
}: ChatProps) {
	const [refresh, setRefresh] = useState(false);
	const { setMessages } = useChat();

	return (
		<div className="flex flex-col justify-between w-full h-full  ">
			<ChatTopBar
				setSelectedModel={setSelectedModel}
				isLoading={isLoading}
				chatId={chatId}
				messages={messages}
			/>

			<ChatList
				setSelectedModel={setSelectedModel}
				messages={messages}
				input={input}
				handleInputChange={handleInputChange}
				handleSubmit={handleSubmit}
				isLoading={isLoading}
				loadingSubmit={loadingSubmit}
				error={error}
				stop={stop}
			/>

			<ChatBottomBar
				setSelectedModel={setSelectedModel}
				messages={messages}
				input={input}
				handleInputChange={handleInputChange}
				handleSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
				stop={stop}
			/>
		</div>
	);
}
