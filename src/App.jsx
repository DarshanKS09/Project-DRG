import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./config/wallet";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import WalletPage from "./components/WalletPage";
import TransferPage from "./components/TransferPage";
import Staking from "./components/Staking";

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="/staking" element={<Staking />} />
      </Routes>
    </WagmiProvider>
  );
}

export default App;
