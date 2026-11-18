



// file: src/ai/aiToolsAzureCPF.ts

// =========================================================
// AZURE SQL CPF KNOWLEDGE BASE
// =========================================================

const AZURE_API_BASE =
    import.meta.env.VITE_NODEJS_AZURE_API_CLOUD ||
    "https://rebanawa-portfolio-api.azurewebsites.net";


// =========================================================
// SEARCH AZURE CPF KNOWLEDGE
// =========================================================

export const searchAzureCPFKnowledge = async (
    question: string
): Promise<unknown> => {

    console.log(
        "searchAzureCPFKnowledge ---------- **"
    );

    console.log(
        "CPF question:",
        question
    );


    const response =
        await fetch(
            `${AZURE_API_BASE}/api/ai/cpf`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    question
                })
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.error ||
            `Azure CPF knowledge API error: ${response.status}`
        );
    }


    return (
        data?.results ??
        data?.answer ??
        data
    );
};

// -- EOF