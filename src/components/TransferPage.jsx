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

  // Ensure MetaMask is on BSC Mainnet (0x38). If missing, try to add it using BSC_RPC.
  async function ensureBSC() {
    if (!window.ethereum) {
      throw new Error('MetaMask (window.ethereum) not found')
    }

    const BSC_CHAIN_ID = '0x38' // 56

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      })
      return true
    } catch (switchError) {
      // If chain not added, try to add it
      if (switchError && switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: 'Binance Smart Chain',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: [BSC_RPC || 'https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          })
          // After adding, try switching again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_CHAIN_ID }],
          })
          return true
        } catch (addError) {
          console.error('Failed to add BSC to MetaMask:', addError)
          return false
        }
      } else {
        console.error('Failed to switch to BSC:', switchError)
        return false
      }
    }
  }

  async function send(){
    if(!window.ethereum) return alert('Please install MetaMask')
    if(!to || !amount) return alert('Enter receiver and amount')

    setStatus('Preparing transaction...')

    try{
      // 1) Ensure wallet is on BSC
      setStatus('Checking wallet network (Binance Smart Chain)...')
      const switched = await ensureBSC()
      if (!switched) {
        setStatus('Please switch to Binance Smart Chain in MetaMask and try again.')
        return
      }

      // 2) Create provider & signer AFTER network is set
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // 3) Create contract and prepare amount
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, signer)
      const decimals = await token.decimals().catch(() => 18)
      const value = ethers.parseUnits(amount, decimals)

      // 4) Send transfer
      setStatus('Sending transaction — MetaMask will prompt you now...')
      const tx = await token.transfer(to, value)
      setStatus('Transaction sent: ' + tx.hash)

      // 5) Wait for confirmation
      await tx.wait()
      setStatus('Transaction confirmed: ' + tx.hash)
    }catch(err){
      console.error(err)
      // Provide cleaner message when user rejects or network errors
      const msg = err?.data?.message || err?.message || String(err)
      setStatus('Error: ' + msg)
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
