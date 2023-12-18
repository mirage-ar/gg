"use client";

import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const Wallet: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const { wallets } = useWallets();
  const router = useRouter();
  console.log(wallets);

  // TODO: switch to embeded wallet only
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

  // const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "metamask");

  useEffect(() => {
    const checkBalance = async () => {
      if (embeddedWallet) {
        try {
          const provider = await embeddedWallet.getEthersProvider();
          // const balance = await (await provider.getBalance(embeddedWallet.address)).toString();
          const balance = "0.1"

          const ethFormattedBalance = (Number(balance) / 1000000000000000000).toFixed(2);

          setWalletBalance(ethFormattedBalance);

          if (balance.toString() !== "0") {
            router.push("/hunt");
          }

          console.log("Wallet balance:", ethFormattedBalance);
        } catch (error) {
          console.error("Error getting balance:", error);
        }
      }
    };

    checkBalance();
  }, [embeddedWallet, router]);

  return (
    <main>
      <h1>Wallet</h1>
      {walletBalance !== "0" ? (
        <div>
          <p>Your wallet is funded, continue to hunt.</p>
          <button onClick={() => router.push("/hunt")}>Hunt</button>
        </div>
      ) : (
        <div>
          <p>Your wallet is not funded, please fund your wallet.</p>
          <button onClick={() => router.push("/hunt")}>Hunt</button>
        </div>
      )}
      <div>
        <p>Wallet Balance: {walletBalance} Ξ</p>
      </div>
    </main>
  );
};

export default Wallet;
