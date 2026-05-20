import { notFound } from "next/navigation";
import { getAnchor, TOTAL_ANCHORS } from "@/lib/anchors";
import { AnchorPage } from "./AnchorPage";

export function generateStaticParams() {
  return Array.from({ length: TOTAL_ANCHORS }, (_, i) => ({
    id: String(i + 1),
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();
  const anchor = getAnchor(numId);
  if (!anchor) notFound();
  return <AnchorPage anchor={anchor} />;
}
