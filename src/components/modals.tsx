"use client";

import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { useClient } from "@/lib/hooks";

export const Modals = () => {
  const onlyClient = useClient();

  return (
    onlyClient&&
    <>
      <SubscriptionModal />
    </>
  );
};
