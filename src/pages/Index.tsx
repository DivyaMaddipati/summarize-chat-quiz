import { useState } from "react";
import { YouTubeInput } from "@/components/YouTubeInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Summary } from "@/components/Summary";
import { InteractionToggle } from "@/components/InteractionToggle";
import { Chat } from "@/components/Chat";
import { Quiz } from "@/components/Quiz";
import { toast } from "sonner";

// Using environment variable or fallback for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Index() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interactionMode, setInteractionMode] = useState<"chat" | "quiz">("chat");
  const [questions, setQuestions] = useState([]);

  const handleUrlSubmit = async (url: string, videoLanguage: string) => {
    setIsLoading(true);
    setSummary(""); // Clear previous summary
    setQuestions([]); // Clear previous questions

    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, language: videoLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get video summary");
      }

      const data = await response.json();
      setSummary(data.summary);

      // Only fetch quiz questions if summary was successful
      if (data.summary) {
        try {
          const quizResponse = await fetch(`${API_BASE_URL}/quiz`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ summary: data.summary }),
          });

          if (quizResponse.ok) {
            const quizData = await quizResponse.json();
            setQuestions(quizData.questions);
          } else {
            console.error("Failed to fetch quiz questions");
          }
        } catch (quizError) {
          console.error("Quiz generation error:", quizError);
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get video summary");
      console.error("Summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!summary) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: summary, target_language: language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to translate summary");
      }

      const data = await response.json();
      setSummary(data.translated_text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to translate summary");
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message, summary }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get response";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FFDEE9] via-[#B5FFFC] via-[#9AE1F2] to-[#FFFFFF]">
      <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] bg-gradient-to-r from-[#FFDEE9] via-[#FF92C2] to-[#B5FFFC] rounded-full blur-3xl opacity-70 animate-floating" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-gradient-to-r from-[#9AE1F2] via-[#B5FFFC] to-[#FFFFFF] rounded-full blur-3xl opacity-70 animate-floating delay-1000" />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[500px] h-[500px] bg-gradient-to-r from-[#FFFFFF] via-[#FFDEE9] to-[#B5FFFC] rounded-full blur-4xl opacity-50 animate-pulse" />

      <div className="relative">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-fade-in">
              YouTube Video Summarizer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-200">
              Enter a YouTube video URL to get an AI-powered summary, chat about the content, or test your knowledge with a quiz.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 animate-fade-in delay-300">
            <YouTubeInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
            {summary && (
              <LanguageSelector
                onLanguageChange={handleLanguageChange}
                disabled={isLoading}
              />
            )}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <Summary summary={summary} isLoading={isLoading} />
            </div>

            {summary && (
              <>
                <div className="flex justify-center animate-fade-in">
                  <InteractionToggle
                    mode={interactionMode}
                    onModeChange={setInteractionMode}
                  />
                </div>

                <div className="w-full transform transition-all duration-500 hover:scale-[1.01]">
                  {interactionMode === "chat" ? (
                    <Chat onSendMessage={handleChatMessage} />
                  ) : (
                    <Quiz questions={questions} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}