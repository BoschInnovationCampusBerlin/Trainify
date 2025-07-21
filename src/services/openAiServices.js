import { handleSetN8nLanguage } from "../utils/n8nLanguageConvert";
import { api } from "./api";

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
      "https://hoalam.app.n8n.cloud/webhook-test/speech-to-text",
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
      "https://hoalam.app.n8n.cloud/webhook-test/eval-transcript",
      messages,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },
};
