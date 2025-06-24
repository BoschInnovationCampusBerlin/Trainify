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
  sendRecording: async (audio) => {
    const formData = new FormData();
    formData.append("data", audio, "recoding.webm")

    return await api.post(
      "https://pavelsimo.app.n8n.cloud/webhook-test/speech-to-text",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
