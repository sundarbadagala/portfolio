import { API_CHAT } from "@/shared/lib/endpoints";

interface IGetChatPayload {
  content: string;
  onChunk: (response: string) => void;
}

interface ISSEData {
  type: "chunk" | "done";
  content?: string;
}

export async function getChat({
  content,
  onChunk,
}: IGetChatPayload): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_CHAT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        try {
          const data: ISSEData = JSON.parse(line.replace("data: ", ""));

          if (data.type === "chunk" && data.content) {
            result += data.content;
            onChunk(result);
          }

          if (data.type === "done") {
            return;
          }
        } catch (error) {
          console.error("Failed to parse SSE data:", error);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
