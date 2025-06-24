import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

export const CONVERSATION_KEY = {
  CONVERSATION: "Conversation",
  CONVERSATIONS: "Conversations",
  CONVERSATION_TITLE: "Conversaion Title"
}

export const OPEN_AI_KEY = {
    MESSAGE: "Message",
    MESSAGES: "Messages",
    MODEL: "Model"
}