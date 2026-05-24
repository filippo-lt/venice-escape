import { notFound, redirect } from "next/navigation";
import { getAnchor, TOTAL_ANCHORS } from "@/lib/anchors";
import { TransitionPage } from "./TransitionPage";

export function generateStaticParams() {
  // Solo 1..6 hanno una transizione (la 7 va dritta al finale).
  return Array.from({ length: TOTAL_ANCHORS - 1 }, (_, i) => ({
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

  // Ancora 7 non ha transizione: si va direttamente a /finale.
  if (numId === TOTAL_ANCHORS) {
    redirect("/finale");
  }

  const next = getAnchor(numId + 1);

  // Eventuale outro audio: il file deve essere depositato in
  // public/audio/main/ con il pattern ancora_N_outro.mp3.
  // Il componente lo monta solo se presente; in dev, prima che gli asset
  // arrivino, lasciamo undefined.
  return <TransitionPage anchor={anchor} next={next} />;
}
