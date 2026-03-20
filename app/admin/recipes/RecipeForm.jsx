"use client";
import { useState } from "react";
import { saveRecipe } from "./actions";

function slugify(str) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
}

const emptyIngredient = () => ({
	name: "",
	quantity: {
		imperial: { amount: "", unit: "" },
		metric: { amount: "", unit: "" },
	},
});

const emptyStep = (index) => ({ step: index + 1, text: "" });

export default function RecipeForm({ recipe }) {
	const isNew = !recipe;
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	const existingIngredients = recipe?.ingredients?.ingredients ?? [];
	const existingSteps = recipe?.steps?.steps ?? [];

	const [name, setName] = useState(recipe?.name ?? "");
	const [slug, setSlug] = useState(recipe?.slug ?? "");
	const [description, setDescription] = useState(recipe?.description ?? "");
	const [averageTime, setAverageTime] = useState(recipe?.average_time ?? "");
	const [source, setSource] = useState(recipe?.source ?? "");
	const [ingredients, setIngredients] = useState(
		existingIngredients.length > 0 ? existingIngredients : [emptyIngredient()],
	);
	const [steps, setSteps] = useState(
		existingSteps.length > 0 ? existingSteps : [emptyStep(0)],
	);

	function handleNameChange(val) {
		setName(val);
		if (isNew) setSlug(slugify(val));
	}

	function updateIngredient(index, path, value) {
		setIngredients((prev) => {
			const updated = JSON.parse(JSON.stringify(prev));
			const keys = path.split(".");
			let obj = updated[index];
			for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
			obj[keys[keys.length - 1]] = value;
			return updated;
		});
	}

	function addIngredient() {
		setIngredients((prev) => [...prev, emptyIngredient()]);
	}

	function removeIngredient(index) {
		setIngredients((prev) => prev.filter((_, i) => i !== index));
	}

	function updateStep(index, value) {
		setSteps((prev) =>
			prev.map((s, i) => (i === index ? { ...s, text: value } : s)),
		);
	}

	function addStep() {
		setSteps((prev) => [...prev, emptyStep(prev.length)]);
	}

	function removeStep(index) {
		setSteps((prev) =>
			prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, step: i + 1 })),
		);
	}

	async function handleSubmit() {
		setSaving(true);
		setError(null);
		try {
			await saveRecipe(
				{
					name,
					slug,
					description,
					average_time: averageTime,
					source,
					ingredients: JSON.stringify(ingredients),
					steps: JSON.stringify(steps),
					originalSlug: recipe?.slug,
				},
				isNew,
			);
		} catch (err) {
			setError(err.message);
			setSaving(false);
		}
	}

	const inputClass =
		"w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors";

	const labelClass =
		"block text-xs uppercase tracking-widest opacity-40 mb-1.5";

	return (
		<div className="flex flex-col gap-6">
			{/* Basic Info */}
			<section className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 md:p-6 flex flex-col gap-5">
				<h2 className="font-semibold text-sm uppercase tracking-widest opacity-60">
					Basic Info
				</h2>

				<div>
					<label className={labelClass}>Recipe Name</label>
					<input
						className={inputClass}
						value={name}
						onChange={(e) => handleNameChange(e.target.value)}
						placeholder="e.g. Chocolate Chip Cookies"
					/>
				</div>

				<div>
					<label className={labelClass}>Slug</label>
					<input
						className={inputClass}
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						placeholder="e.g. chocolate-chip-cookies"
					/>
					<p className="text-xs opacity-30 mt-1">
						Used in the URL — auto-generated from name
					</p>
				</div>

				<div>
					<label className={labelClass}>Description</label>
					<textarea
						className={`${inputClass} resize-none h-20`}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="A short description of the recipe"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className={labelClass}>Average Time (min)</label>
						<input
							type="number"
							className={inputClass}
							value={averageTime}
							onChange={(e) => setAverageTime(e.target.value)}
							placeholder="25"
						/>
					</div>
					<div>
						<label className={labelClass}>Source URL</label>
						<input
							className={inputClass}
							value={source}
							onChange={(e) => setSource(e.target.value)}
							placeholder="https://..."
						/>
					</div>
				</div>
			</section>

			{/* Ingredients */}
			<section className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 md:p-6 flex flex-col gap-4">
				<h2 className="font-semibold text-sm uppercase tracking-widest opacity-60">
					Ingredients
				</h2>

				{ingredients.map((ingredient, index) => (
					<div
						key={index}
						className="rounded-xl border border-foreground/5 bg-foreground/5 p-4 flex flex-col gap-3"
					>
						<div className="flex items-center justify-between">
							<span className="text-xs font-medium opacity-40 uppercase tracking-widest">
								#{index + 1}
							</span>
							{ingredients.length > 1 && (
								<button
									onClick={() => removeIngredient(index)}
									className="text-xs opacity-40 hover:text-red-500 hover:opacity-100 transition-all"
								>
									Remove
								</button>
							)}
						</div>

						<div>
							<label className={labelClass}>Ingredient Name</label>
							<input
								className={inputClass}
								value={ingredient.name}
								onChange={(e) =>
									updateIngredient(index, "name", e.target.value)
								}
								placeholder="e.g. all-purpose flour"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className={labelClass}>Imperial Amount</label>
								<input
									className={inputClass}
									value={ingredient.quantity.imperial.amount}
									onChange={(e) =>
										updateIngredient(
											index,
											"quantity.imperial.amount",
											e.target.value,
										)
									}
									placeholder="2"
								/>
							</div>
							<div>
								<label className={labelClass}>Imperial Unit</label>
								<input
									className={inputClass}
									value={ingredient.quantity.imperial.unit}
									onChange={(e) =>
										updateIngredient(
											index,
											"quantity.imperial.unit",
											e.target.value,
										)
									}
									placeholder="cups"
								/>
							</div>
							<div>
								<label className={labelClass}>Metric Amount</label>
								<input
									className={inputClass}
									value={ingredient.quantity.metric.amount}
									onChange={(e) =>
										updateIngredient(
											index,
											"quantity.metric.amount",
											e.target.value,
										)
									}
									placeholder="240"
								/>
							</div>
							<div>
								<label className={labelClass}>Metric Unit</label>
								<input
									className={inputClass}
									value={ingredient.quantity.metric.unit}
									onChange={(e) =>
										updateIngredient(
											index,
											"quantity.metric.unit",
											e.target.value,
										)
									}
									placeholder="grams"
								/>
							</div>
						</div>
					</div>
				))}

				<button
					onClick={addIngredient}
					className="w-full rounded-xl border border-dashed border-foreground/10 hover:border-foreground/30 opacity-50 hover:opacity-100 text-sm py-3 transition-all"
				>
					+ Add Ingredient
				</button>
			</section>

			{/* Steps */}
			<section className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 md:p-6 flex flex-col gap-4">
				<h2 className="font-semibold text-sm uppercase tracking-widest opacity-60">
					Steps
				</h2>

				{steps.map((step, index) => (
					<div key={index} className="flex gap-3">
						<div className="shrink-0 w-7 h-7 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center mt-2.5">
							<span className="text-xs font-bold opacity-60">{step.step}</span>
						</div>
						<div className="flex-1 flex flex-col gap-1">
							<textarea
								className={`${inputClass} resize-none h-20`}
								value={step.text}
								onChange={(e) => updateStep(index, e.target.value)}
								placeholder={`Step ${step.step} instructions...`}
							/>
							{steps.length > 1 && (
								<button
									onClick={() => removeStep(index)}
									className="text-xs opacity-40 hover:text-red-500 hover:opacity-100 transition-all self-end"
								>
									Remove
								</button>
							)}
						</div>
					</div>
				))}

				<button
					onClick={addStep}
					className="w-full rounded-xl border border-dashed border-foreground/10 hover:border-foreground/30 opacity-50 hover:opacity-100 text-sm py-3 transition-all"
				>
					+ Add Step
				</button>
			</section>

			{/* Error */}
			{error && (
				<div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-500 text-sm">
					{error}
				</div>
			)}

			{/* Save */}
			<button
				onClick={handleSubmit}
				disabled={saving}
				className="w-full bg-foreground text-background font-bold text-sm uppercase tracking-widest py-4 rounded-2xl hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
			>
				{saving ? "Saving..." : isNew ? "Create Recipe" : "Save Changes"}
			</button>
		</div>
	);
}
