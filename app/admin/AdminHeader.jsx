import { createClient } from "@/lib/supabase/server";

export default async function AdminHeader({
	title,
	backHref,
	backLabel,
	children,
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const username = user?.user_metadata?.user_name;

	return (
		<div className="flex items-start justify-between mb-10">
			<div>
				{backHref && (
					<a
						href={backHref}
						className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest block mb-4"
					>
						← {backLabel}
					</a>
				)}
				<h1 className="text-4xl md:text-5xl font-bold leading-tight">
					{title}
				</h1>
				<p className="text-sm mt-2 opacity-50">
					Logged in as{" "}
					<span className="opacity-100 font-medium">{username}</span>
				</p>
			</div>
			{children}
		</div>
	);
}
