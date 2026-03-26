import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";


// ── Unit Toggle ───────────────────────────────────────────────────────────────
function UnitToggle({ unit, onToggle }) {
	return (
		<div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit mb-5">
			<button
				onClick={() => onToggle("imperial")}
				className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
					unit === "imperial"
						? "bg-white/15 text-white"
						: "text-gray-400 hover:text-white"
				}`}
			>
				Imperial
			</button>
			<button
				onClick={() => onToggle("metric")}
				className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
					unit === "metric"
						? "bg-white/15 text-white"
						: "text-gray-400 hover:text-white"
				}`}
			>
				Metric
			</button>
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function RecipeDetails({ params }) {
	const { slug } = await params;
	const { data } = await supabase
		.from("recipes")
		.select("*")
		.eq("slug", slug)
		.single();

	if (!data) notFound();

	const ingredients = data.ingredients?.ingredients ?? [];
	const instructions = data.steps?.steps ?? [];

	console.log(ingredients)
	console.log(instructions)

	// Default unit — swap to "metric" if you want metric as default
	// TODO
	const unit = "imperial";

	return (
		<main className="grid grid-cols-1 md:grid-cols-[280px_1fr] w-full py-20 px-4 md:px-8 max-w-5xl mx-auto gap-x-8 gap-y-6">
			{/* Title/Description and Average Time field */}
			<div className="md:col-span-2 md:flex sm:flex-col md:justify-between items-start w-full">
				<fieldset className="border p-5 rounded-2xl w-full">
					<legend>Title/Description</legend>
					<div className="text-2xl font-semibold">{data.name}</div>
					<div className="pt-2">{data.description}</div>
				</fieldset>

				<div className="flex pt-3">
					<fieldset className="border p-5 rounded-2xl">
						<legend>Average Time</legend>
						{data.average_time} minutes
					</fieldset>
					{data.source && <fieldset className="border p-5 ml-1 rounded-2xl">
						<legend> Source </legend>
						<a href={data.source} className="underline" style={{color: "cornflowerblue" }}>
							{data.source}
						</a>
					</fieldset>
					}

				</div>
			</div>

			<div className="md:col-span-2 md:grid sm:flex-col gap-2 pt-4">


			<fieldset className="col-start-1 flex-col justify-between items-start border rounded-2xl p-5  ">
				<legend>Ingredients</legend>

				{ingredients.map((item, index) =>
					<div key={index} className="py-2 border-b border-white/10">
						<label className=" hover:cursor-pointer gap-3 flex items-center whitespace-nowrap">
							<input type="checkbox"/>
							  <p className="font-bold">{item.quantity.imperial.amount} {item.quantity.imperial.unit}</p>  {item.name}
						</label>
					</div>
				)}
			</fieldset>

			<fieldset className="col-start-2 flex-col justify-between items-start border rounded-2xl p-5  ">
				<legend>Instructions</legend>
				{instructions.map((item, index) =>
					<div key={index} className="py-1.5 border-b border-white/10 flex">
						<p className="font-bold mr-2">{item.step})</p>{item.text}
					</div>

				)}

			</fieldset>
				</div>
		</main>
	);
}
