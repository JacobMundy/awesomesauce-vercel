"use client";
import { useState } from "react";
import Link from "next/link";
import { runAllSecurityTests } from "./security-test-actions";

export default function SecurityTestPage() {
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(false);
	const [expanded, setExpanded] = useState({});

	async function handleRunTests() {
		setLoading(true);
		setResults(null);
		setExpanded({});
		try {
			const data = await runAllSecurityTests();
			setResults(data);
		} catch (e) {
			setResults({ error: e.message });
		} finally {
			setLoading(false);
		}
	}

	function toggleExpand(i) {
		setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
	}

	return (
		<div className="flex flex-col gap-6 p-6 min-h-screen">
			{/* Header */}
			<div>
				<Link
					href="/admin"
					className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest block mb-4"
				>
					← Admin
				</Link>
				<h1 className="text-2xl font-semibold">Security Tests</h1>
			</div>

			{/* Controls + Results — matches test-db layout */}
			<div className="border border-foreground/10 rounded-xl p-4 flex flex-col gap-3 flex-1">
				<p className="text-xs font-medium opacity-50 uppercase tracking-widest">
					Auth Guard Tests
				</p>

				{/* Run Button */}
				<div className="flex flex-wrap gap-2">
					<button
						disabled={loading}
						onClick={handleRunTests}
						className="text-xs border rounded-lg px-3 py-1.5 transition-all opacity-60 hover:opacity-100 border-foreground/10 disabled:opacity-20 hover:text-blue-400 hover:border-blue-400/30"
					>
						{loading ? "..." : "Run all tests"}
					</button>
				</div>

				{/* Summary */}
				{results && !results.error && (
					<div className="flex gap-2 mt-1">
						<span className="text-xs font-mono text-green-500">
							{results.passed} passed
						</span>
						{results.failed > 0 && (
							<span className="text-xs font-mono text-red-500">
								{results.failed} failed
							</span>
						)}
						<span className="text-xs font-mono opacity-40">
							/ {results.total} total
						</span>
					</div>
				)}

				{/* Result Log */}
				{results && !results.error && (
					<div className="mt-auto flex flex-col gap-0.5 border border-foreground/10 rounded-lg p-3 max-h-[600px] overflow-y-auto">
						{results.results.map((r, i) => (
							<div key={i} className="flex flex-col">
								{/* Summary row — clickable */}
								<button
									onClick={() => toggleExpand(i)}
									className="flex items-start gap-2 text-left w-full hover:bg-foreground/5 rounded px-1 py-0.5 transition-colors"
								>
									<span
										className={`shrink-0 font-mono text-xs ${
											r.passed ? "text-green-500" : "text-red-500"
										}`}
									>
										{r.passed ? "✓" : "✗"}
									</span>
									<span className="text-xs font-mono opacity-40 shrink-0">
										{r.time}
									</span>
									<span className="text-xs font-mono flex-1">{r.label}</span>
									<span className="text-xs opacity-30 shrink-0">
										{expanded[i] ? "▼" : "▶"}
									</span>
								</button>

								{/* Expanded detail */}
								{expanded[i] && (
									<div className="ml-6 mb-2 mt-1 flex flex-col gap-1.5 border-l-2 border-foreground/10 pl-3">
										{/* Message */}
										<p className="text-xs font-mono opacity-60">{r.message}</p>

										{/* Sent */}
										{r.sent && (
											<div>
												<p className="text-[10px] font-mono uppercase tracking-widest opacity-30 mb-0.5">
													sent
												</p>
												<pre className="text-xs font-mono bg-foreground/5 rounded-md px-2.5 py-1.5 overflow-x-auto whitespace-pre-wrap opacity-70">
													{JSON.stringify(r.sent, null, 2)}
												</pre>
											</div>
										)}

										{/* Received */}
										{r.received && (
											<div>
												<p className="text-[10px] font-mono uppercase tracking-widest opacity-30 mb-0.5">
													received
												</p>
												<pre
													className={`text-xs font-mono rounded-md px-2.5 py-1.5 overflow-x-auto whitespace-pre-wrap ${
														r.passed
															? "bg-green-500/5 text-green-400/80"
															: "bg-red-500/5 text-red-400/80"
													}`}
												>
													{JSON.stringify(r.received, null, 2)}
												</pre>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{/* Error */}
				{results?.error && (
					<p className="text-xs font-mono text-red-500">
						✗ Test runner error — {results.error}
					</p>
				)}
			</div>

			{/* Footer */}
			<div className="flex justify-between">
				<Link
					href="/admin"
					className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest"
				>
					← Back to Admin
				</Link>
				<Link
					href="/"
					className="text-xs opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest"
				>
					← Back to site
				</Link>
			</div>
		</div>
	);
}
