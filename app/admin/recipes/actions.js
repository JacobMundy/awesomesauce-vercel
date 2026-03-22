"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export async function saveRecipe(formData, isNew) {
	const supabase = await requireAdmin();

	const ingredients = JSON.parse(formData.ingredients);
	const steps = JSON.parse(formData.steps);

	const payload = {
		name: formData.name,
		slug: formData.slug,
		description: formData.description,
		average_time: parseInt(formData.average_time),
		source: formData.source,
		ingredients: { ingredients },
		steps: { steps },
	};

	if (isNew) {
		const { error } = await supabase.from("recipes").insert(payload);
		if (error) throw new Error(error.message);
	} else {
		const { error } = await supabase
			.from("recipes")
			.update(payload)
			.eq("slug", formData.originalSlug);
		if (error) throw new Error(error.message);
	}

	revalidatePath("/recipes");
	revalidatePath(`/recipes/${formData.slug}`);
	revalidatePath("/admin/recipes");
	redirect("/admin/recipes");
}

export async function deleteRecipe(slug) {
	const supabase = await requireAdmin();

	const { error } = await supabase.from("recipes").delete().eq("slug", slug);
	if (error) throw new Error(error.message);
	revalidatePath("/recipes");
	revalidatePath("/admin/recipes");
}
