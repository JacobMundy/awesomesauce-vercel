"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
	async function signInWithGitHub() {
		const supabase = createClient();
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	}

	return (
		<main className="body w-full min-h-screen flex items-center justify-center">
			<button onClick={signInWithGitHub}>Sign in with GitHub</button>
		</main>
	);
}
