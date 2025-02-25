"use client";
import Link from "next/link";
import { BotMessageSquare, LucideArrowLeft } from "lucide-react";
import Cookies from "js-cookie";

export function NavBar() {
  const token = Cookies.get("authToken");
  return (
    <header className="bg-gray-50  border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center lg:py-4 py-1">
          <Link
            href={`/?token=${token}`}
            className="text-xl font-bold text-gray-900 flex items-center"
          >
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <BotMessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <span className="bg-gradient-to-r from-[#0070FF] via-[#0048bb] to-[#002c72] inline-block text-transparent bg-clip-text">
                TwpBot
              </span>
            </h1>
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="mx-5 inline-flex items-center px-2 py-1 lg:px-3 lg:py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <LucideArrowLeft className="w-4 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
