"use client";

import { BotMessageSquare, Sparkles, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  fetchQ: () => void;
  isLoading: boolean;
  id: string;
  user_id: string;
}

export function Header({ fetchQ, isLoading, id, user_id }: HeaderProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchDocument(id);
    } else {
      setTitle("");
      setText([]);
    }
  }, [id]);

  const fetchDocument = async (docId: string) => {
    try {
      const response = await fetch("/api/documentName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: docId,
        }),
      });
      const data = await response.json();
      if (data[0]?.name) {
        let a = data[0].name.split(".");
        let str: string = a.shift();
        setTitle(str);
        setText(`Conversation about ${str}`.split(" "));
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const clearChat = async () => {
    try {
      await fetch("/api/clearChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
        }),
      });
      fetchQ();
      setTitle("");
      setText([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <header className="bg-gray-50 border-gray-200 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-1 lg:py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center ">
            <BotMessageSquare className="w-8 h-8 text-[#0070FF] hover:text-[#0060FF] mr-3" />
            <span className="bg-gradient-to-r from-[#0070FF] via-[#0048bb] to-[#002c72] inline-block text-transparent bg-clip-text">
              HR ChatBot
            </span>
          </h1>
          {title && (
            <Link href={`/documents/${id}`}>
              <motion.div
                className="px-4 py-1 hidden rounded-full bg-blue-50 border border-blue-200 sm:flex items-center space-x-2 hover:bg-blue-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <div className="text-sm text-[#0070FF] font-medium">
                  {text.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: i / 10 }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </Link>
          )}
          <div className="flex space-x-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={clearChat}
              className="p-2 mx-4 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
              title="Clear chat"
            >
              <SquarePen className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
