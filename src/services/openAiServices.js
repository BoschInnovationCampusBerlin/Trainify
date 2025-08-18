import { handleSetN8nLanguage } from "../utils/n8nLanguageConvert";
import { api } from "./api";

const n8nBaseUrl = "https://lamnhuthoa.app.n8n.cloud/webhook";

export const openAiServices = {
  sendMessage: async (message) => {
    return await api
      .post("/message", { prompt: message })
      .then((response) => response.data);
  },
  readAloudText: async (text) => {
    return await api
      .post(
        "/read-aloud",
        { text },
        {
          responseType: "blob",
        }
      )
      .then((response) => response.data);
  },
  sendRecording: async ({ audioBlob, lang }) => {
    const formData = new FormData();
    formData.append("data", audioBlob, "recoding.webm");
    const selectedLanguage = handleSetN8nLanguage(lang);
    formData.append("lang", selectedLanguage);

    return await api.post(
      `${n8nBaseUrl}/speech-to-text`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  getEvaluation: async (messages) => {
    return await api.post(
      `${n8nBaseUrl}/eval-transcript`,
      messages,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },
  resetConversation: async () => {
    return await api.delete(`${n8nBaseUrl}/reset-conversation`)
  }
};
