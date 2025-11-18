import React, { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { TOKEN_ADDRESS } from '../utils/constants'
import TokenBalance from './TokenBalance'

export default function WalletPage(){
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{setMounted(true)}, [])

  return (
    <div className="card">
      {!isConnected ? (
        <div>
          <h3>Connect your MetaMask wallet</h3>
          <div style={{marginTop:12}}>
            {connectors.map((c) => (
              <button key={c.id} className="button" style={{marginRight:10}} onClick={() => connect({ connector: c })}>
                Connect {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Wallet</h3>
          <div className="small">Address: {address}</div>

          <div style={{marginTop:16}}>
            <TokenBalance userAddress={address} />
          </div>

          <div style={{marginTop:18}}>
            <a href="/transfer"><button className="button">Send / Transfer</button></a>
            <a href="https://pancakeswap.finance/swap?outputCurrency=" style={{marginLeft:12}}><button className="button">Swap (Pancake)</button></a>
          </div>
        </div>
      )}
    </div>
  )
}