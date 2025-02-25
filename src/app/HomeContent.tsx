"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BotMessageSquare, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Conversation from "@/components/Conversation";

export default function HomeContent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>(Cookies.get("authToken") || "");

  useEffect(() => {
    const savedState = localStorage.getItem("chatIsOpen");
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  const handleToggle = (newState: boolean) => {
    setIsOpen(newState);
    localStorage.setItem("chatIsOpen", JSON.stringify(newState));
  };

  return (
    <Suspense fallback={<div></div>}>
      <TokenHandler setToken={setToken} />
      <main>
        <AnimatePresence>
          {isOpen && (
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleToggle(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <button
                  onClick={() => handleToggle(false)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <Conversation token={token} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle(true)}
              className="fixed bottom-6 right-6 bg-[#0073ff] hover:bg-[#0082FF] text-white p-4 rounded-full shadow-lg transition-colors duration-200"
              aria-label="Open chat"
            >
              <BotMessageSquare className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </Suspense>
  );
}

function TokenHandler({ setToken }: { setToken: (token: string) => void }) {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  useEffect(() => {
    if (tokenFromUrl) {
      Cookies.set("authToken", tokenFromUrl, {
        expires: 7,
        sameSite: "None",
        // secure: false,
      });

      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl, setToken]);

  return null;
}
