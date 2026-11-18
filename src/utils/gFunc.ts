


// file:    C:\Repos\Portfolio\React\src\utils\gFunc.tsx    


// display purpose
export const formatDate = (value: string | null | undefined): string => {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    const year = date.getFullYear();

    const month = date.toLocaleString("en-US", {
        month: "short"
    });

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


// ==========================================
// NORMALIZE DATE FOR COMPARISON
// ==========================================
// comparison purpose
export const normalizeDate = (
    value: unknown
): string => {

    if (!value) {
        return "";
    }

    const date = new Date(String(value));

    if (isNaN(date.getTime())) {
        return String(value);
    }

    return date.toISOString().slice(0, 10);
};