"use client";
import { Upload, File, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import pdfToText from "react-pdftotext";
import Cookies from "js-cookie";

interface Document {
  _id: string;
  id: string;
  name: string;
  content: string;
  created_at: string;
}

interface Query {
  id: string;
  query: string;
  answer: string;
  created_at: string;
}

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = Cookies.get("authToken") || "no token";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const response = await fetch("/api/documentNames", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      console.log(data);
      setDocuments(data);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      let content;

      await pdfToText(file)
        .then((text) => {
          content = text;
        })
        .catch((error) => console.error("Failed to extract text from pdf", error));

      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("content", content);
      formData.append("file", file);
      formData.append("user_id", token);

      await fetch("/api/documentUpload", {
        method: "POST",
        body: formData,
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent document selection when clicking delete
    setDocumentToDelete(docId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    setIsDeletingDocument(true);

    try {
      const response = await fetch("/api/deleteDocument", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: documentToDelete,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Update documents list
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete));
      if (selectedDoc?.id === documentToDelete) {
        setSelectedDoc(null);
      }
      fetchDocuments();
    } catch (err) {
      setError("Failed to delete document");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeletingDocument(false);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 ">Document Manager</h1>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Upload section remains the same */}
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  ) : (
                    <Upload className="w-10 h-10 text-blue-500 mb-4" />
                  )}
                  <p className="mb-2 text-lg font-medium text-gray-700">
                    {isUploading ? "Uploading..." : "Drop your file here"}
                  </p>
                  <p className="text-sm text-gray-500">
                    or <span className="text-blue-500 hover:text-blue-600">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: TXT, MD, JSON, CSV, PDF(max 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              Your Documents
            </h2>

            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No documents uploaded yet
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`group flex items-center p-4 rounded-lg transition-colors duration-200 ${
                      selectedDoc?.id === doc.id ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex-1 flex items-center cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <File
                        className={`w-5 h-5 mr-3 ${
                          selectedDoc?.id === doc.id
                            ? "text-blue-500"
                            : "text-gray-400 group-hover:text-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            selectedDoc?.id === doc._id
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded {formatDate(doc.created_at)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(doc._id, e)}
                      className="p-2 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete document"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500 hover:text-red-500"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this document?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={isDeletingDocument}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center"
                  disabled={isDeletingDocument}
                >
                  {isDeletingDocument ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
