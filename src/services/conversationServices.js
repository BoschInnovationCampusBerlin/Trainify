import {api} from "./api";

export const conversationServices = {
    getConversations: async() => {
        return await api.get("/conversations")
            .then((response) => response.data);
    },
    getConversation: async(id) => {
        return await api.get(`/conversations/${id}`)
            .then((response) => response.data);
    },
    createConversation: async(reqBody) => {
        return await api.post("/conversations", reqBody)
            .then((response) => response.data);
    },
    updateConversation: async(id, reqBody) => {
        return await api.put(`/conversations/${id}`, reqBody)
            .then((response) => response.data);
    },
    deleteConversation: async(id) => {
        return await api.delete(`conversations/${id}`)
            .then((response) => response.data);
    }
}