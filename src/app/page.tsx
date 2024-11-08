"use client";

import { NftMint } from "@/components/nft-mint";
import Dashboard from "@/components/ui/dashboard";
import About from "@/components/ui/about";
import Instructions from "@/components/ui/instructions";
import {
	defaultChainId,
	defaultNftContractAddress,
	defaultTokenId,
} from "@/lib/constants";
import { client } from "@/lib/thirdwebClient";
import { defineChain, getContract, toTokens } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import {
	getActiveClaimCondition as getActiveClaimCondition1155,
	getNFT,
	isERC1155,
} from "thirdweb/extensions/erc1155";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import {
	getActiveClaimCondition as getActiveClaimCondition721,
	isERC721,
} from "thirdweb/extensions/erc721";
import { getActiveClaimCondition as getActiveClaimCondition20 } from "thirdweb/extensions/erc20";
import { useReadContract } from "thirdweb/react";

export default function Home() {
	const tokenId = defaultTokenId;
	const chain = defineChain(defaultChainId);
	const contract = getContract({
		address: defaultNftContractAddress,
		chain,
		client,
	});
	const isERC721Query = useReadContract(isERC721, { contract });
	const isERC1155Query = useReadContract(isERC1155, { contract });
	const contractMetadataQuery = useReadContract(getContractMetadata, {
		contract,
	});

	const nftQuery = useReadContract(getNFT, {
		contract,
		tokenId,
		queryOptions: { enabled: isERC1155Query.data },
	});

	const claimCondition1155 = useReadContract(getActiveClaimCondition1155, {
		contract,
		tokenId,
		queryOptions: {
			enabled: isERC1155Query.data,
		},
	});

	const claimCondition721 = useReadContract(getActiveClaimCondition721, {
		contract,
		queryOptions: { enabled: isERC721Query.data },
	});

	const claimCondition20 = useReadContract(getActiveClaimCondition20, {
		contract,
		queryOptions: { enabled: !isERC721Query.data && !isERC1155Query.data },
	});

	const displayName = isERC1155Query.data
		? nftQuery.data?.metadata.name
		: contractMetadataQuery.data?.name;

	const description = isERC1155Query.data
		? nftQuery.data?.metadata.description
		: contractMetadataQuery.data?.description;

	const priceInWei = isERC1155Query.data
		? claimCondition1155.data?.pricePerToken
		: isERC721Query.data
			? claimCondition721.data?.pricePerToken
			: claimCondition20.data?.pricePerToken;

	const currency = isERC1155Query.data
		? claimCondition1155.data?.currency
		: isERC721Query.data
			? claimCondition721.data?.currency
			: claimCondition20.data?.currency;

	const currencyContract = getContract({
		address: currency || "",
		chain,
		client,
	});

	const currencyMetadata = useReadContract(getCurrencyMetadata, {
		contract: currencyContract,
		queryOptions: { enabled: !!currency },
	});

	const currencySymbol = currencyMetadata.data?.symbol || "";

	const pricePerToken =
		currencyMetadata.data && priceInWei !== null && priceInWei !== undefined
			? Number(toTokens(priceInWei, currencyMetadata.data.decimals))
			: null;

	return (
		<div className="container mx-auto p-4 md:p-6 min-h-screen bg-background">
			{/* Main responsive grid layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - NftMint Component */}
				<div className="lg:col-span-1 flex flex-col justify-center items-center">
					<NftMint
						contract={contract}
						displayName={displayName || ""}
						contractImage={contractMetadataQuery.data?.image || ""}
						description={description || ""}
						currencySymbol={currencySymbol}
						pricePerToken={pricePerToken}
						isERC1155={!!isERC1155Query.data}
						isERC721={!!isERC721Query.data}
						tokenId={tokenId}
					/>
				</div>

				{/* Right Column - Dashboard and Instructions */}
				<div className="lg:col-span-2 flex flex-col gap-4 mt-20">
					{/* Dashboard with limited height */}
					<div className="bg-gray-800 p-4 rounded-lg text-white shadow-md max-h-90 overflow-y-auto">
						<Dashboard />
					</div>

					{/* Instructions with limited height */}
					<div className="bg-gray-800 p-4 rounded-lg text-white shadow-md max-h-90 overflow-y-auto">
						<Instructions />
					</div>
					<div className="bg-gray-800 p-4 rounded-lg text-white shadow-md max-h-90 overflow-y-auto">
						<About />					
					</div>
				</div>
			</div>
		</div>
	);
}
