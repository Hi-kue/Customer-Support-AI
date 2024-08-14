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
	const [currentModel, setCurrentModel] = React.useState<string>();
	const handleSubmitOpenAI = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!chatId) {
			return;
		}
	};

	const models: string[] = [
		"OpenAI GPT-3",
		"OpenAI GPT-4",
		"Gemini (Coming Soon)",
		"Llama (Coming Soon)",
	]

	const handleModelChange = (model: string) => {
		setCurrentModel(model);

		if (typeof window !== "undefined") {
			localStorage.setItem("ai_model", model);
		}

		setOpen(false);
	}

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
						<span className="truncate">{currentModel || "Select Model"}</span>
						<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[170px] p-1">
					{/*
						TODO: Refactor to Make Buttons Do Something!
					*/}
					{models.map((model) => (
						<Button
							variant="ghost"
							key={model}
							className="w-full"
							onClick={() => handleModelChange(model)}>
							{model}
						</Button>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
}
