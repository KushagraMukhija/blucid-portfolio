// blucid-world/app/links/page.tsx
"use client";

import { useRouter } from "next/navigation";
import LinkTreeView from "@/components/LinkTreeView";

export default function LinksPage() {
  const router = useRouter();
  return <LinkTreeView onBack={() => router.push("/")} />;
}
