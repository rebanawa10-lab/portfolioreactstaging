


// file: src/ai/AIAgent.tsx
//       AI Agent ENTRY

import React, {
    useEffect,
    useRef,
    useState
} from "react";

// import { askAI } from "./aiServiceDUMMY";                            // VER1
// import { askLangChain } from "../ailangchain/langchainApi";          // 2202610 23
// import { askMultiAgent } from "../aimultiagent/multiAgentApi";       // 2202610 28

import { askMultiAgent, getDocumentPreviewUrl } from "../aimultiagent/multiAgentApi";   // 2202611 06, VER2 Supervisor-based Multi-Agent System

// Fix the Markdown formatting // 2202610 23
import remarkGfm from "remark-gfm";

import "./ai.css";

import ReactMarkdown from "react-markdown";

import type { RelatedDocument,
    RelatedKnowledgeSource
 } from "../aimultiagent/multiAgentApi";

interface ChatMessage {
    question: string;
    answer: string;
    relatedDocuments?: RelatedDocument[];
    relatedKnowledgeSources?: RelatedKnowledgeSource[];
}

const AIAgent: React.FC = () => {

    const [open, setOpen] = useState(false);

    const lastChatRef =
        useRef<HTMLDivElement>(null);

    const [question, setQuestion] =
        useState("");
  
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
        const savedHistory = localStorage.getItem("aiChatHistory");

        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    const [status, setStatus] =
        useState("AI is ready");

    const [loading, setLoading] =
        useState(false);

    // ==========================================
    // DOCUMENT PDF PREVIEW
    // ==========================================

    const [documentPreview, setDocumentPreview] = useState<{
        documentId: string;
        filename: string;
        url: string;
    } | null>(null);

    const [previewLoadingId, setPreviewLoadingId] =
        useState<string | null>(null);

    const [downloadLoadingId, setDownloadLoadingId] =
        useState<string | null>(null);

    const [previewError, setPreviewError] = useState<{
        documentId: string;
        message: string;
    } | null>(null);


    // ==========================================
    // OPEN DOCUMENT PDF PREVIEW
    // ==========================================

    const handlePreviewDocument = async (
        doc: RelatedDocument
    ) => {

        try {

            setPreviewLoadingId(doc.documentId);

            setDocumentPreview(null);
            setPreviewError(null);

            const result = await getDocumentPreviewUrl(
                doc.documentId
            );

            setDocumentPreview({
                documentId: result.documentId,
                filename: result.filename,
                url: result.url
            });

        } catch (error) {

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);

            console.error(
                "Document preview error:",
                error
            );

            setPreviewError({
                documentId: doc.documentId,
                message: errorMessage
            });

        } finally {
            setPreviewLoadingId(null);
        }
    };
            

    // ==========================================
    // DOWNLOAD DOCUMENT FILE
    // ==========================================

    const handleDownloadDocument = async (
        doc: RelatedDocument
    ) => {

        try {

            setDownloadLoadingId(doc.documentId);
            setPreviewError(null);

            const result = await getDocumentPreviewUrl(
                doc.documentId,
                true
            );

            // Trigger browser download
            const link = document.createElement("a");

            link.href = result.url;
            link.download = result.filename;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        } catch (error) {

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);

            console.error(
                "Document download error:",
                error
            );

            setPreviewError({
                documentId: doc.documentId,
                message: errorMessage
            });

        } finally {

            setDownloadLoadingId(null);

        }
    };



    // ==========================================
    // SAVE AI CHAT HISTORY
    // ==========================================

    useEffect(() => {

        localStorage.setItem(
            "aiChatHistory",
            JSON.stringify(chatHistory)
        );

    }, [chatHistory]);


    useEffect(() => {

        if (!open) {
            return;
        }

        lastChatRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });


    }, [chatHistory, open]);


    // ==========================================
    // OPEN / CLOSE AI
    // ==========================================

    const handleOpenAI = () => {

        if (open) {
            setOpen(false);
            return;
        }

        setOpen(true);

        // Cloud AI is always ready.
        setStatus("AI is ready");
    };


    // ==========================================
    // ASK AI
    // ==========================================

    const handleAsk = async () => {

        if (!question.trim() || loading) {
            return;
        }

        const currentQuestion =
            question.trim();


        try {

            setLoading(true);

            // Keep status permanently as:
            // AI is ready
            setStatus("AI is ready");


            // Add question immediately
            // with temporary empty answer.
            setChatHistory((prev) => [
                ...prev,
                {
                    question: currentQuestion,
                    answer: ""
                }
            ]);


            // Clear input
            setQuestion("");


            const result = await askMultiAgent(currentQuestion);


            console.log("LangGraph selected agent:", result.agent);
            console.log("Related documents:", result.relatedDocuments);

            console.log(
                "Related knowledge sources:",
                result.relatedKnowledgeSources
            );

            // console.log("LangGraph selected agent:", result.agent);
            // console.log("Related documents:", result.relatedDocuments);

            const cleanResult = result.answer.replace(
                /<br\s*\/?>/gi,
                "\n"
            );


            // Replace temporary answer
            // with actual AI response.
            setChatHistory((prev) => {

                const updated = [...prev];

                // VER2
                updated[updated.length - 1] = {
                    question: currentQuestion,
                    answer: cleanResult,

                    // Existing AWS S3 documents
                    relatedDocuments: result.relatedDocuments ?? [],

                    // Portfolio RAG knowledge sources
                    relatedKnowledgeSources:
                        result.relatedKnowledgeSources ?? []
                };


                // VER1
                // updated[updated.length - 1] = {
                //     question: currentQuestion,
                //     answer: cleanResult,
                //     relatedDocuments: result.relatedDocuments ?? []
                // };

                return updated;
            });


        } catch (error) {

            console.error(
                "AI question error:",
                error
            );


            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);


            setChatHistory((prev) => {

                const updated =
                    [...prev];

                updated[
                    updated.length - 1
                ] = {
                    question:
                        currentQuestion,

                    answer:
                        `AI error: ${errorMessage}`
                };

                return updated;
            });


        } finally {

            setLoading(false);

            // Always keep status:
            // AI is ready
            setStatus("AI is ready");
        }
    };


    return (
        <>

            {/* Floating AI button */}

            <button
                className="ai-agent-button"
                onClick={handleOpenAI}
                title="AI Assistant"
            >
                🤖
            </button>


            {open && (

                <div className="ai-agent-window">


                    {/* Header */}

                    <div className="ai-agent-header">

                        <span>
                            🤖 AI Assistant
                        </span>

                        <button
                            onClick={() =>
                                setOpen(false)
                            }
                            title="Close"
                        >
                            ✕
                        </button>

                    </div>


                    {/* Messages */}

                    <div className="ai-agent-messages">

                        <p>
                            👋 Hello! I'm your AI
                            portfolio assistant.
                        </p>


                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {status}
                        </p>


                        {chatHistory.map(
                            (chat, index) => (

                                <div key={index}
                                    ref={
                                    index === chatHistory.length - 1
                                        ? lastChatRef
                                        : undefined
                                    }
                                >

                                    <p>
                                        <strong>
                                            You:
                                        </strong>{" "}
                                        {chat.question}
                                    </p>


                                    {/* // VER2 */}

                                    {chat.answer ? (

                                        <>

                                            {/* AI ANSWER */}

                                            <div className="ai-answer ai-response">

                                                <strong>AI:</strong>

                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {chat.answer}
                                                </ReactMarkdown>

                                            </div>


                                            {/* RELATED DOCUMENTS */}

                                            {chat.relatedDocuments &&
                                                chat.relatedDocuments.length > 0 && (

                                                    <div className="ai-related-documents">

                                                        <div className="ai-related-title">
                                                            📚 Related Documents
                                                        </div>

                                                        {chat.relatedDocuments.map((doc) => (

                                                            <div
                                                                className="ai-related-card"
                                                                key={doc.documentId}
                                                            >

                                                                {/* PDF ICON */}

                                                                <div className="ai-related-icon">
                                                                    📄
                                                                </div>


                                                                {/* DOCUMENT INFORMATION */}

                                                                <div className="ai-related-info">

                                                                    <div className="ai-related-filename">
                                                                        {doc.filename}
                                                                    </div>

                                                                    <div className="ai-related-meta">
                                                                        Client ID: {doc.clientId}
                                                                    </div>

                                                                    <div className="ai-related-pages">

                                                                        Relevant pages:{" "}

                                                                        {doc.relevantPages?.length
                                                                            ? doc.relevantPages.join(", ")
                                                                            : "Not available"}

                                                                    </div>



                                                                    <div className="ai-related-actions">
                                                                        {/* PREVIEW PDF */}
                                                                        <button
                                                                            type="button"
                                                                            className="ai-document-preview-button"
                                                                            onClick={() => handlePreviewDocument(doc)}
                                                                            disabled={
                                                                                previewLoadingId === doc.documentId ||
                                                                                downloadLoadingId === doc.documentId
                                                                            }
                                                                        >
                                                                            {previewLoadingId === doc.documentId
                                                                                ? "Loading PDF..."
                                                                                : "Preview PDF"}
                                                                        </button>


                                                                        {/* DOWNLOAD FILE */}
                                                                        <button
                                                                            type="button"
                                                                            className="ai-document-preview-button"
                                                                            onClick={() => handleDownloadDocument(doc)}
                                                                            disabled={
                                                                                previewLoadingId === doc.documentId ||
                                                                                downloadLoadingId === doc.documentId
                                                                            }
                                                                        >
                                                                            {downloadLoadingId === doc.documentId
                                                                                ? "Preparing Download..."
                                                                                : "Download File"}
                                                                        </button>
                                                                    </div>

                                                                    {previewError?.documentId === doc.documentId && (
                                                                        <div className="ai-document-preview-error">
                                                                            {previewError.message}
                                                                        </div>
                                                                    )}

                                                                </div>

                                                            </div>

                                                        ))}

                                                        {documentPreview &&
                                                            chat.relatedDocuments.some(
                                                                doc => doc.documentId === documentPreview.documentId
                                                            ) && (

                                                            <div className="ai-document-preview">

                                                                <div className="ai-document-preview-header">

                                                                    <strong>
                                                                        PDF Preview: {documentPreview.filename}
                                                                    </strong>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setDocumentPreview(null);
                                                                            setPreviewError(null);
                                                                        }}
                                                                        title="Close PDF preview"
                                                                    >
                                                                        ✕ Close
                                                                    </button>

                                                                </div>

                                                                <iframe
                                                                    src={documentPreview.url}
                                                                    title={documentPreview.filename}
                                                                    className="ai-document-preview-frame"
                                                                />

                                                            </div>

                                                        )}

                                                    </div>

                                                )}
                                            {/* RELATED DOCUMENTS END */}

                                            
                                        </>

                                    ) : (

                                        <div className="ai-thinking">

                                            <span className="thinking-dot"></span>

                                            <span>
                                                AI is thinking...
                                            </span>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>


                    {/* Input */}

                    <div className="ai-agent-input">

                        <input

                            value={question}

                            onChange={(e) =>
                                setQuestion(
                                    e.target.value
                                )
                            }

                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey
                                ) {
                                    e.preventDefault();

                                    handleAsk();
                                }

                            }}

                            placeholder={
                                loading
                                    ? "Please wait..."
                                    : "Ask me something..."
                            }

                            disabled={loading}
                        />


                        <button

                            onClick={handleAsk}

                            disabled={
                                loading ||
                                !question.trim()
                            }

                            title="Ask AI"
                        >
                            ➤
                        </button>

                    </div>

                </div>

            )}

        </>
    );
};

export default AIAgent;

// -- EOF 
