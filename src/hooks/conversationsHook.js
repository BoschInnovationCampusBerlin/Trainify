import {useMutation, useQuery} from "@tanstack/react-query";
import {CONVERSATION_KEY, queryClient} from "../utils/reactQueryUtil";
import {conversationServices} from "../services/conversationServices";

export const useGetConversations = () => {
    return useQuery({
        queryKey: [CONVERSATION_KEY.CONVERSATIONS],
        queryFn: () => conversationServices.getConversations(),
        retry: 3,
    })
}

export const useGetConversation = (id) => {
    return useQuery({
        queryFn: () => conversationServices.getConversation(id),
        queryKey: [CONVERSATION_KEY.CONVERSATION, id],
        retry: 3,
    })
}

export const useCreateConversation = () => {
    return useMutation({
        mutationFn: (reqBody) => conversationServices.createConversation(reqBody),
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATION, data.id]
            });
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATIONS]
            });
        }
    });
};

export const useUpdateConversation = () => {
    return useMutation({
        mutationFn: ({ id, messages }) => conversationServices.updateConversation(id, { messages }),
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATION, data.id]
            });
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATIONS]
            });
        },
    });
};

export const useDeleteConversation = () => {
    return useMutation(({
        mutationFn: ({id}) => conversationServices.deleteConversation(id),
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATIONS]
            })
        }
    }))
}