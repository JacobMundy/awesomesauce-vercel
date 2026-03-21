import Link from "next/link";
import AdminTestLayout from "@/components/admin/AdminTestLayout";
import {
	insertTestRecipe,
	clearTestData,
	revalidateRecipes,
} from "./db-test-actions";
export default function DbTestPage() {
	return (
		<AdminTestLayout
			title="Database"
			previewPath="/recipes"
			actions={[
				{
					label: "Insert test recipe",
					action: insertTestRecipe,
					variant: "success",
				},
				{
					label: "Revalidate /recipes",
					action: revalidateRecipes,
					variant: "default",
				},
				{ label: "Clear test data", action: clearTestData, variant: "danger" },
			]}
		/>
	);
}
