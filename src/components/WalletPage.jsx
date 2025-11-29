import React from "react";
import { useAccount, useConnect } from "wagmi";
import TokenBalance from "./TokenBalance";
import TokenPricePancake from "./TokenPricePancake";
import { TOKEN_ADDRESS } from "../utils/constants";

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <div className="card">
      {!isConnected ? (
        <div>
          <h3>Connect your MetaMask wallet</h3>

          <button
            className="button"
            style={{ marginTop: 12 }}
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect MetaMask
          </button>
        </div>
      ) : (
        <div>
          <h3>Wallet</h3>
          <div className="small">Address: {address}</div>

          <div style={{ marginTop: 16 }}>
            <TokenBalance userAddress={address} />
          </div>

          {/* Price under balance */}
          <div style={{ marginTop: 8 }}>
            <TokenPricePancake tokenAddress={TOKEN_ADDRESS} />
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: "12px" }}>
            <a href="/transfer">
              <button className="button">Send / Transfer</button>
            </a>

            <a href="https://pancakeswap.finance/swap">
              <button className="button">Swap</button>
            </a>

            {/* ⭐ NEW: Stake Button */}
            <a href="/staking">
              <button className="button">Stake</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
