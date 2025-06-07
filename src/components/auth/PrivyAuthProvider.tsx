'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { createConfig } from '@privy-io/wagmi';

// Wagmi config for Ethereum chains (if needed)
const config = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(),
    },
});

// Query client for React Query
const queryClient = new QueryClient();

interface PrivyAuthProviderProps {
    children: React.ReactNode;
}

export default function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                // Customize login methods - X first, then wallet
                loginMethods: ['twitter', 'wallet'],

                // Appearance customization
                appearance: {
                    theme: 'dark',
                    accentColor: '#FFD700',
                    logo: '/logo.svg',
                    showWalletLoginFirst: false, // Show X login first
                },

                // Embedded wallets configuration
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                    requireUserPasswordOnCreate: false,
                },

                // External wallet configuration for Solana
                externalWallets: {
                    solana: {
                        // connectors: [
                        //   // Most popular Solana wallets
                        //   'phantom',
                        //   'solflare',
                        //   'backpack',
                        //   'coinbase_wallet',
                        //   'wallet_connect',
                        // ],
                    },
                },

                // Legal and UX configuration
                legal: {
                    termsAndConditionsUrl: 'https://tokenready.io/terms',
                    privacyPolicyUrl: 'https://tokenready.io/privacy',
                },

                // Default to Solana for new users
                // defaultChain: 'solana',
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}