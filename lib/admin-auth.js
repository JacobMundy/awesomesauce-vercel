"use server";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (
		!user ||
		user.user_metadata?.provider_id !== process.env.ADMIN_GITHUB_ID
	) {
		throw new Error("Unauthorized");
	}

	return supabase;
}
