import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RecipeForm from "../../RecipeForm";
import AdminHeader from "../../../AdminHeader";

export default async function EditRecipePage({ params }) {
	const { slug } = await params;
	const supabase = await createClient();

	const { data: recipe } = await supabase
		.from("recipes")
		.select("*")
		.eq("slug", slug)
		.single();

	if (!recipe) notFound();

	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="max-w-2xl mx-auto">
				<AdminHeader
					title={recipe.name}
					backHref="/admin/recipes"
					backLabel="Recipes"
				/>
				<RecipeForm recipe={recipe} />
			</div>
		</main>
	);
}
