


// file: src/ai/AIAgentPlannerCPF.ts

import type {
    AgentPlan
} from "./AIAgentTypes";

// ========================================================
// AZURE SQL KNOWLEDGE BASE
// ========================================================

export const createCPFPlan = (
    lowerQuestion: string
): AgentPlan | null => {

    const isKnowledgeBaseQuestion =
        lowerQuestion.includes("cpf") ||
        lowerQuestion.includes("central provident fund") ||
        lowerQuestion.includes("cpf contribution") ||
        lowerQuestion.includes("cpf rate") ||
        lowerQuestion.includes("cpf ceiling") ||
        lowerQuestion.includes("cpf contribution rate") ||
        lowerQuestion.includes("ordinary wages") ||
        lowerQuestion.includes("additional wages") ||
        lowerQuestion.includes("ordinary account") ||
        lowerQuestion.includes("special account") ||
        lowerQuestion.includes("medi-save") ||
        lowerQuestion.includes("medisave") ||
        lowerQuestion.includes("employee contribution") ||
        lowerQuestion.includes("employer contribution");

    if (!isKnowledgeBaseQuestion) {
        return null;
    }

    return {

        goal:
            "Retrieve relevant CPF information from the Azure SQL knowledge base",

        intent:
            "azure_cpf_knowledge_base",

        parameters: {},

        steps: [

            {
                id:
                    "step1",

                tool:
                    "searchAzureCPFKnowledge",

                parameters: {},

                description:
                    "Search the Azure SQL CPF knowledge base"
            }

        ]
    };

};

