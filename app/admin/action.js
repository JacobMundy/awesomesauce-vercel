"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const supabase = await createClient();

export async function handleCompleteUpdate() {
	revalidatePath("/", "layout");
}

export async function handlePathUpdate(path) {
	revalidatePath(path);
}
