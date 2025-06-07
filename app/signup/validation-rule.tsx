// Helper component for a single validation rule
const ValidationRule = ({
	isValid,
	text,
}: { isValid: boolean; text: string }) => {
	const colorClass = isValid ? "text-green-500" : "text-gray-400";
	return (
		<p className={`flex items-center text-xs transition-colors ${colorClass}`}>
			{isValid ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 mr-1.5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clipRule="evenodd"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 mr-1.5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
						clipRule="evenodd"
					/>
				</svg>
			)}
			{text}
		</p>
	);
};
export default ValidationRule;
