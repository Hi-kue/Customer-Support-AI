import { ThemeProvider } from "@/app/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export const metadata: Metadata = {
	title: "Customer Service AI / Chatbot",
	description: "Customer Service AI / Chatbot powered by OpenAI",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
      </head>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
	);
}