import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

const MESSAGES_QUERY_KEY = ["messages"];

export const useMessages = () => {
  const queryClient = useQueryClient();

  const getMessages = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => [], // initially empty, or load from localStorage/API
    staleTime: Infinity,
    enabled: false, // don't run automatically
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

  return {
    messages: queryClient.getQueryData(MESSAGES_QUERY_KEY) || [],
    setMessages: setMessages.mutate,
    addConversationMessage,
  };
};