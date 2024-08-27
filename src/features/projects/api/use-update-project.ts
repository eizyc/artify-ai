import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.projects[":id"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":id"]["$patch"]>["json"];

export const useUpdateProject = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationKey: ["project", { id }],
    mutationFn: async (json) => {
      if (!id) throw new Error("Failed to fetch project");
      const response = await client.api.projects[":id"].$patch({ 
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
    },
    onError: () => {
      toast.error("Failed to update project");
    }
  });

  const conditionalMutate = (...args: Parameters<typeof mutation.mutate>) => {
    if (!!id) {
      mutation.mutate(...args);
    }
  };


  return { ...mutation, mutate: conditionalMutate };
};
