import { WhatsappShell } from "@/src/features/admin/whatsapp/components/whatsapp-shell";

export default function WhatsappLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WhatsappShell>{children}</WhatsappShell>;
}
