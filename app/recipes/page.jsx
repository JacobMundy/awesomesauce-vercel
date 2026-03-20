import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RecipeList() {
	const { data } = await supabase
		.from("recipes")
		.select("slug, name, description, average_time");

	if (!data) {
		notFound();
	}

	return (
		<main className="body w-full py-20 flex flex-col items-center">
			<div className="max-w-3xl text-center">
				<h1 className="text-3xl font-bold mb-4">Recipe List</h1>
			</div>

			<hr className="w-1/2 border-gray-700 my-4" />

			<ul className="w-full max-w-1/2 min-w-[350px]">
				{data.map((recipe) => (
					<li key={recipe.slug}>
						<Link
							href={`/recipes/${recipe.slug}`}
							className="flex flex-col gap-1 rounded-2xl border border-foreground/10 bg-foreground/5 px-5 py-4 hover:bg-foreground/10 transition-all"
						>
							<span className="text-base font-semibold">{recipe.name}</span>
							<span className="text-sm opacity-50">{recipe.description}</span>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
