"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
	const router = useRouter();

	async function handleSignOut() {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/admin-login");
	}

	return (
		<button
			onClick={handleSignOut}
			className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-red-500 border border-foreground/10 hover:border-red-500/30 rounded-lg px-3 py-2 transition-all duration-200"
		>
			Sign out
		</button>
	);
}
