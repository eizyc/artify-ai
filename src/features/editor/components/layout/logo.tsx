import Link from "next/link";
import Image from "next/image";
import { GLOBAL_NAME } from "@/lib/const";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="size-8 relative shrink-0">
        <Image
          src="/logo.svg"
          fill
          alt={GLOBAL_NAME}
          className="shrink-0 hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};
