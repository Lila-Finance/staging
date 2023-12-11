import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Market from "./pages/Market.jsx";
import Docs from "./pages/Docs.jsx";
import Portfolio from "./pages/Portfolio.jsx";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  arbitrum,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [arbitrum],
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/market",
    element: <Market />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/docs",
    element: <Docs />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
