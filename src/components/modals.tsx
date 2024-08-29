"use client";

import { FailModal } from "@/features/subscriptions/components/fail-modal";
import { SuccessModal } from "@/features/subscriptions/components/success-modal";
import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { useClient } from "@/lib/hooks";

export const Modals = () => {
  const onlyClient = useClient();

  return (
    onlyClient&&
    <>
      <SubscriptionModal />
      <FailModal />
      <SuccessModal />
    </>
  );
};
