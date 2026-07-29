import { api } from "@/shared/lib/apiHandler";
import { API_RAG_PDF_ASK, API_RAG_PDF_UPLOAD } from "@/shared/lib/endpoints";

interface IGetChatPayload {
    content: string;
    history: { role: "user" | "assistant"; content: string }[];
    onChunk: (response: string) => void;
}

export async function postPdf(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(API_RAG_PDF_UPLOAD, { payload: formData });
    return res.data;
}

export async function getRagChat({
    content,
    history,
    onChunk,
}: IGetChatPayload): Promise<void> {
    await api.stream(API_RAG_PDF_ASK, {
        payload: { content, history },
        onChunk,
    });
}
