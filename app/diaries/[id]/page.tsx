import { getDiaryById, getUser } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import { DiaryEditor } from "./diary-editor";

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const diary = await getDiaryById(id);
  if (!diary) notFound();

  // Ensure user has access (either creator or in the relationship)
  // (In a real app, we'd verify relationship_id matches user's relationship)

  return <DiaryEditor diary={diary} />;
}
