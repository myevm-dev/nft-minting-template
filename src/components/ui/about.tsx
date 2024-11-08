
export default function About() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">
					<a href="https://pooltogether.com" target="_blank" rel="noopener noreferrer">
						Powered By
					</a>
				</h3>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">
					<a href="https://docs.pooltogether.com/security/audits" target="_blank" rel="noopener noreferrer">
						Audits
					</a>
				</h3>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">
					<a href="https://x.com/pooltogether_" target="_blank" rel="noopener noreferrer">
						Follow Us
					</a>
				</h3>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">
					<a href="https://github.com/GenerationSoftware" target="_blank" rel="noopener noreferrer">
						Github
					</a>
				</h3>
			</div>
		</div>
	);
}

