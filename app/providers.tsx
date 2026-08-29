'use client'

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  rabbyWallet,
  coinbaseWallet,
  trustWallet,
  phantomWallet,
  okxWallet
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { monadTestnet, monad } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended Browser Wallets',
      wallets: [
        metaMaskWallet, 
        rabbyWallet, 
        coinbaseWallet, 
        trustWallet, 
        phantomWallet, 
        okxWallet
      ],
    },
  ],
  { appName: 'Oraclos', projectId: '1f91b7d4c82c3f8f118d0426b6ef0e1e' }
);

const config = createConfig({
  chains: [monadTestnet, monad],
  connectors,
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
    [monad.id]: http('https://rpc.monad.xyz'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
