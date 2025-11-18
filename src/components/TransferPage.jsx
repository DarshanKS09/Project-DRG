import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import tokenABI from '../abi/TokenABI.json'
import { TOKEN_ADDRESS, BSC_RPC } from '../utils/constants'

export default function TransferPage(){
  const { address } = useAccount()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')

  async function send(){
    if(!window.ethereum) return alert('Please install MetaMask')
    if(!to || !amount) return alert('Enter receiver and amount')

    try{
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, signer)
      const decimals = await token.decimals().catch(()=>18)
      const value = ethers.parseUnits(amount, decimals)
      const tx = await token.transfer(to, value)
      setStatus('Transaction sent: '+tx.hash)
      await tx.wait()
      setStatus('Transaction confirmed: '+tx.hash)
    }catch(err){
      console.error(err)
      setStatus('Error: '+(err.message||err))
    }
  }

  return (
    <div className="card">
      <h3>Transfer DRg</h3>
      <div className="small">From: {address || 'Please connect wallet'}</div>

      <div style={{marginTop:12}}>
        <label className="small">Receiver address</label>
        <input className="input" value={to} onChange={e=>setTo(e.target.value)} placeholder="0x..." />
      </div>

      <div style={{marginTop:12}}>
        <label className="small">Amount (DRg)</label>
        <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="1000" />
      </div>

      <div style={{marginTop:12}}>
        <button className="button" onClick={send}>Send</button>
      </div>

      <div style={{marginTop:12}} className="small">{status}</div>
    </div>
  )
}