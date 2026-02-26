import { DiaryEditor } from "../[id]/diary-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Diary Entry",
  description:
    "Create a new diary entry to capture your special moments together. Write your love story one entry at a time.",
  keywords: ["new diary", "write diary", "love journal", "couple diary entry"],
};

export default function NewDiaryPage() {
  return <DiaryEditor />;
}
