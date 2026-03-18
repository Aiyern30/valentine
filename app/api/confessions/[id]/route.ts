/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: confessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    // Fetch existing confession to check ownership
    const { data: existingConfession, error: fetchError } = await supabase
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

    // Handle photo updates - delete old photos that were removed
    const updatedPhotos = photosJson
      ? JSON.parse(photosJson)
      : existingConfession.photos;

    if (existingConfession.photos && Array.isArray(existingConfession.photos)) {
      for (const oldPhoto of existingConfession.photos) {
        // Check if this photo still exists in updated photos
        const photoStillExists = updatedPhotos?.some(
          (p: any) => p.url === oldPhoto.url,
        );

        // If photo was removed, delete it from storage
        if (!photoStillExists && oldPhoto.url) {
          try {
            const urlParts = oldPhoto.url.split(
              "/storage/v1/object/public/photos/",
            );
            if (urlParts.length === 2) {
              const filePath = urlParts[1];
              await supabase.storage.from("photos").remove([filePath]);
            }
          } catch (storageError) {
            console.error("Error deleting photo from storage:", storageError);
          }
        }
      }
    }

    // Handle category images updates - delete old category images that were removed
    if (
      existingConfession.categories &&
      Array.isArray(existingConfession.categories)
    ) {
      const newCategories = categoriesJson
        ? JSON.parse(categoriesJson)
        : existingConfession.categories;

      for (const oldCategory of existingConfession.categories) {
        if (oldCategory.items && Array.isArray(oldCategory.items)) {
          for (const oldItem of oldCategory.items) {
            // Find corresponding new category
            const newCategory = newCategories.find(
              (c: any) => c.id === oldCategory.id,
            );

            // Check if this item still exists in new category
            const itemStillExists = newCategory?.items?.some(
              (item: any) => item.url === oldItem.url,
            );

            // If item was removed, delete it from storage
            if (!itemStillExists && oldItem.url) {
              try {
                const urlParts = oldItem.url.split(
                  "/storage/v1/object/public/photos/",
                );
                if (urlParts.length === 2) {
                  const filePath = urlParts[1];
                  await supabase.storage.from("photos").remove([filePath]);
                }
              } catch (storageError) {
                console.error("Error deleting category image:", storageError);
              }
            }
          }
        }
      }
    }

    // Upload new page photos
    const photosArray: any[] = [];
    const pagePhotosMetadata = formData.get("pagePhotos") as string;
    const pagePhotosData = pagePhotosMetadata ? JSON.parse(pagePhotosMetadata) : {};

    for (const [pageIndex, photoData] of Object.entries(pagePhotosData)) {
      const photoFile = formData.get(`pagePhoto_${pageIndex}`) as File;
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${nanoid()}.${fileExt}`;
        const filePath = `confessions/${user.id}/${confessionId}/photos/${fileName}`;

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
      } else {
        // Keep existing photo if no new file
        const existingPhoto = existingConfession.photos?.find(
          (p: any) => p.pageIndex === parseInt(pageIndex),
        );
        if (existingPhoto) {
          photosArray.push(existingPhoto);
        }
      }
    }

    // Upload new category photos
    const categoriesData = formData.get("categories") as string;
    const parsedCategories = categoriesData ? JSON.parse(categoriesData) : [];
    const processedCategories: any[] = [];

    for (let catIndex = 0; catIndex < parsedCategories.length; catIndex++) {
      const category = parsedCategories[catIndex];
      const processedItems = [];

      for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
        const item = category.items[itemIndex];
        const itemFile = formData.get(
          `category_${catIndex}_${itemIndex}`,
        ) as File;

        let itemUrl = item.url || ""; // Keep existing URL if no new file
        
        if (itemFile) {
          const fileExt = itemFile.name.split(".").pop();
          const fileName = `${nanoid()}.${fileExt}`;
          const filePath = `confessions/${user.id}/${confessionId}/categories/${fileName}`;

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

    // Update confession with uploaded photos and categories
    const finalPhotos = photosArray.length > 0 ? photosArray : existingConfession.photos;
    const finalCategories = processedCategories.length > 0 ? processedCategories : existingConfession.categories;

    // Update confession
    const { error: updateError } = await supabase
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
        photos: finalPhotos,
        categories: finalCategories,
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: confessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership before deleting
    const { data: confession, error: fetchError } = await supabase
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

    // Delete entire confession folder from storage
    // New structure: confessions/{user_id}/{confession_id}/
    const confessionFolderPath = `confessions/${user.id}/${confessionId}`;

    try {
      // List all files in the confession folder
      const { data: fileList, error: listError } = await supabase.storage
        .from("photos")
        .list(confessionFolderPath, {
          limit: 1000,
          offset: 0,
        });

      if (!listError && fileList && fileList.length > 0) {
        // Get all file paths recursively
        const filesToDelete: string[] = [];

        // List files in photos subfolder
        const { data: photoFiles } = await supabase.storage
          .from("photos")
          .list(`${confessionFolderPath}/photos`);

        if (photoFiles) {
          photoFiles.forEach((file) => {
            filesToDelete.push(`${confessionFolderPath}/photos/${file.name}`);
          });
        }

        // List files in categories subfolder
        const { data: categoryFiles } = await supabase.storage
          .from("photos")
          .list(`${confessionFolderPath}/categories`);

        if (categoryFiles) {
          categoryFiles.forEach((file) => {
            filesToDelete.push(
              `${confessionFolderPath}/categories/${file.name}`,
            );
          });
        }

        // Delete all files at once
        if (filesToDelete.length > 0) {
          await supabase.storage.from("photos").remove(filesToDelete);
        }
      }
    } catch (storageError) {
      console.error("Error deleting confession folder:", storageError);
      // Continue with database deletion even if storage delete fails
    }

    // Delete confession from database
    const { error: deleteError } = await supabase
      .from("confessions")
      .delete()
      .eq("id", confessionId)
      .eq("sender_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Confession and all associated images deleted successfully",
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: confessionId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch specific confession
    const { data: confession, error } = await supabase
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
