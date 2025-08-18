import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { CONVERSATION_KEY } from "../utils/reactQueryUtil";

const MESSAGES_QUERY_KEY = ["messages"];

export const useMessages = () => {
  const queryClient = useQueryClient();

  const getMessages = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => [],
    staleTime: Infinity,
    enabled: false,
  });

  const setMessages = useMutation({
    mutationFn: (newMessages) => newMessages, // just pass through
    onSuccess: (data) => {
      queryClient.setQueryData(MESSAGES_QUERY_KEY, data);
    },
  });

  const addConversationMessage = (newMsg) => {
    const current = queryClient.getQueryData(MESSAGES_QUERY_KEY) || [];
    const updated = [...current, newMsg];
    queryClient.setQueryData(MESSAGES_QUERY_KEY, updated);
  };

  const clearConversationMessages = () => {
    queryClient.setQueryData(MESSAGES_QUERY_KEY, []);
    queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY});
  };

  return {
    messages: queryClient.getQueryData(MESSAGES_QUERY_KEY) || [],
    setMessages: setMessages.mutate,
    addConversationMessage,
    clearConversationMessages
  };
};