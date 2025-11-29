import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
  BSC_RPC,
  PANCAKE_FACTORY,
  WBNB_ADDRESS,
} from "../utils/constants";

/* ===== DEFAULT FALLBACK PRICE ===== */
const FALLBACK_PRICE = 0.00114; // $0.00114 per token

/* ===== PancakeSwap ABIs ===== */
const factoryABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

const pairABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)"
];

/* ===== Fetch price function ===== */
async function fetchTokenPriceUSD(tokenAddress) {
  if (!tokenAddress) return FALLBACK_PRICE;

  try {
    const provider = new ethers.JsonRpcProvider(BSC_RPC);

    const factory = new ethers.Contract(
      PANCAKE_FACTORY,
      factoryABI,
      provider
    );

    const pairAddress = await factory.getPair(
      tokenAddress,
      WBNB_ADDRESS
    );

    if (
      !pairAddress ||
      pairAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return FALLBACK_PRICE; // no pair → fallback
    }

    const pair = new ethers.Contract(pairAddress, pairABI, provider);

    const token0 = await pair.token0();
    const [r0, r1] = await pair.getReserves();

    let drgReserve, wbnbReserve;

    if (token0.toLowerCase() === tokenAddress.toLowerCase()) {
      drgReserve = Number(r0);
      wbnbReserve = Number(r1);
    } else {
      drgReserve = Number(r1);
      wbnbReserve = Number(r0);
    }

    if (drgReserve === 0 || wbnbReserve === 0) {
      return FALLBACK_PRICE;
    }

    const priceInBNB = wbnbReserve / drgReserve;

    // fetch live BNB price from Coingecko (optional)
    const bnbRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
    );
    const bnbJson = await bnbRes.json();

    const bnbUsd = bnbJson.binancecoin.usd || 600;

    return priceInBNB * bnbUsd;
  } catch (e) {
    console.error("PRICE FETCH ERROR:", e);
    return FALLBACK_PRICE; // any error → fallback
  }
}

/* ===== React Component ===== */
export default function TokenPricePancake({ tokenAddress }) {
  const { data: priceUSD } = useQuery({
    queryKey: ["drgPrice", tokenAddress],
    queryFn: () => fetchTokenPriceUSD(tokenAddress),
    staleTime: 30000,
  });

  return (
    <div className="small">
      <b>Price:</b>{" "}
      ${priceUSD ? priceUSD.toFixed(6) : FALLBACK_PRICE.toFixed(6)}
    </div>
  );
}
