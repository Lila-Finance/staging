import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter, Route, Routes } from 'react-router-dom';
import Homepage from "./pages/Homepage.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Market from "./pages/Market.jsx";
import Faucet from "./pages/Faucet.jsx";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, optimism, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from 'wagmi/providers/alchemy';


const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        // arbitrum, 
        // optimism, 
        sepolia],
    [
        // alchemyProvider({ apiKey: 'Wj9xJWTAnxnob5ftBVI3OiQ-zuCZwNrG' }),
        // alchemyProvider({ apiKey: 'BArBGs7sg5JFmW52LayXKEZ1ftNtFdgj' }),
        alchemyProvider({ apiKey: '2s-1F2BiWb0o7mA2LieeKX4j46A0YhM3' }),
          publicProvider()]
  );
  const { connectors } = getDefaultWallets({
    appName: "Lila Finance",
    projectId: "c0027ae711b4888e46a4a700b7274a56",
    chains,
  });
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={sepolia} modalSize="compact">
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Homepage />} />
              <Route path="market" element={<Market />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="Faucet" element={<Faucet />} />
            </Route>
          </Routes>
        </HashRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
