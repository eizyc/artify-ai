import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.subscriptions.billing["$post"], 200>;

export const useBilling = () => {
  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await client.api.subscriptions.billing.$post();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Subscription not found");
        } else {
          throw new Error("Failed to create session");
        }
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error.message?? "Failed to create session");
    },
  });

  return mutation;
};
