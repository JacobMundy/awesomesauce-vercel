import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import RecipeForm from "../../RecipeForm";

export default async function EditRecipePage({ params }) {
	const { slug } = await params;

	const { data: recipe } = await supabase
		.from("recipes")
		.select("*")
		.eq("slug", slug)
		.single();

	if (!recipe) notFound();

	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="max-w-2xl mx-auto">
				<Link
					href="/admin/recipes"
					className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8"
				>
					← Recipes
				</Link>
				<h1 className="text-4xl font-bold mb-1">{recipe.name}</h1>
				<p className="text-sm opacity-50 mb-10">
					Logged in as{" "}
					<span className="opacity-100 font-medium">{username}</span>
				</p>
				<RecipeForm recipe={recipe} />
			</div>
		</main>
	);
}
