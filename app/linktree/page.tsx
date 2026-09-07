// blucid-world/app/linktree/page.tsx
"use client";

import { useRouter } from "next/navigation";
import LinkTreeView from "@/components/LinkTreeView";

export default function LinkTreePage() {
  const router = useRouter();
  return <LinkTreeView onBack={() => router.push("/")} />;
}
