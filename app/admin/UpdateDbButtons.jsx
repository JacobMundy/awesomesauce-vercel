"use client";
import { createClient } from "@/lib/supabase/server";
import { handleCompleteUpdate, handlePathUpdate } from "./action";

export default function UpdateDbButtons() {
	async function handleCompleteUpdate() {
		revalidatePath("/", "layout");
	}

	async function handlePathUpdate(path) {
		revalidatePath(path);
	}

	return (
		<div className="flex gap-4">
			<button
				onClick={handleCompleteUpdate}
				className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-green-500 border border-foreground/10 hover:border-green-500/30 rounded-lg px-3 py-2 transition-all duration-200"
			>
				Revalidate All
			</button>
			<button
				onClick={() => handlePathUpdate("/recipes")}
				className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-green-500 border border-foreground/10 hover:border-green-500/30 rounded-lg px-3 py-2 transition-all duration-200"
			>
				Revalidate Recipes
			</button>
		</div>
	);
}
