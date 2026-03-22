"use client";
import { useState } from "react";
import Link from "next/link";

// ─── Test Controls ────────────────────────────────────────────────────────────
// Pass an array of { label, action, variant } objects
// variant: "default" | "danger" | "success"
export function TestControls({ title = "Test Controls", actions = [] }) {
	const [loading, setLoading] = useState(null);
	const [results, setResults] = useState([]);

	const run = async (action, label, i) => {
		setLoading(i);
		try {
			await action();
			setResults((prev) => [
				{ label, ok: true, time: new Date().toLocaleTimeString() },
				...prev.slice(0, 9),
			]);
		} catch (e) {
			setResults((prev) => [
				{
					label,
					ok: false,
					msg: e.message,
					time: new Date().toLocaleTimeString(),
				},
				...prev.slice(0, 9),
			]);
		} finally {
			setLoading(null);
		}
	};

	const variantClass = {
		default: "hover:text-blue-400 hover:border-blue-400/30",
		danger: "hover:text-red-400  hover:border-red-400/30",
		success: "hover:text-green-400 hover:border-green-400/30",
	};

	return (
		<div className="flex flex-col gap-3 h-full">
			<p className="text-xs font-medium opacity-50 uppercase tracking-widest">
				{title}
			</p>
			<div className="flex flex-wrap gap-2">
				{actions.map((a, i) => (
					<button
						key={i}
						disabled={loading === i}
						onClick={() => run(a.action, a.label, i)}
						className={`text-xs border rounded-lg px-3 py-1.5 transition-all opacity-60 hover:opacity-100 border-foreground/10 disabled:opacity-20 ${variantClass[a.variant ?? "default"]}`}
					>
						{loading === i ? "..." : a.label}
					</button>
				))}
			</div>

			{/* Result log */}
			{results.length > 0 && (
				<div className="mt-auto flex flex-col gap-1 border border-foreground/10 rounded-lg p-3 max-h-40 overflow-y-auto">
					{results.map((r, i) => (
						<p key={i} className="text-xs font-mono">
							<span className={r.ok ? "text-green-500" : "text-red-500"}>
								{r.ok ? "✓" : "✗"}
							</span>{" "}
							<span className="opacity-40">{r.time}</span> {r.label}
							{r.msg && <span className="opacity-40"> — {r.msg}</span>}
						</p>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Preview Frame ────────────────────────────────────────────────────────────
export function PreviewFrame({ defaultPath = "/" }) {
	const [path, setPath] = useState(defaultPath);
	const [input, setInput] = useState(defaultPath);
	const [key, setKey] = useState(0); // increment to force iframe reload

	const navigate = () => {
		setPath(input);
		setKey((k) => k + 1);
	};
	const refresh = () => setKey((k) => k + 1);

	return (
		<div className="flex flex-col gap-2 h-full min-h-0">
			<p className="text-xs font-medium opacity-50 uppercase tracking-widest">
				Preview
			</p>
			<div className="flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && navigate()}
					className="flex-1 text-xs bg-foreground/5 border border-foreground/10 rounded-lg px-3 py-1.5 font-mono outline-none focus:border-foreground/30"
					placeholder="/path"
				/>
				<button
					onClick={navigate}
					className="text-xs border border-foreground/10 rounded-lg px-3 py-1.5 hover:opacity-100 opacity-60 transition-all hover:text-blue-400 hover:border-blue-400/30"
				>
					Go
				</button>
				<button
					onClick={refresh}
					className="text-xs border border-foreground/10 rounded-lg px-3 py-1.5 hover:opacity-100 opacity-60 transition-all"
				>
					↺
				</button>
			</div>
			<div
				className="flex-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 overflow-auto resize-y min-h-64"
				style={{ height: "600px" }}
			>
				<iframe key={key} src={path} className="w-full h-full" />
			</div>
		</div>
	);
}

export function BackToAdminButton() {
	return (
		<Link
			href="/admin"
			className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest"
		>
			← Back to Admin
		</Link>
	);
}

export function BackToSiteButton() {
	return (
		<Link
			href="/"
			className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest"
		>
			← Back to site
		</Link>
	);
}

// ─── Full Layout ──────────────────────────────────────────────────────────────
// Drop-in wrapper that combines all three zones
export default function AdminTestLayout({
	title,
	actions = [],
	previewPath = "/",
}) {
	return (
		<div className="flex flex-col gap-6 p-6 min-h-screen">
			{title && <h1 className="text-2xl font-semibold">{title}</h1>}
			<div className="grid grid-cols-2 gap-4 flex-1">
				<div className="border border-foreground/10 rounded-xl p-4 flex flex-col">
					<TestControls title="DB Controls" actions={actions} />
				</div>
				<div className="border border-foreground/10 rounded-xl p-4 flex flex-col">
					<PreviewFrame defaultPath={previewPath} />
				</div>
			</div>
			<div className="flex justify-between">
				<BackToAdminButton />
				<BackToSiteButton />
			</div>
		</div>
	);
}
