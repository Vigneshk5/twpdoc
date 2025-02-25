import { BotMessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-4">
      <BotMessageSquare className="w-16 h-16 text-blue-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        <span className="bg-gradient-to-r from-[#0070FF] via-[#0048bb] to-[#002c72] inline-block text-transparent bg-clip-text">
          Welcome to TwpBot
        </span>
      </h2>
      <p className="text-gray-600 max-w-md">
        I'm here to help you with your questions. Feel free to ask me anything about the
        documents!
      </p>
    </div>
  );
}
