import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";

export const usePaywall = () => {


  const subscriptionModal = useSubscriptionModal();

  return {
    isLoading: false,
    shouldBlock: true,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    },
  };
};
