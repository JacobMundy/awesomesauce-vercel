"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function insertTestRecipe() {
	const supabase = await createClient();
	await supabase.from("recipes").insert({
		name: "Test Recipe",
		ingredients: { "Test Ingredient": 1 },
		slug: "test-recipe",
		average_time: 5,
	});
	revalidatePath("/recipes");
}

export async function clearTestData() {
	const supabase = await createClient();
	await supabase.from("recipes").delete().eq("slug", "test-recipe");
	revalidatePath("/recipes");
	confirm(
		"Test data cleared. Please check the recipes page to confirm the test recipe has been removed.",
	);
}

export async function revalidateRecipes() {
	revalidatePath("/recipes");

	console.log("Revalidated /recipes");
}
