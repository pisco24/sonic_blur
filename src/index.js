import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/css/style.css";

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { global } from "./config/global";

const WalletAvatar = () => {
  return <img
    src={global.TOKEN.logo}
    alt="avatar"
    width={128}
    height={128}
    style={{ borderRadius: 999 }}
  />;
};

const config = getDefaultConfig({
  appName: global.PROJECT,
  projectId: global.PROJECT_ID,
  chains: [
    global.chain,
  ],
  transports: {
    [global.chain.id]: http(),
  },
})

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={WalletAvatar}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);