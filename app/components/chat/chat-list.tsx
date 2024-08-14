import { Message, useChat } from "ai/react";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatProps } from "./chat";
import Image from "next/image";
import CodeDisplayBlock from "../code-display-block";
import { marked } from "marked";
import { useTheme } from "next-themes";

export default function ChatList({
	messages,
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	error,
	stop,
	loadingSubmit,
}: ChatProps) {
	const { theme } = useTheme();
	const bottomRef = useRef<HTMLDivElement>(null);
	const [name, setName] = React.useState<string>("");
	const [localStorageIsLoading, setLocalStorageIsLoading] = React.useState(true);

	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const username = localStorage.getItem("ai_user");
		if (username) {
			setName(username);
			setLocalStorageIsLoading(false);
		}
	}, []);

	if (messages.length === 0) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<div className="flex flex-col gap-4 items-center">
					<Image
						src={
							theme === "dark"
								?  "/imgs/nautilus-cs-ai-logo-white.png"
								: "/imgs/nautilus-cs-ai-logo-black.png"
						}
						alt="Customer Service AI Logo"
						width={60}
						height={60}
						className= "h-20 w-14 object-contain dark:invert"
					/>
					<p className="text-center text-lg text-muted-foreground">
						Hi I'm Nautilus CSAI, How Can I Assist You Today?
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			id="scroller"
			className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
		>
			<div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
				{messages.map((message, index) => (
					<motion.div
						key={index}
						layout
						initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
						animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
						transition={{
							opacity: { duration: 0.1 },
							layout: {
								type: "spring",
								bounce: 0.3,
								duration: messages.indexOf(message) * 0.05 + 0.2,
							},
						}}
						className={cn(
							"flex flex-col gap-2 p-4 whitespace-pre-wrap",
							message.role === "user" ? "items-end" : "items-start"
						)}
					>
						<div className="flex gap-3 items-center">
							{message.role === "user" && (
								<div className="flex items-end gap-3">
									<span
										className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto"
										dangerouslySetInnerHTML={{
											__html: marked.parse(message.content),
										}}
									/>

									<Avatar className="flex justify-start items-center overflow-hidden">
										<AvatarImage
											src="/imgs/pfp-jack.png"
											alt="User"
											width={6}
											height={6}
											className="object-contain"
										/>
										<AvatarFallback>
											{name && name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
							)}
							{message.role === "assistant" && (
								<div className="flex items-end gap-2">
									<Avatar className="flex justify-start items-center">
										<AvatarImage
											src={
												theme === "dark" 
												? "/imgs/nautilus-cs-ai-logo-white.png"
												: "/imgs/nautilus-cs-ai-logo-black.png"
											}
											alt="Nautilus CSAI"
											width={6}
											height={6}
											className="object-contain"
										/>
									</Avatar>
									<span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
										{/* NOTE: Check if Message Content Contains a Code Block */}
										{message.content.split("```").map((part, index) => {
											if (index % 2 === 0) {
												return (
													<span
														key={index}
														dangerouslySetInnerHTML={{
															__html: marked.parse(part),
														}}
													/>
												);
											} else {
												return (
													<pre className="whitespace-pre-wrap" key={index}>
														<CodeDisplayBlock code={part} lang="" />
													</pre>
												);
											}
										})}
										{isLoading &&
											messages.indexOf(message) === messages.length - 1 && (
												<span className="animate-pulse" aria-label="Typing">
													...
												</span>
											)}
									</span>
								</div>
							)}
						</div>
					</motion.div>
				))}
				{loadingSubmit && (
					<div className="flex pl-4 pb-4 gap-2 items-center">
						<Avatar className="flex justify-start items-center">
							<AvatarImage
								src={
									theme === "dark" 
									? "/imgs/nautilus-cs-ai-logo-white.png"
									: "/imgs/nautilus-cs-ai-logo-black.png"
								}
								alt="Nautilus CSAI"
								width={6}
								height={6}
								className="object-contain"
							/>
						</Avatar>
						<div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
							<div className="flex gap-1">
								<span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
								<span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
								<span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
							</div>
						</div>
					</div>
				)}
			</div>
			<div id="anchor" ref={bottomRef}></div>
		</div>
	);
}
