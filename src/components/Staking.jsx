import React, { useState } from "react";
import "../App.css";

export default function Staking() {
  const APR = 10; // 10% APR
  const [stakeAmount, setStakeAmount] = useState("");
  const [duration, setDuration] = useState(12); // months
  const [result, setResult] = useState(null);

  function calculateStaking() {
    const amount = Number(stakeAmount);
    if (!amount || amount <= 0) return;

    const years = duration / 12;
    const reward = amount * (APR / 100) * years;

    setResult({
      stake: amount,
      reward,
      total: amount + reward,
    });
  }

  return (
    <div className="card">
      <h2>DRG Staking</h2>

      <div className="small">APR: <b>{APR}%</b></div>

      <div style={{ marginTop: 16 }}>
        <label className="small">Amount to Stake (DRG)</label>
        <input
          className="input"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Enter DRG amount"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="small">Duration (Months)</label>
        <select
          className="input"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
          <option value="24">24 Months</option>
        </select>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="button" onClick={calculateStaking}>
          Calculate Rewards
        </button>
      </div>

      {result && (
        <div className="balance-box" style={{ marginTop: 20 }}>
          <div><b>Staking Summary</b></div>
          <div className="small">Staked: {result.stake} DRG</div>
          <div className="small">Reward: {result.reward} DRG</div>
          <div className="small">Total After Staking: {result.total} DRG</div>
        </div>
      )}
    </div>
  );
}
