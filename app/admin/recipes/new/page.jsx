import Link from "next/link";
import RecipeForm from "../RecipeForm";
import AdminHeader from "../../AdminHeader";

export default async function NewRecipePage() {
	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="w-full mx-auto">
				<AdminHeader
					title="Add Recipe"
					backHref="/admin/recipes"
					backLabel="Recipes"
				/>
				<RecipeForm />
			</div>
		</main>
	);
}
