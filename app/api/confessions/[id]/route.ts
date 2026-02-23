import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const lovedOneName = formData.get("loved_one_name") as string;
    const petName = formData.get("pet_name") as string;
    const senderName = formData.get("sender_name") as string;
    const relationshipStatus = formData.get("relationship_status") as string;
    const message = formData.get("message") as string;
    const theme = formData.get("theme") as string;
    const envelopeStyle = formData.get("envelope_style") as string;
    const musicUrl = formData.get("music_url") as string;
    const photosJson = formData.get("photos") as string;
    const categoriesJson = formData.get("categories") as string;

    const confessionId = params.id;

    // Fetch existing confession to check ownership
    const { data: existingConfession, error: fetchError } = await (
      await supabase
    )
      .from("confessions")
      .select("*")
      .eq("id", confessionId)
      .eq("sender_id", user.id)
      .single();

    if (fetchError || !existingConfession) {
      return NextResponse.json(
        { error: "Confession not found or unauthorized" },
        { status: 404 },
      );
    }

    // Handle photo uploads if any
    const updatedPhotos = photosJson
      ? JSON.parse(photosJson)
      : existingConfession.photos;

    // Update confession
    const { error: updateError } = await (
      await supabase
    )
      .from("confessions")
      .update({
        title,
        loved_one_name: lovedOneName,
        pet_name: petName,
        sender_name: senderName,
        relationship_status: relationshipStatus,
        message,
        theme,
        envelope_style: envelopeStyle,
        music_url: musicUrl,
        photos: updatedPhotos,
        categories: categoriesJson
          ? JSON.parse(categoriesJson)
          : existingConfession.categories,
      })
      .eq("id", confessionId)
      .eq("sender_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Confession updated successfully",
    });
  } catch (error) {
    console.error("Error updating confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const confessionId = params.id;

    // Verify ownership before deleting
    const { data: confession, error: fetchError } = await (await supabase)
      .from("confessions")
      .select("*")
      .eq("id", confessionId)
      .eq("sender_id", user.id)
      .single();

    if (fetchError || !confession) {
      return NextResponse.json(
        { error: "Confession not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete confession
    const { error: deleteError } = await (await supabase)
      .from("confessions")
      .delete()
      .eq("id", confessionId)
      .eq("sender_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Confession deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const confessionId = params.id;

    // Fetch specific confession
    const { data: confession, error } = await (await supabase)
      .from("confessions")
      .select("*")
      .eq("id", confessionId)
      .eq("sender_id", user.id)
      .single();

    if (error || !confession) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ confession });
  } catch (error) {
    console.error("Error fetching confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
