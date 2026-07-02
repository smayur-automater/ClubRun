import { getRunIds } from "@/lib/data";
import { RunDetail } from "./RunDetail";

/** Static export enumerates the mock ids; the backend milestone (M3) moves this to dynamic rendering. */
export async function generateStaticParams() {
  return (await getRunIds()).map((id) => ({ id }));
}

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunDetail id={id} />;
}
