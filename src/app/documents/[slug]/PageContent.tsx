"use client";

import { useEffect, useState, useCallback } from "react";
import { NavBar } from "./NavBar";

interface DocumentData {
  file_url?: string;
}

export default function PageContent({ params }: { params: { slug: string } }) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async (docId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/documentUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: docId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the case where data is an array
      const documentData: DocumentData = Array.isArray(data) ? data[0] : data;

      if (!documentData || !documentData.file_url) {
        throw new Error("No file URL received");
      }

      setUrl(documentData.file_url);
    } catch (error) {
      console.error("Error fetching document:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocument(params.slug);
  }, [params.slug, fetchDocument]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => fetchDocument(params.slug)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No document URL available. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <iframe
        src={`${url}#toolbar=0`}
        className="w-full h-svh"
        title="Document Viewer"
      />
    </div>
  );
}
