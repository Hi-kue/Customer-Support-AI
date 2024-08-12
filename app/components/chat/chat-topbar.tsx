"use client";

import React, { useEffect, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import axios from "axios";

interface ChatTopBarProps {
	isLoading: boolean;
	chatId?: string;
	messages: Message[];
}

export default function ChatTopBar({
	isLoading,
	chatId,
	messages,
}: ChatTopBarProps) {
	const [open, setOpen] = React.useState(false);

	const handleSubmitOpenAI = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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
		} catch (error) {
			console.error("An error occurred. Please try again.");
		}
	};

	return (
		<div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center ">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						disabled={isLoading}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[170px] justify-between"
					>
						OpenAI Chat
						<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[170px] p-1">
					<Button
						variant="ghost"
						className="w-full"
						onClick={() => setOpen(false)}
					>
						OpenAI Chat
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}
