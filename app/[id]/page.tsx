"use client";

import { ChatLayout } from "@/app/components/chat/chat-layout";
import React, { useEffect, useState } from "react";
import { Message, useChat } from "ai/react";
import { toast } from "sonner";

export default function Page({ params }: { params: { id: string } }) {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        stop,
        setMessages,
        setInput,
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
    const [chatId, setChatId] = React.useState<string | null>(null);
    const env = process.env.NODE_ENV;
    const [loadingSubmit, setLoadingSubmit] = React.useState(false);

    React.useEffect(() => {
        if (params.id) {
            const item = localStorage.getItem(`chat-${params.id}`);

            if (item) {
                setMessages(JSON.parse(item));
            }
        }
    }, [setMessages]);

    const addMessage = (Message: any) => {
        console.log("Message: ", Message);
        messages.push(Message);
        window.dispatchEvent(new Event("storage"));
        setMessages([...messages]);
    }

    const handleSubmitProduction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.trim() === "") {
            return;
        }

        addMessage({ role: "user", content: input, id: chatId });
        setInput("");
        setLoadingSubmit(true);

        // TODO: Complete the Implementation
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            // TODO: Complete the Implementation
        } catch(error) {
            setLoadingSubmit(false);
            toast.error("An error occurred. Please try again.");
        }
    };

    React.useEffect(() => {
        if (!isLoading && !error && messages.length > 0) {
            localStorage.setItem(`chat-${params.id}`, JSON.stringify(messages));
            window.dispatchEvent(new Event("storage"));
        }
    }, [messages, chatId, isLoading, error]);

    return (
        <main className="flex h-[calc(100dvh)] flex-col items-center">
            <ChatLayout
                chatId={params.id}
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
        </main>
    );
}
