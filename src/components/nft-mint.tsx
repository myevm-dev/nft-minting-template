"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import {
	ClaimButton,
	ConnectButton,
	MediaRenderer,
	NFT,
	useActiveAccount,
} from "thirdweb/react";
import { client } from "@/lib/thirdwebClient";
import React from "react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

type Props = {
	contract: ThirdwebContract;
	displayName: string;
	description: string;
	contractImage: string;
	pricePerToken: number | null;
	currencySymbol: string | null;
	isERC1155: boolean;
	isERC721: boolean;
	tokenId: bigint;
};

export function NftMint(props: Props) {
	const [isMinting, setIsMinting] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [ethPriceInUSD, setEthPriceInUSD] = useState<number | null>(null);
	const account = useActiveAccount();

	const decreaseQuantity = () => {
		setQuantity((prev) => Math.max(1, prev - 1));
	};

	const increaseQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!Number.isNaN(value)) {
			setQuantity(Math.min(Math.max(1, value)));
		}
	};

	// Fetch ETH price in USD from CoinGecko
	useEffect(() => {
		const fetchEthPrice = async () => {
			try {
				const response = await axios.get(
					"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
				);
				setEthPriceInUSD(response.data.ethereum.usd);
			} catch (error) {
				console.error("Error fetching ETH price:", error);
			}
		};

		fetchEthPrice();
		const interval = setInterval(fetchEthPrice, 60000); // Refresh every 1 minute
		return () => clearInterval(interval);
	}, []);

	// Calculate total price in ETH and USD
	const totalPriceInEth = props.pricePerToken ? props.pricePerToken * quantity : 0;
	const totalPriceInUSD = ethPriceInUSD ? (totalPriceInEth * ethPriceInUSD).toFixed(2) : "Loading...";

	if (props.pricePerToken === null || props.pricePerToken === undefined) {
		console.error("Invalid pricePerToken");
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
			<div className="absolute top-4 right-4">
				<ConnectButton client={client} />
			</div>
			<Card className="w-full max-w-md">
				<CardContent className="pt-6">
					<div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
						{props.isERC1155 ? (
							<NFT contract={props.contract} tokenId={props.tokenId}>
								<React.Suspense fallback={<Skeleton className="w-full h-full object-cover" />}>
									<NFT.Media className="w-full h-full object-cover" />
								</React.Suspense>
							</NFT>
						) : (
							<MediaRenderer
								client={client}
								className="w-full h-full object-cover"
								alt=""
								src={props.contractImage || "/placeholder.svg?height=400&width=400"}
							/>
						)}
						<div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm font-semibold">
							{props.pricePerToken} {props.currencySymbol}/each
						</div>
					</div>
					<p className="text-gray-600 dark:text-gray-300 mb-4">{props.description}</p>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center">
							<Button
								variant="outline"
								size="icon"
								onClick={decreaseQuantity}
								disabled={quantity <= 1}
								aria-label="Decrease quantity"
								className="rounded-r-none text-white"
							>
								<Minus className="h-4 w-4" />
							</Button>

							<Input
								type="number"
								value={quantity}
								onChange={handleQuantityChange}
								className="w-13 text-center rounded-none border-x-0 pl-6 text-white"
								min="1"
							/>

							<Button
								variant="outline"
								size="icon"
								onClick={increaseQuantity}
								aria-label="Increase quantity"
								className="rounded-l-none text-white"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div className="text-base pr-1 font-semibold dark:text-white">
						Total: {totalPriceInEth} {props.currencySymbol} 
						<br />
						≈ ${totalPriceInUSD}
					</div>
				</CardContent>
				<CardFooter>
					{account ? (
						<ClaimButton
							theme={"light"}
							contractAddress={props.contract.address}
							chain={props.contract.chain}
							client={props.contract.client}
							claimParams={
								props.isERC1155
									? {
											type: "ERC1155",
											tokenId: props.tokenId,
											quantity: BigInt(quantity),
											to: account.address,
										}
									: props.isERC721
									? {
											type: "ERC721",
											quantity: BigInt(quantity),
											to: account.address,
										}
									: {
											type: "ERC20",
											quantity: String(quantity),
											to: account.address,
										}
							}
							style={{
								backgroundColor: "black",
								color: "white",
								width: "100%",
							}}
							disabled={isMinting}
							onTransactionSent={() => toast.info("Minting NFT")}
							onTransactionConfirmed={() => toast.success("Minted successfully")}
							onError={(err) => toast.error(err.message)}
						>
							Buy {quantity} Ticket{quantity > 1 ? "s" : ""}
						</ClaimButton>
					) : (
						<ConnectButton client={client} connectButton={{ style: { width: "100%" } }} />
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
