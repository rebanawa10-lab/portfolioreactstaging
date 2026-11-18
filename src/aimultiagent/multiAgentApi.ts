


// file:   multiAgentApi.ts

// NEW: 202611 17 AWS
const API_BASE = (
  import.meta.env.VITE_NODEJS_API_CLOUD ||
  "https://18.138.83.209"
).replace(/\/+$/, "");

// OLD: 202611 17 Vercel
// const API_BASE = (
//   import.meta.env.VITE_NODEJS_API_CLOUD ||
//   "https://apin-ode-jsv-ercel.vercel.app"
// ).replace(/\/+$/, "");

const SESSION_KEY = "langgraphSessionId";


export interface RelatedKnowledgeSource {
  id: number | string;
  title: string;
  category?: string;
  similarity?: number;
}

// ==========================================
// RELATED DOCUMENT
// ==========================================

export interface RelatedDocument {
  documentId: string;
  clientId: string;
  filename: string;
  pageCount?: number;
  relevantPages: number[];
  relevance?: number;
}

// ==========================================
// MULTI-AGENT RESPONSE
// ==========================================

export interface MultiAgentResponse {
  success: boolean;
  sessionId: string;
  agent: string;
  answer: string;
  relatedDocuments?: RelatedDocument[];
  relatedKnowledgeSources?: RelatedKnowledgeSource[];
}

// ==========================================
// DOCUMENT PREVIEW RESPONSE
// ==========================================

export interface DocumentPreviewResponse {
  success: boolean;
  documentId: string;
  clientId: string;
  filename: string;
  url: string;
  disposition: string;
  expiresInSeconds: number;
}

// ==========================================
// SESSION ID
// ==========================================

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

// ==========================================
// ASK LANGGRAPH MULTI-AGENT
// ==========================================

export async function askMultiAgent(
  question: string
): Promise<MultiAgentResponse> {
  const response = await fetch(
    `${API_BASE}/api/ai/multiagent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        sessionId: getSessionId(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || `API request failed: ${response.status}`
    );
  }

  if (typeof data.answer !== "string") {
    throw new Error("The LangGraph API returned no answer.");
  }

  return data as MultiAgentResponse;
}

// ==========================================
// GET DOCUMENT PDF PREVIEW URL
// ==========================================

export async function getDocumentPreviewUrl(
  documentId: string,
  download = false
): Promise<DocumentPreviewResponse> {
  if (!documentId?.trim()) {
    throw new Error("Document ID is required.");
  }

  const response = await fetch(
    `${API_BASE}/api/ai/multiagent/document-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        download,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || `Document request failed: ${response.status}`
    );
  }

  if (!data.success || typeof data.url !== "string") {
    throw new Error("The document API returned no URL.");
  }

  return data as DocumentPreviewResponse;
}

// -- EOF

