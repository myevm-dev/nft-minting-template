import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
	const [ethPrice, setEthPrice] = useState<number | null>(null); // Explicitly type ethPrice

	useEffect(() => {
		const fetchEthPrice = async () => {
			try {
				const response = await axios.get(
					"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
				);
				setEthPrice(response.data.ethereum.usd);
			} catch (error) {
				console.error("Error fetching ETH price:", error);
			}
		};

		fetchEthPrice();

		// Optional: Fetch the price every minute
		const interval = setInterval(fetchEthPrice, 60000); // 60000ms = 1 minute
		return () => clearInterval(interval);
	}, []);

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
				<p className="text-2xl">
					{ethPrice !== null ? `$${ethPrice.toLocaleString()}` : "Loading..."}
				</p>
			</div>
		</div>
	);
}
