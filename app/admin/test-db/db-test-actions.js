"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export async function insertTestRecipe() {
	const supabase = await requireAdmin();
	await supabase.from("recipes").insert({
		name: "Test Recipe",
		ingredients: { "Test Ingredient": 1 },
		slug: "test-recipe",
		average_time: 5,
	});
	revalidatePath("/recipes");
}

export async function clearTestData() {
	await requireAdmin();
	const supabase = await createClient();
	await supabase.from("recipes").delete().eq("slug", "test-recipe");
	revalidatePath("/recipes");
}

export async function revalidateRecipes() {
	await requireAdmin();
	revalidatePath("/recipes");

	console.log("Revalidated /recipes");
}
