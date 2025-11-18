import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import tokenABI from '../abi/TokenABI.json'
import { TOKEN_ADDRESS, WBNB_ADDRESS, PANCAKE_ROUTER, BSC_RPC } from '../utils/constants'

export default function TokenBalance({ userAddress }){
  const [balance, setBalance] = useState(null)
  const [decimals, setDecimals] = useState(18)
  const [priceInBnb, setPriceInBnb] = useState(null)
  const [priceUsd, setPriceUsd] = useState(null)

  useEffect(()=>{
    if(!userAddress) return
    const provider = new ethers.JsonRpcProvider(BSC_RPC)
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider)

    async function load(){
      try{
        const raw = await token.balanceOf(userAddress)
        const d = await token.decimals().catch(()=>18)
        setDecimals(d)
        const human = Number(ethers.formatUnits(raw, d))
        setBalance(human)

        // get price in BNB via PancakeRouter getAmountsOut: amountIn = 1 token -> amountOut BNB
        const router = new ethers.Contract(PANCAKE_ROUTER, [
          'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)'
        ], provider)

        // compute price: token -> WBNB. pass 1 * 10^decimals
        const amountIn = ethers.parseUnits('1', d)
        const path = [TOKEN_ADDRESS, WBNB_ADDRESS]
        const amounts = await router.getAmountsOut(amountIn, path).catch(()=>null)
        if(amounts && amounts.length>1){
          const bnbAmount = Number(ethers.formatUnits(amounts[1], 18))
          setPriceInBnb(bnbAmount)

          // fetch BNB price in USD from CoinGecko
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd')
          const json = await res.json()
          const bnbUsd = json?.binancecoin?.usd || 0
          setPriceUsd(bnbUsd * bnbAmount)
        }
      }catch(err){
        console.error(err)
      }
    }

    load()
  }, [userAddress])

  return (
    <div>
      <h4>Token</h4>
      <div className="small">Contract: <code style={{color:'#cbd5e1'}}>{TOKEN_ADDRESS}</code></div>
      <div style={{marginTop:12}}>
        <div className="small">Balance:</div>
        <div style={{fontSize:20,fontWeight:700}}>{balance===null? 'Loading...' : `${balance.toLocaleString()} DRg`}</div>
      </div>

      <div style={{marginTop:12}}>
        <div className="small">Estimated Price:</div>
        <div>{priceInBnb===null ? '—' : `${priceInBnb} BNB (${priceUsd ? ('$'+priceUsd.toFixed(6)) : 'Fetching USD...'})`}</div>
      </div>

      <div style={{marginTop:8}} className="small">Note: Price comes from PancakeSwap pair and CoinGecko BNB price.</div>
    </div>
  )
}