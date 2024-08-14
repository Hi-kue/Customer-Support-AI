"use client";

import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please select a model to pull",
  }),
});

export default function PullModelForm() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [name, setName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsDownloading(true);
    console.log(data);
    // NOTE: Send the Model Name to the Server
    fetch("/api/model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error("Network Response was Not OK.");
        }

        if (!response.body) {
          throw new Error("Something Went Wrong. Please Try Again.");
        }

        const reader = response.body.getReader();

        reader.read().then(function processText({ done, value }) {
          if (done) {
            console.log("Streaming Completed");
            setIsDownloading(false);
            return;
          }

          const text = new TextDecoder().decode(value);
          console.log(text);

          const jsonObjects = text.trim().split("\n");

          jsonObjects.forEach((jsonObject) => {
            try {
              const responseJson = JSON.parse(jsonObject);
              if (responseJson.error) {
                toast.error("Error: " + responseJson.error);
                setIsDownloading(false);
                return;
              } else if (responseJson.status === "success") {
                toast.success("Model Pulled Successfully");
                setIsDownloading(false);
                return;
              }
            } catch (error) {
              toast.error("Error parsing JSON.");
              setIsDownloading(false);
              return;
            }
          });

          // NOTE: Continue Reading the Chunk
          reader.read().then(processText);
        });
      })
      .catch((error) => {
        setIsDownloading(false);
        console.error("Error Pulling Model:", error);
        toast.error("Error Pulling Model. Please Try Again.");
      });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    form.setValue("name", e.currentTarget.value);
    setName(e.currentTarget.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <Input
                {...field}
                type="text"
                placeholder="Enter a Model Name..."
                value={name}
                onChange={(e) => handleChange(e)}
              />
              <p className="text-xs pt-1">
                Check the{" "}
                <a
                  href="https://ollama.com/library"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  library
                </a>{" "}
                for a list of available models.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 w-full">
          <Button type="submit" className="w-full " disabled={isDownloading}>
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin w-4 h-4" />
                <span>Pulling Model...</span>
              </div>
            ) : (
              "Pull model"
            )}
          </Button>
          <p className="text-xs text-center">
            {isDownloading
              ? "This may take a while. You can close this dialog and continue using the app."
              : "Pressing the button will download the specified model to your device."}
          </p>
        </div>
      </form>
    </Form>
  );
}
