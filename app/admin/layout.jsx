import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect("/admin-login");
	if (user.user_metadata?.provider_id !== process.env.ADMIN_GITHUB_ID)
		redirect("/");

	return <>{children}</>;
}
