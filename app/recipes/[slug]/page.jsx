import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// ── Stat Chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value }) {
	return (
		<div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 min-w-[80px]">
			<span className="text-xs uppercase tracking-widest text-gray-400 mb-0.5">
				{label}
			</span>
			<span className="text-sm font-semibold text-white">{value}</span>
		</div>
	);
}

// ── Recipe Info ───────────────────────────────────────────────────────────────
function RecipeInfo({ recipe }) {
	return (
		<div className="w-full mb-10">
			<h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
				{recipe.name}
			</h1>
			<p className="text-gray-400 text-base md:text-lg mb-6 max-w-2xl leading-relaxed">
				{recipe.description}
			</p>
			<div className="flex flex-wrap gap-3">
				{recipe.average_time && (
					<StatChip label="Time" value={`${recipe.average_time} min`} />
				)}
				{recipe.servings && (
					<StatChip label="Servings" value={recipe.servings} />
				)}
				{recipe.difficulty && (
					<StatChip label="Difficulty" value={recipe.difficulty} />
				)}
				{recipe.source && <StatChip label="Source" value={recipe.source} />}
			</div>
		</div>
	);
}

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

// ── Ingredients List ──────────────────────────────────────────────────────────
function IngredientsList({ ingredients, unit }) {
	return (
		<ul className="flex flex-col gap-2">
			{ingredients.map((ingredient, index) => {
				const q = ingredient.quantity[unit];
				const displayUnit = q.unit ? `${q.unit} ` : "";
				return (
					<li
						key={index}
						className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
					>
						<label className="flex items-start gap-3 cursor-pointer w-full">
							<input
								type="checkbox"
								className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-amber-400 cursor-pointer shrink-0"
							/>
							<span className="text-gray-300 text-sm leading-snug">
								<span className="font-semibold text-white">
									{q.amount} {displayUnit}
								</span>
								{ingredient.name}
							</span>
						</label>
					</li>
				);
			})}
		</ul>
	);
}

// ── Instructions List ─────────────────────────────────────────────────────────
function InstructionsList({ instructions }) {
	return (
		<ol className="flex flex-col gap-4">
			{instructions.map((instruction) => (
				<li key={instruction.step} className="flex gap-4">
					<div className="shrink-0 w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
						<span className="text-amber-400 text-sm font-bold">
							{instruction.step}
						</span>
					</div>
					<div className="pt-1 pb-4 border-b border-white/5 flex-1 last:border-0">
						<p className="text-gray-300 text-sm leading-relaxed">
							{instruction.text}
						</p>
					</div>
				</li>
			))}
		</ol>
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

	// Default unit — swap to "metric" if you want metric as default
	const unit = "imperial";

	return (
		<main className="body w-full min-h-screen py-20 px-4 md:px-8 max-w-5xl mx-auto">
			{/* Recipe header info */}
			<RecipeInfo recipe={data} />
			{/* Two column layout — stacks on mobile */}
			<div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
				{/* Ingredients — sticky on desktop */}
				<aside className="md:sticky md:top-8 md:self-start rounded-2xl bg-white/5 border border-white/10 p-5">
					<h2 className="text-lg font-semibold text-white mb-1">Ingredients</h2>
					<p className="text-xs text-gray-500 mb-4">
						Tap to check off as you go
					</p>
					<IngredientsList ingredients={ingredients} unit={unit} />
				</aside>

				{/* Steps */}
				<section className="rounded-2xl bg-white/5 border border-white/10 p-5">
					<h2 className="text-lg font-semibold text-white mb-5">
						Instructions
					</h2>
					<InstructionsList instructions={instructions} />
				</section>
			</div>
		</main>
	);
}
