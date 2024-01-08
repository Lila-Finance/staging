import { createRoot } from 'react-dom/client';
import React from "react";
import { HashRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from "./App.jsx";
import "./index.css";
import Market from "./pages/Market.jsx";
import Faucet from "./pages/Faucet.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import { MarketDataProvider } from "../src/constants/MarketDataProvider";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  arbitrum,
  sepolia,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { ExchangeRateProvider } from "./helpers/Converter.jsx";

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: '2s-1F2BiWb0o7mA2LieeKX4j46A0YhM3' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Lila Finance',
  projectId: 'c0027ae711b4888e46a4a700b7274a56',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

createRoot(document.getElementById("root")).render(  
    <React.StrictMode>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} modalSize="compact">
        <ExchangeRateProvider>  
          <MarketDataProvider>
            <HashRouter>
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/faucet" element={<Faucet />} />
                </Routes>
              </HashRouter>
          </MarketDataProvider>
          </ExchangeRateProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>
);
