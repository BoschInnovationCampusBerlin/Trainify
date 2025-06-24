import {CONVERSATION_KEY, OPEN_AI_KEY, queryClient} from "../utils/reactQueryUtil";
import {useMutation, useQuery} from "@tanstack/react-query";
import {openAiServices} from "../services/openAiServices";

export const useSendMessage = () => {
    return useMutation({
        mutationFn: (message) => openAiServices.sendMessage(message),
        retry: 3,
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATIONS]
            });
        }
    })
}

export const useSendRecording = () => {
    return useMutation({
        mutationFn: (audio) => openAiServices.sendRecording(audio),
        retry: 3,
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [CONVERSATION_KEY.CONVERSATIONS]
            })
        }
    })
}

export const useReadAloudText = () => {
    return useMutation({
        mutationFn: (text) => openAiServices.readAloudText(text),
    })
}