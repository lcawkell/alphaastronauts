import css from './WalletWrapper.module.css';
import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { AppProps } from 'next/dist/shared/lib/router/router';

declare const window:any;

interface IWalletWrapperState {
    provider: ethers.providers.Web3Provider;
    signer: ethers.Signer;
    walletAddress: string;
    loadingWallet: boolean;
}

interface IWalletWrapperProps {
    pageProps: AppProps;
    component: any;
}

export interface IWalletWrapper extends IWalletWrapperState {
    connectToWallet: () => Promise<ethers.Signer>;
}

export default class WalletWrapper extends React.Component<IWalletWrapperProps, IWalletWrapperState> {

    constructor(props){
        super(props);

        this.state = {
            provider: null,
            signer: null,
            walletAddress: null,
            loadingWallet: true
        }

        this.connectToWallet = this.connectToWallet.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await this.loadWeb3();
        await this.checkConnection();
    }

    async connectToWallet() {
        try {
            return new Promise(async (resolve) => {
                await this.state.provider.send("eth_requestAccounts", []);
                let signer = await this.loadSigner();
                resolve(signer);
            });
        }catch(e) {
            console.log("Unable to connect to your wallet!");
            return '';
        }
    }

    async checkConnection() {
        if(this.state.provider === null) return;
        let accounts = await this.state.provider.listAccounts();
        if(accounts.length > 0) {
            await this.loadSigner();
        }
    }

    async loadSigner() {
        return new Promise(async (resolve) => {
            const signer = this.state.provider.getSigner();
            const walletAddress = this.truncateAddress(await signer.getAddress());
            this.setState({signer, walletAddress, loadingWallet:false});
            await this.checkNetwork();
            resolve(signer);
        })
    }

    async checkNetwork() {
        console.log("Checking network");
        if(this.state.signer === null) return;

        if(this.state.provider.network.chainId !== 137) {
            console.log("Wrong network detected");
            await this.switchNetwork();
        }
    }

    truncateAddress(address:string) {
        return `${address.substring(0,6).toUpperCase()}...${address.substring(address.length-4).toUpperCase()}`;
    }

    async loadWeb3() {
        if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            this.setState({provider});
        }
        else {
            alert(`Metamask doesn't appear to be loaded. Please make sure you are using a web3 capable browser with metamask installed.`)
        }
    }

    async loadBlockchainData() {
        if(this.state.provider === null) return;
        const network = this.state.provider.network;
        if(network.chainId !== 137) {
            await this.switchNetwork();
        }
    }

    async switchNetwork() {
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0x89",
                rpcUrls: ["https://rpc-mainnet.matic.network/"],
                chainName: "Matic Mainnet",
                nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18
                },
                blockExplorerUrls: ["https://polygonscan.com/"]
            }]
        });
    }

    render(): React.ReactNode {
        const Component = this.props.component;
        const pageProps = this.props.pageProps;

        return (<Component {...pageProps} loadingWallet={this.state.loadingWallet} provider={this.state.provider} signer={this.state.signer} walletAddress={this.state.walletAddress} connectToWallet={()=>this.connectToWallet()} />)
    }
}