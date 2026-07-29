"use client";

import { useRef, useState } from "react";
import {
    Upload,
    FileText,
    CheckCircle2,
    Send,
    X,
} from "lucide-react";
import Modal from "@/shared/components/Modal";
import { RAG_PDF_NOTE } from "@/shared/helper/constants";

export default function RagPage() {
    const inputRef = useRef<HTMLInputElement>(null);

    const [uploaded, setUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true)

    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Handle File Upload
    const handleFileUpload = async (selectedFile: File) => {
        setFileName(selectedFile.name);
        setUploadStatus('Uploading and processing...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('http://localhost:8080/api/v1/rag/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setUploaded(true);
                setUploadStatus(`Success! Document processed into ${data.chunks} chunks.`);
            } else {
                alert(`Upload failed: ${data.error}`);
                setFileName("");
                setUploaded(false);
                setUploadStatus("");
            }
        } catch (error) {
            alert('Failed to connect to the server.');
            setFileName("");
            setUploaded(false);
            setUploadStatus("");
        }
    };

    // 2. Handle Ask Question
    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        const currentQuestion = question;
        const newHistory = [...chatHistory, { role: 'user', text: currentQuestion }];
        setChatHistory(newHistory);
        setQuestion('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/v1/rag/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuestion }),
            });
            const data = await res.json();

            if (res.ok) {
                setChatHistory([...newHistory, { role: 'ai', text: data.answer }]);
            } else {
                setChatHistory([...newHistory, { role: 'ai', text: `Error: ${data.error}` }]);
            }
        } catch (error) {
            setChatHistory([...newHistory, { role: 'ai', text: 'Error connecting to server.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Clear Chat and Trigger New PDF Select
    const handleUploadButtonClick = () => {
        setUploaded(false);
        setFileName("");
        setChatHistory([]);
        setUploadStatus("");
        setTimeout(() => {
            inputRef.current?.click();
        }, 100);
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{RAG_PDF_NOTE.header}</span>
                </div>
            }>
                <p>
                    {RAG_PDF_NOTE.note}
                </p>
                <ul className="list-disc list-outside mt-2 text-sm" >
                    {RAG_PDF_NOTE.note_points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </Modal>

            <div className="mx-auto flex min-h-[calc(100vh-100px)] max-w-5xl flex-col px-6 py-10">

                {!uploaded ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="w-full max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center transition hover:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-blue-400"
                        >
                            <Upload className="mx-auto mb-5 h-14 w-14 text-blue-500" />

                            <h2 className="text-2xl font-semibold">
                                Upload your PDF
                            </h2>

                            <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
                                Drag & Drop your PDF here or click to browse
                            </p>

                            <button className="mt-8 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
                                Upload PDF
                            </button>

                            <p className="mt-5 text-xs text-gray-400">
                                PDF only • Max 20MB
                            </p>

                            <input
                                ref={inputRef}
                                hidden
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col justify-end">

                        <div className="mb-6 flex items-center justify-between rounded-xl border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">

                            <div className="flex items-center gap-3">

                                <CheckCircle2 className="h-6 w-6 text-green-600" />

                                <div>
                                    <p className="font-medium text-green-800 dark:text-green-300">
                                        PDF Uploaded Successfully
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                                        <FileText className="h-4 w-4" />
                                        {fileName}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setUploaded(false);
                                    setFileName("");
                                    setChatHistory([]);
                                }}
                                className="rounded-lg p-2 hover:bg-green-100 dark:hover:bg-neutral-800 text-green-700 dark:text-green-400"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Messages History */}
                        <div className="flex-1 overflow-y-auto mb-6 flex flex-col gap-4 p-2 min-h-[250px]">
                            {chatHistory.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center text-gray-400 dark:text-neutral-500 text-sm">
                                    Ask a question to start exploring the document.
                                </div>
                            ) : (
                                chatHistory.map((chat, index) => (
                                    <div
                                        key={index}
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${chat.role === "user"
                                            ? "self-end bg-blue-600 text-white rounded-tr-none"
                                            : "self-start bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200 rounded-tl-none border dark:border-neutral-700"
                                            }`}
                                    >
                                        {chat.text}
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="self-start text-xs text-gray-400 dark:text-neutral-500 animate-pulse">
                                    AI is thinking...
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 flex items-center gap-3">

                            <textarea
                                rows={1}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAskQuestion();
                                    }
                                }}
                                placeholder="Ask anything about your uploaded PDF..."
                                className="flex-1 resize-none border-none bg-transparent outline-none text-gray-800 dark:text-neutral-100 placeholder-gray-400 py-1 text-sm max-h-[80px] h-[36px] overflow-y-auto"
                            />

                            <div className="flex items-center gap-2 shrink-0">

                                <button
                                    onClick={handleUploadButtonClick}
                                    className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800 text-sm"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload PDF
                                </button>

                                <button
                                    onClick={handleAskQuestion}
                                    disabled={isLoading || !question.trim()}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition text-sm"
                                >
                                    <Send className="h-4 w-4" />
                                    Ask
                                </button>
                            </div>

                            <input
                                ref={inputRef}
                                hidden
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );

}