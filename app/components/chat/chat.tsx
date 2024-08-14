import React, { useState } from "react";
import ChatTopBar from "@/app/components/chat/chat-topbar";
import ChatList from "@/app/components/chat/chat-list";
import ChatBottomBar from "@/app/components/chat/chat-bottombar";
import { Message, useChat } from "ai/react";
import { ChatRequestOptions } from "ai";

export interface ChatProps {
	chatId?: string;
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
	chatId,
	loadingSubmit,
}: ChatProps) {
	const [refresh, setRefresh] = useState(false);
	const { setMessages } = useChat();

	const refreshMessages = () => {
		setRefresh(true);
	};

	if (refresh) {
		setMessages(messages);
		setRefresh(false);
	}

	return (
		<div className="flex flex-col justify-between w-full h-full">
			<ChatTopBar
				isLoading={isLoading}
				chatId={chatId}
				messages={messages}
			/>

			<ChatList
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
