// components/admin/Section.js
export default function Section({ title, children }) {
	return (
		<div className="border rounded-lg p-4">
			<h2 className="text-sm font-medium mb-3">{title}</h2>
			{children}
		</div>
	);
}
