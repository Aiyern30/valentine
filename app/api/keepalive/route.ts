// app/api/keepalive/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // A simple, lightweight query just to wake up the database
    // This fetches the current time from the PostgreSQL database
    const { data, error } = await supabase
      .rpc("get_service_role_config")
      .limit(1)
      .maybeSingle();
    // Or we can just do a very simple select from any table:
    // const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      console.error("Keep-alive error:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "active",
      message: "Supabase connection is alive",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 },
    );
  }
}
