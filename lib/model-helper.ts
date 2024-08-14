export function getSelectedModel(): string {
    if (typeof window !== "undefined") {
        return localStorage.getItem("selected_model") || "OpenAI GPT-3";
    } else {
        return "OpenAI GPT-3";
    }
}