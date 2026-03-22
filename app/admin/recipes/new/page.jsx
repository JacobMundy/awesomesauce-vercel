import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RecipeForm from "../RecipeForm";

export default async function NewRecipePage() {
	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="w-full mx-auto">
				<Link
					href="/admin/recipes"
					className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8"
				>
					← Recipes
				</Link>
				<h1 className="text-4xl font-bold mb-1">Add Recipe</h1>
				<p className="text-sm opacity-50 mb-10">
					Logged in as{" "}
					<span className="opacity-100 font-medium">{username}</span>
				</p>
				<RecipeForm />
			</div>
		</main>
	);
}
