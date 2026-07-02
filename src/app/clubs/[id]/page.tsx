import { getClubIds } from "@/lib/data";
import { ClubDetail } from "./ClubDetail";

/** Static export enumerates the mock ids; the backend milestone (M3) moves this to dynamic rendering. */
export async function generateStaticParams() {
  return (await getClubIds()).map((id) => ({ id }));
}

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClubDetail id={id} />;
}
