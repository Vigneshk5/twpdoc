"use client";

import { Send, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { EmptyState } from "./empty-state";
import { Header } from "./header";
import { ChatMessage } from "./chat-message";
import Cookies from "js-cookie";

interface Document {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

interface Query {
  document_id: string;
  _id: string;
  query: string;
  answer: string;
  created_at: string;
}

export default function Conversation(props) {
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [displayQ, setDisplayQ] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  let newLastDate = "";
  // const token = Cookies.get("authToken");
  const token = Cookies.get("authToken") || props.token;
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    const response = await fetch("/api/fetchQueries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: token,
        date: newLastDate,
      }),
    });
    let data = await response.json();

    if (data) {
      setQueries(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;
    setIsLoading(true);
    setDisplayQ(query);
    setQuery("");
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          user_id: token,
        }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      await fetchQueries();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editQ = async (q: string, qId: string) => {
    if (!q.trim()) return;
    setQuery(q);
    if (queries.length >= 1) {
      setQueries(queries.filter((q) => q._id !== qId));
    }
  };
  const refreshQ = async (q: string, qId: string) => {
    setIsLoading(true);
    setDisplayQ(q);
    if (!q.trim()) return;

    setQuery("");
    try {
      if (queries.length > 1) {
        setQueries(queries.filter((q) => q._id !== qId));
      }
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: q.trim(),
          user_id: token,
        }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      await fetchQueries();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [queries, isLoading]);

  const fetchQ = async () => {
    fetchQueries();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      <Header
        fetchQ={fetchQ}
        isLoading={isLoading}
        id={queries[0]?.document_id ? queries[0].document_id : ""}
        user_id={token}
      />

      <>
        <main className="flex-grow overflow-hidden">
          <div className="h-full flex flex-col">
            <div
              className="flex-grow overflow-y-auto scrollbar-hide scroll-smooth"
              ref={chatContainerRef}
            >
              {queries.length === 0 ? (
                isLoading ? (
                  <div className="space-y-6 p-4 md:p-6 scrollbar-hide scroll-smooth">
                    <ChatMessage
                      message={{
                        _id: "loading",
                        query: displayQ,
                        answer: "",
                        created_at: "",
                      }}
                      isLoading={true}
                      _id={""}
                      onRefresh={() => {}}
                      onEdit={() => {}}
                    />
                  </div>
                ) : (
                  <EmptyState />
                )
              ) : (
                <div className="space-y-6 p-4 md:p-6 scrollbar-hide scroll-smooth">
                  {queries.map((q) => (
                    <ChatMessage
                      key={q._id}
                      message={q}
                      _id={q.document_id}
                      onRefresh={refreshQ}
                      onEdit={editQ}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage
                      message={{
                        _id: "loading",
                        query: displayQ,
                        answer: "",
                        created_at: "",
                      }}
                      isLoading={true}
                      _id={""}
                      onRefresh={() => {}}
                      onEdit={() => {}}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="bg-gray-50 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto ">
            <div className="relative flex items-center">
              <input
                type="text"
                id="query"
                className="w-full p-4 pr-16 text-gray-900 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Message TwpBot..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 inline-flex items-center justify-center w-12 h-12 text-white  rounded-full bg-[#0070FF] hover:bg-[#0060FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="sr-only">Send</span>
              </button>
            </div>
          </form>
        </footer>
      </>
    </div>
  );
}
