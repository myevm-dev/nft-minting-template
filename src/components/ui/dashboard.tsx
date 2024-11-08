// Dashboard Component
export default function Dashboard() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">Total owned tickets</h3>
				<p className="text-2xl">0</p>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">Total won</h3>
				<p className="text-2xl">0</p>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">Chances to win</h3>
				<p className="text-2xl">0%</p>
			</div>
			<div className="bg-gray-700 p-4 rounded-lg shadow-md text-white">
				<h3 className="text-lg font-semibold">Eth Price</h3>
				<p className="text-2xl">$0</p>
			</div>
		</div>
	);
}
