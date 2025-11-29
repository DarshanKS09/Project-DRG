import React from 'react'
import { useNavigate } from "react-router-dom";
import { TOKEN_NAME, TOKEN_SYMBOL } from '../utils/constants'
import ChatWidget from "./ChatWidget";

export default function Home() {
  const nav = useNavigate();

  return (
    <>
      <div className="card">
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <div className="logo">{TOKEN_SYMBOL}</div>
          <div>
            <h1 style={{ margin:0 }}>
              {TOKEN_NAME} <span className="small">({TOKEN_SYMBOL})</span>
            </h1>
            <p className="small">
              Decentralized token on BSC. Use this interface to view balance, transfer tokens and swap on PancakeSwap.
            </p>
            <div style={{ marginTop:12 }}>
              <button className="button" onClick={() => nav('/wallet')}>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>

        <hr style={{ margin:'18px 0', borderColor:'rgba(255,255,255,0.04)' }} />

        <div className="small">
          Token Contract: 
          <code style={{ color:'#cbd5e1' }}>
            {import.meta.env.VITE_TOKEN_ADDRESS}
          </code>
        </div>
      </div>

      {/* ADD CHATBOT HERE */}
      <ChatWidget />
    </>
  )
}
