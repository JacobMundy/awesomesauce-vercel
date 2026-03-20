"use client";
import { deleteRecipe } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteRecipeButton({ slug, name }) {
	const router = useRouter();
	const [confirming, setConfirming] = useState(false);

	async function handleDelete() {
		if (!confirming) {
			setConfirming(true);
			setTimeout(() => setConfirming(false), 3000);
			return;
		}
		await deleteRecipe(slug);
		router.refresh();
	}

	return (
		<button
			onClick={handleDelete}
			className={`text-xs border rounded-lg px-3 py-1.5 transition-all ${
				confirming
					? "text-red-500 border-red-500/40 hover:border-red-500/60"
					: "opacity-40 hover:opacity-100 hover:text-red-500 border-foreground/10 hover:border-red-500/20"
			}`}
		>
			{confirming ? "Sure?" : "Delete"}
		</button>
	);
}
