import { middleware } from "@/lib/supabase/middleware";

export { middleware };

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
