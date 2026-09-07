// blucid-world/app/contact/page.tsx
"use client";

import { useRouter } from "next/navigation";
import ContactView from "@/components/ContactView";

export default function ContactPage() {
  const router = useRouter();
  return <ContactView onBack={() => router.push("/")} />;
}
