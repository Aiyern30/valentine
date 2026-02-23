/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();

    // Extract confession data
    const title = formData.get("title") as string;
    const lovedOneName = formData.get("lovedOneName") as string;
    const petName = formData.get("petName") as string;
    const yourName = formData.get("yourName") as string;
    const relationshipStatus = formData.get("relationshipStatus") as string;
    const message = formData.get("message") as string;
    const theme = formData.get("theme") as string;
    const envelopeStyle = formData.get("envelopeStyle") as string;
    const musicUrl = formData.get("musicUrl") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const recipientEmail = formData.get("recipientEmail") as string;

    // Parse JSON fields
    const pagePhotosData = formData.get("pagePhotos") as string;
    const categoriesData = formData.get("categories") as string;

    const pagePhotos = pagePhotosData ? JSON.parse(pagePhotosData) : {};
    const categories = categoriesData ? JSON.parse(categoriesData) : [];

    // Upload page photos to storage
    const photosArray = [];
    for (const [pageIndex, photoData] of Object.entries(pagePhotos)) {
      const photoFile = formData.get(`pagePhoto_${pageIndex}`) as File;
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${user.id}/${nanoid()}.${fileExt}`;
        const filePath = `confessions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, photoFile);

        if (uploadError) {
          console.error("Photo upload error:", uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        photosArray.push({
          pageIndex: parseInt(pageIndex),
          position: (photoData as any).position,
          url: publicUrl,
        });
      }
    }

    // Upload category photos
    const processedCategories = [];
    for (let catIndex = 0; catIndex < categories.length; catIndex++) {
      const category = categories[catIndex];
      const processedItems = [];

      for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
        const item = category.items[itemIndex];
        const itemFile = formData.get(
          `category_${catIndex}_${itemIndex}`,
        ) as File;

        let itemUrl = "";
        if (itemFile) {
          const fileExt = itemFile.name.split(".").pop();
          const fileName = `${user.id}/${nanoid()}.${fileExt}`;
          const filePath = `confessions/categories/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, itemFile);

          if (!uploadError) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("photos").getPublicUrl(filePath);
            itemUrl = publicUrl;
          }
        }

        processedItems.push({
          title: item.title,
          date: item.date,
          url: itemUrl,
        });
      }

      processedCategories.push({
        id: category.id,
        name: category.name,
        items: processedItems,
      });
    }

    // Generate unique link token
    const linkToken = nanoid(16);

    // Set expiration (optional - 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Insert confession into database
    const { data: confession, error: confessionError } = await supabase
      .from("confessions")
      .insert({
        sender_id: user.id,
        recipient_email: recipientEmail,
        title,
        theme,
        message,
        link_token: linkToken,
        loved_one_name: lovedOneName,
        pet_name: petName,
        sender_name: yourName,
        relationship_status: relationshipStatus,
        music_url: musicUrl,
        photos: photosArray,
        sender_full_name: fullName,
        sender_email: email,
        sender_phone: phone,
        envelope_style: envelopeStyle,
        categories: processedCategories,
        expires_at: expiresAt.toISOString(),
        is_opened: false,
      })
      .select()
      .single();

    if (confessionError) {
      console.error("Confession insert error:", confessionError);
      return NextResponse.json(
        { error: "Failed to create confession", details: confessionError },
        { status: 500 },
      );
    }

    // Return success with the link token
    return NextResponse.json({
      success: true,
      linkToken,
      confessionId: confession.id,
      shareUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/confession/${linkToken}`,
    });
  } catch (error) {
    console.error("Error creating confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
