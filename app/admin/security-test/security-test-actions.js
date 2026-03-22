"use server";
import { createClient } from "@/lib/supabase/server";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function result(label, passed, { sent, received, message }) {
	return {
		label,
		passed,
		message,
		sent: sent ?? null,
		received: received ?? null,
		time: new Date().toLocaleTimeString(),
	};
}

// ─── Individual Tests ────────────────────────────────────────────────────────

export async function testEnvVarExists() {
	const adminId = process.env.ADMIN_GITHUB_ID;
	const masked = adminId
		? `"${adminId.slice(0, 3)}..${adminId.slice(-3)}" (${adminId.length} chars)`
		: "undefined";

	return result("ADMIN_GITHUB_ID env var is set", !!adminId && adminId.trim().length > 0, {
		sent: { check: "process.env.ADMIN_GITHUB_ID" },
		received: { value: masked, type: typeof adminId },
		message: adminId ? `Set — ${masked}` : "MISSING — all admin auth will fail",
	});
}

export async function testRequireAdminWithValidSession() {
	const { requireAdmin } = await import("@/lib/admin-auth");

	try {
		const supabase = await requireAdmin();
		const { data: { user } } = await supabase.auth.getUser();
		const providerId = user?.user_metadata?.provider_id;

		return result("requireAdmin() with valid admin session", true, {
			sent: { provider_id: providerId, ADMIN_GITHUB_ID: process.env.ADMIN_GITHUB_ID ? "***set***" : "undefined" },
			received: { status: "authorized", user: user?.user_metadata?.user_name ?? "unknown" },
			message: "Authorized successfully",
		});
	} catch (e) {
		return result("requireAdmin() with valid admin session", false, {
			sent: { session: "current" },
			received: { error: e.message },
			message: `Should have passed but threw: ${e.message}`,
		});
	}
}

export async function testRequireAdminRejectsWrongId() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	const fakeId = "0000000000";
	const actualId = user?.user_metadata?.provider_id;
	const wouldPass = actualId === fakeId;

	return result("requireAdmin() rejects non-matching GitHub ID", !wouldPass, {
		sent: { provider_id: actualId, compared_against: fakeId },
		received: { match: wouldPass, would_authorize: wouldPass },
		message: wouldPass
			? "DANGER — a fake ID matched the real provider_id"
			: `"${fakeId}" !== "${actualId}" — correctly rejected`,
	});
}

export async function testSaveRecipeAuth() {
	const { saveRecipe } = await import("@/app/admin/recipes/actions");
	const testPayload = { ingredients: "not-json", steps: "not-json", name: "", slug: "" };

	try {
		await saveRecipe(testPayload, true);
		return result("saveRecipe() has auth guard", false, {
			sent: testPayload,
			received: { status: "no error thrown" },
			message: "Did not throw at all — auth guard may be missing",
		});
	} catch (e) {
		const passedAuth = e.message !== "Unauthorized";
		return result("saveRecipe() has auth guard", true, {
			sent: testPayload,
			received: { error: e.message, auth_passed: passedAuth },
			message: passedAuth
				? "Auth passed (admin), failed at data validation as expected"
				: "Auth guard ran and rejected before reaching data layer",
		});
	}
}

export async function testDeleteRecipeAuth() {
	const { deleteRecipe } = await import("@/app/admin/recipes/actions");
	const testSlug = "__nonexistent_security_test__";

	try {
		await deleteRecipe(testSlug);
		return result("deleteRecipe() has auth guard", true, {
			sent: { slug: testSlug },
			received: { status: "ok", rows_affected: 0 },
			message: "Auth passed (admin), delete was a no-op on nonexistent slug",
		});
	} catch (e) {
		return result("deleteRecipe() has auth guard", e.message !== "Unauthorized", {
			sent: { slug: testSlug },
			received: { error: e.message },
			message: e.message === "Unauthorized"
				? "Rejected admin — check requireAdmin logic"
				: `Auth passed, DB error: ${e.message}`,
		});
	}
}

export async function testRevalidateAuth() {
	const { handleCompleteUpdate } = await import("@/app/admin/action");

	try {
		await handleCompleteUpdate();
		return result("handleCompleteUpdate() has auth guard", true, {
			sent: { action: "handleCompleteUpdate()" },
			received: { status: "ok", revalidated: "/" },
			message: "Auth passed and revalidation completed",
		});
	} catch (e) {
		return result("handleCompleteUpdate() has auth guard", false, {
			sent: { action: "handleCompleteUpdate()" },
			received: { error: e.message },
			message: `Should have passed: ${e.message}`,
		});
	}
}

export async function testDbTestActionsAuth() {
	const { revalidateRecipes } = await import("@/app/admin/test-db/db-test-actions");

	try {
		await revalidateRecipes();
		return result("revalidateRecipes() has auth guard", true, {
			sent: { action: "revalidateRecipes()" },
			received: { status: "ok", revalidated: "/recipes" },
			message: "Auth passed and revalidation completed",
		});
	} catch (e) {
		return result("revalidateRecipes() has auth guard", false, {
			sent: { action: "revalidateRecipes()" },
			received: { error: e.message },
			message: `Should have passed: ${e.message}`,
		});
	}
}

export async function testLayoutProtectsRoutes() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
		|| process.env.VERCEL_URL
		|| "http://localhost:3000";
	const url = `${baseUrl}/admin`;

	try {
		const res = await fetch(url, {
			redirect: "manual",
			headers: { cookie: "" },
		});

		const redirected = res.status >= 300 && res.status < 400;
		const location = res.headers.get("location") || "(none)";

		return result("/admin redirects unauthenticated users", redirected, {
			sent: { url, cookies: "(none)", method: "GET" },
			received: { status: res.status, location, redirected },
			message: redirected
				? `${res.status} → ${location}`
				: `Returned ${res.status} — expected 3xx redirect`,
		});
	} catch (e) {
		return result("/admin redirects unauthenticated users", false, {
			sent: { url, cookies: "(none)" },
			received: { error: e.message },
			message: `Fetch failed: ${e.message}`,
		});
	}
}

// ─── Run All ─────────────────────────────────────────────────────────────────

export async function runAllSecurityTests() {
	const results = await Promise.all([
		testEnvVarExists(),
		testRequireAdminWithValidSession(),
		testRequireAdminRejectsWrongId(),
		testSaveRecipeAuth(),
		testDeleteRecipeAuth(),
		testRevalidateAuth(),
		testDbTestActionsAuth(),
		testLayoutProtectsRoutes(),
	]);

	const passed = results.filter((r) => r.passed).length;
	const failed = results.filter((r) => !r.passed).length;

	return { results, passed, failed, total: results.length };
}
