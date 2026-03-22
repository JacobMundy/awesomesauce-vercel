"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/admin-auth";

export async function handleCompleteUpdate() {
	await requireAdmin();
	revalidatePath("/", "layout");
}

export async function handlePathUpdate(path) {
	await requireAdmin();
	revalidatePath(path);
}
