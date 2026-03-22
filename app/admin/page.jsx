import Link from "next/link";
import SignOutButton from "./SignOutButton";
import UpdateDbButtons from "./UpdateDbButtons";
import AdminHeader from "./AdminHeader";

export default async function AdminDashboard() {
	const sections = [
		{
			href: "/admin/recipes",
			label: "Recipes",
			description: "Add, edit, or remove recipes",
		},
		{
			href: "/admin/images",
			label: "Images",
			description: "Upload images to storage",
			disabled: true,
		},
		{
			href: "/admin/test-db",
			label: "Test DB",
			description: "Test database reads, writes, and cache revalidation",
		},
		{
			href: "/admin/security-test",
			label: "Security",
			description: "Verify auth guards on routes and server actions",
		},
	];

	return (
		<main className="min-h-screen bg-background text-foreground px-4 py-16 md:px-8">
			<div className="max-w-3xl mx-auto">
				<AdminHeader title="Admin">
					<SignOutButton />
				</AdminHeader>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{sections.map((section) =>
						section.disabled ? (
							<div
								key={section.href}
								className="relative rounded-2xl border border-foreground/10 bg-foreground/5 p-6 opacity-40 cursor-not-allowed"
							>
								<span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest opacity-50 border border-foreground/20 rounded-full px-2 py-0.5">
									Soon
								</span>
								<div className="text-3xl mb-4">{section.label}</div>
								<p className="text-sm opacity-50">{section.description}</p>
							</div>
						) : (
							<Link
								key={section.href}
								href={section.href}
								className="group relative rounded-2xl border border-foreground/10 bg-foreground/5 p-6 hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-200"
							>
								<div className="text-3xl mb-4">{section.label}</div>
								<p className="text-sm opacity-50">{section.description}</p>
								<span className="absolute bottom-5 right-5 opacity-30 group-hover:opacity-70 transition-opacity text-lg">
									→
								</span>
							</Link>
						),
					)}
				</div>

				<div className="my-14 border-t border-foreground/10" />
				<UpdateDbButtons />
				<div className="mt-14">
					<Link
						href="/"
						className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest"
					>
						← Back to site
					</Link>
				</div>
			</div>
		</main>
	);
}
