"use client";

import { 
  CreditCard, 
  Crown, 
  Home, 
  MessageCircleQuestion
} from "lucide-react";
import { usePathname } from "next/navigation";
import { GLOBAL_NAME } from "@/lib/const";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useBilling } from "@/features/subscriptions/api/use-billing";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {

  const pathname = usePathname();
  const mutation = useCheckout();
  const billingMutation = useBilling();
  const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }
    
    billingMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && !isLoading && (
        <>
          <div className="text-center px-3">
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="w-full px-0 rounded-xl border-none hover:bg-white hover:opacity-75 transition"
              variant="outline"
              size="lg"
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Upgrade to {GLOBAL_NAME} Pro
            </Button>
          </div>
          <div className="px-3">
            <Separator />
          </div>
        </>
      )}
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          icon={Home}
          label="Home"
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          icon={CreditCard}
          label="Billing"
          onClick={onClick}
        />
        <SidebarItem
          href="mailto:eiyzc66@gmail.com"
          icon={MessageCircleQuestion}
          label="Get Help"
        />
      </ul>
    </div>
  );
};
