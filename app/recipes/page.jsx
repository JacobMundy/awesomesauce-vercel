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
			<h1>Recipe List</h1>

			<hr className="w-1/2 border-gray-700 my-4" />

			<ul>
				{data.map((recipe) => (
					<li key={recipe.slug} className="mb-4">
						<Link
							href={`/recipes/${recipe.slug}`}
							className="text-blue-500 hover:underline"
						>
							<h2>{recipe.name}</h2>
							<p>{recipe.description}</p>
							<p>Average Time: {recipe.average_time} minutes</p>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
