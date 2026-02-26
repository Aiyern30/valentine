import KawaiiRoomApp from "@/components/KawaiiRoomApp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Game",
  description: "Take care of your virtual pet together! Feed, play, and nurture your shared companion in this cute interactive game.",
  keywords: ["pet game", "virtual pet", "couple game", "interactive game", "kawaii pet"],
};

export default function Home() {
  return <KawaiiRoomApp />;
}
