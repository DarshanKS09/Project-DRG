import { useConnect } from "wagmi";

export default function ConnectButton() {
  const { connect, connectors } = useConnect();

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="button"
    >
      Connect MetaMask
    </button>
  );
}
