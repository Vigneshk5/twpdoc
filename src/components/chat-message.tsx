"use client";

import { useState, useEffect } from "react";
import {
  BotMessageSquare,
  Loader2,
  MoreVertical,
  RefreshCw,
  User,
  MessageSquareWarning,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

interface Query {
  _id: string;
  query: string;
  answer: string;
  created_at: string;
}

interface ChatMessageProps {
  message: Query;
  isLoading?: boolean;
  _id: string;
  onRefresh: (q: string, qId: string) => void;
  onEdit: (q: string, qId: string) => void;
}

export function ChatMessage({
  message,
  isLoading = false,
  _id,
  onRefresh,
  onEdit,
}: ChatMessageProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [sanitizedAnswer, setSanitizedAnswer] = useState("");

  useEffect(() => {
    if (message.answer) {
      const clean = DOMPurify.sanitize(message.answer, {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "p",
          "ul",
          "ol",
          "li",
          "code",
          "pre",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "hr",
          "br",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
        ],
        ALLOWED_ATTR: ["href", "target", "rel"],
      });
      setSanitizedAnswer(clean);
    }
  }, [message.answer]);

  const refresh = async () => {
    onRefresh(message.query, message._id);
    setIsOptionsOpen(false);
  };
  const edit = async () => {
    const response = await fetch("/api/deleteChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: message._id,
      }),
    });
    onEdit(message.query, message._id);
    setIsOptionsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* User Message */}
      <div className="flex justify-end">
        <div
          className={`bg-blue-50 rounded-b-3xl  rounded-tl-3xl p-4 shadow-sm max-w-[80%] md:max-w-[70%] relative `}
        >
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-2">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900">You</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="hover:bg-blue-100 rounded-full p-1 transition-colors   "
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {isOptionsOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-36 bg-white border rounded- shadow-lg">
                  <button
                    onClick={edit}
                    className="flex items-center w-full px-4 py-2  hover:bg-gray-50 text-left rounded-t-lg"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={refresh}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50 text-left rounded-b-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-800">{message.query}</p>
        </div>
      </div>

      {/* Bot Message */}
      <div className="flex justify-start">
        <div
          className={`bg-white rounded-b-3xl rounded-tr-3xl p-4 shadow-sm md:max-w-[70%] max-w-[90%] border border-gray-200 ${
            _id === "NO" ? " border border-red-500" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-2">
                <BotMessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900 mr-2">TwpBot</p>
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]" />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <div
                  className={`${
                    _id !== "NO" ? "bg-blue-100" : "bg-red-100"
                  }  rounded-full p-2 mr-2`}
                >
                  {_id !== "NO" ? (
                    <BotMessageSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <MessageSquareWarning className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="font-medium text-gray-900">TwpBot</p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-gray-800 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
              />
              {_id !== "NO" && _id !== "GREETING" && (
                <Link
                  href={`/documents/${_id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block font-medium transition-colors"
                >
                  Read document
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
