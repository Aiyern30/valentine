// app/api/invitations/accept/route.ts
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { token } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("accept_invitation", {
    p_token: token,
  });

  if (error) {
    console.error("❌ Error accepting invitation:", error);
    return Response.json(
      { error: error.message || "Failed to accept invitation" },
      { status: 400 },
    );
  }

  if (data?.error) {
    return Response.json({ error: data.error }, { status: 400 });
  }

  revalidatePath("/dashboard");

  return Response.json({ success: true, relationshipId: data.relationshipId });
}
