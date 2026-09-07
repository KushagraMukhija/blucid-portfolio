// blucid-world/app/merch/page.tsx
"use client";

import { useRouter } from "next/navigation";
import MerchView from "@/components/MerchView";

export default function MerchPage() {
  const router = useRouter();
  return <MerchView onBack={() => router.push("/")} />;
}
