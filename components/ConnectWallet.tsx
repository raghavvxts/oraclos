"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";

export function ConnectWallet() {
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal} 
                    type="button" 
                    className="bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.26 6.55L14.47 1.84C14.05 1.5 13.56 1.33 13.06 1.33C12.56 1.33 12.07 1.5 11.66 1.84L5.87 6.55C5.07 7.2 4.67 8.24 4.81 9.27L6.2 19.34C6.42 20.93 7.78 22.13 9.38 22.13H16.74C18.34 22.13 19.7 20.93 19.92 19.34L21.31 9.27C21.45 8.24 21.05 7.2 20.26 6.55ZM13.06 2.76L18.85 7.47C19.32 7.85 19.55 8.47 19.46 9.08L18.07 19.15C17.94 20.09 17.13 20.81 16.18 20.81H9.94C8.99 20.81 8.18 20.09 8.05 19.15L6.66 9.08C6.57 8.47 6.8 7.85 7.27 7.47L13.06 2.76Z" fill="currentColor"/>
                      <path d="M12.9997 10C10.7997 10 8.99969 11.79 8.99969 14C8.99969 16.21 10.7997 18 12.9997 18C15.1997 18 16.9997 16.21 16.9997 14C16.9997 11.79 15.1997 10 12.9997 10ZM12.9997 16.5C11.6197 16.5 10.4997 15.38 10.4997 14C10.4997 12.62 11.6197 11.5 12.9997 11.5C14.3797 11.5 15.4997 12.62 15.4997 14C15.4997 15.38 14.3797 16.5 12.9997 16.5Z" fill="currentColor"/>
                    </svg>
                    Login with MetaMask
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="bg-red-600 border border-red-700 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium text-sm">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className="bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded-md font-medium text-sm"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button" className="bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded-md font-medium text-sm">
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
