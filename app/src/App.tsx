import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar';
import * as anchor from "@project-serum/anchor";
import Cluster from './components/clusters';
import Home from './components/home';
import Browse from './components/browse';
import React, { FC, ReactNode, useMemo } from 'react';
import { createCluster, initCluster, issueCluster, redeemCluster, getClusters, faucetTestTokens, createTokenAccounts } from './components/funcs';

import * as buffer from "buffer";

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {

    window.Buffer = buffer.Buffer;

    return (
        <Context>
            <Router>
            <Navbar />
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/content/' element={<Content />} />
                    <Route path='/browse/' element={<Browse />} />
                    <Route path="/clusters/:address/" element={<Cluster />} />
                </Routes>
        </Router>
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            // new UnsafeBurnerWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const wallet = useAnchorWallet();

    const k1 = new anchor.web3.PublicKey("7b1jGmedv6EdKagn9pgy25fpxQYSno7P7teZ2sL4VJa8");
    const k2 = new anchor.web3.PublicKey("9uzBMn5WbV3Z8hTUp41waD7YJDwfs6mRmMzdhjAq1sMT");
    const k3 = new anchor.web3.PublicKey("9nFLgom8xt39ho2jrSnd3wei9BKTsMUp893TffkTAE54");

    const cp = new anchor.web3.PublicKey("3bH9yB5hkMKzJtjfLwLb5EVhexrvBjQiTbPkz8K7XMzc");

    const loadClusters = async(wallet : any) => {
        await getClusters(wallet).then((i) => {
            for(const clust of i){
                console.log(clust.publicKey.toBase58());
            }
        });
    }

    return (
        <div className="App">
            <div>
                <button onClick={() => createCluster(wallet, "ClusterOne", "CONE", k1, k2, k3)}>Create</button><br /><br />
                <button onClick={() => initCluster(wallet, cp, k1, k2, k3)}>Init</button><br /><br />
                <button onClick={() => issueCluster(wallet, cp, 1, k1, k2, k3)}>Issue</button><br /><br />
                <button onClick={() => redeemCluster(wallet, cp, 1, k1, k2, k3)}>Redeem</button><br /><br />
                <button onClick={() => createTokenAccounts(wallet,cp, k1, k2, k3)}>TokenAccounts</button><br /><br />
                <button onClick={() => faucetTestTokens(wallet, k1, k2, k3)}>Faucet</button><br /><br />
                <button onClick={() => loadClusters(wallet)}>GetClusters</button>
            </div>
        </div>
    );
};
