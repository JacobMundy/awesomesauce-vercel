import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteRecipeButton from "./DeleteRecipeButton";
import AdminHeader from "../AdminHeader";

export default async function AdminRecipes() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("recipes")
		.select("name, slug, average_time, description")
		.order("name");

	const recipes = data;

	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="max-w-3xl mx-auto">
				<AdminHeader title="Recipes" backHref="/admin" backLabel="Admin">
					<Link
						href="/admin/recipes/new"
						className="mt-8 flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-80 transition-opacity"
					>
						<span className="text-lg leading-none">+</span>
						New Recipe
					</Link>
				</AdminHeader>

				{!recipes || recipes.length === 0 ? (
					<div className="text-center py-20 opacity-40">
						<p className="text-4xl mb-4">🍽️</p>
						<p className="text-sm uppercase tracking-widest">No recipes yet</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{recipes.map((recipe) => (
							<div
								key={recipe.slug}
								className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 px-5 py-4 hover:bg-foreground/10 transition-all"
							>
								<div className="min-w-0">
									<h2 className="font-medium truncate">{recipe.name}</h2>
									<p className="text-xs mt-0.5 opacity-40 truncate">
										{recipe.slug} · {recipe.average_time} min
									</p>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<Link
										href={`/recipes/${recipe.slug}`}
										target="_blank"
										className="text-xs opacity-50 hover:opacity-100 border border-foreground/10 hover:border-foreground/20 rounded-lg px-3 py-1.5 transition-all"
									>
										View
									</Link>
									<Link
										href={`/admin/recipes/edit/${recipe.slug}`}
										className="text-xs border border-foreground/20 hover:border-foreground/40 rounded-lg px-3 py-1.5 transition-all"
									>
										Edit
									</Link>
									<DeleteRecipeButton slug={recipe.slug} name={recipe.name} />
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
