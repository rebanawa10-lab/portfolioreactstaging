


// file:    C:\Repos\PortfolioStaging\React\src\ailangchain\langchainApi.ts      

const API_BASE =
    import.meta.env.VITE_LANGCHAIN_API_BASE ||
    "http://localhost:3000";

// ==========================================
// LANGGRAPH SESSION ID
// ==========================================

// Generate once per browser tab session.
// Reuse the same ID for follow-up questions.
const SESSION_STORAGE_KEY = "langgraphSessionId";

function getSessionId(): string {

    let sessionId = sessionStorage.getItem(
        SESSION_STORAGE_KEY
    );

    if (!sessionId) {

        sessionId = crypto.randomUUID();

        sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            sessionId
        );
    }

    return sessionId;
}

// ==========================================
// API RESPONSE
// ==========================================

export interface LangChainResponse {
    success: boolean;
    answer?: string;
    message?: string;
    sessionId?: string;
}

// ==========================================
// ASK LANGGRAPH
// ==========================================

export async function askLangChain(
    question: string
): Promise<string> {

    const sessionId = getSessionId();

    console.log("LANGGRAPH SESSION:", sessionId);
    console.log("LANGGRAPH QUESTION:", question);

    const response = await fetch(
        `${API_BASE}/api/ai/langchain/ask`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question,
                sessionId
            }),
        }
    );

    const data: LangChainResponse =
        await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "LangGraph request failed."
        );
    }

    if (typeof data.answer !== "string") {
        throw new Error("No answer returned by LangGraph.");
    }

    return data.answer;
}

// ==========================================
// RESET CONVERSATION
// ==========================================

export function resetLangGraphSession(): void {

    const newSessionId = crypto.randomUUID();

    sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        newSessionId
    );

    console.log(
        "NEW LANGGRAPH SESSION:",
        newSessionId
    );
}

// -- EOF



// VER1
// const API_BASE =
//     import.meta.env.VITE_LANGCHAIN_API_BASE ||
//     "http://localhost:3000";

// export interface LangChainResponse {
//     success: boolean;
//     answer?: string;
//     message?: string;
// }

// export async function askLangChain(
//     question: string
// ): Promise<string> {
//     const response = await fetch(
//         `${API_BASE}/api/ai/langchain/ask`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ question }),
//         }
//     );

//     const data: LangChainResponse =
//         await response.json();

//     if (!response.ok || !data.success) {
//         throw new Error(
//             data.message || "LangChain request failed."
//         );
//     }

//     if (typeof data.answer !== "string") {
//         throw new Error("No answer returned by LangChain.");
//     }

//     return data.answer;
// }


// -- EOF 



