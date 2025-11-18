import React from 'react'
import Home from './components/Home'
import WalletPage from './components/WalletPage'
import TransferPage from './components/TransferPage'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './config/wallet'

export default function App(){
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="container">
        <header className="header">
          <h2>{import.meta.env.VITE_TOKEN_NAME} ({import.meta.env.VITE_TOKEN_SYMBOL})</h2>
          <nav>
            <Link to="/" className="small" style={{marginRight:12}}>Home</Link>
            <Link to="/wallet" className="small">Wallet</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transfer" element={<TransferPage />} />
        </Routes>
      </div>
    </WagmiConfig>
  )
}