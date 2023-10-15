import React, { FC, useMemo, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Header from './Header';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';


import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Chart } from "react-google-charts";

import * as multisig from "@sqds/multisig";

const { Permission, Permissions } = multisig.types;
const network = WalletAdapterNetwork.Mainnet;
import Modal from 'react-modal';

import { clusterApiUrl, Connection, SystemProgram } from '@solana/web3.js';
import './Header.css';

import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

const data = [
  ['Date', 'Inflow', 'Outflow'],
  ['2013', 1000, 400],
  ['2014', 1170, 460],
  ['2015', 660, 1120],
  ['2016', 1030, 540],
];

const generateDummyData = (): (string | number)[][] => {
  const data: (string | number)[][] = [['Date', 'Inflow', 'Outflow']];
  const startDate = new Date('2023-10-01');
  for (let i = 0; i < 6; i++) {
    const randomDate = generateRandomDate(startDate, 30); // 30 days range
    const formattedDate = formatDateToChartFormat(randomDate);
    const inflow = Math.floor(Math.random() * 10);
    const outflow = Math.floor(Math.random() * 5);
    data.push([formattedDate, inflow, outflow]);
  }
  return data;
};

function generateRandomDate(startDate: Date, rangeInDays: number): Date {
  const randomDay = Math.floor(Math.random() * rangeInDays);
  const randomDate = new Date(startDate);
  randomDate.setDate(startDate.getDate() + randomDay);
  return randomDate;
}

function formatDateToChartFormat(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const options = {
  title: 'EuroE Vault Balance',
  hAxis: {
    title: 'Date',
    titleTextStyle: { color: '#333' },
    textStyle: { color: '#666' },
    gridlines: { color: 'transparent' } // Combine gridlines with hAxis
  },
  vAxis: {
    title: 'Amount (EuroE)',
    titleTextStyle: { color: '#333' },
    textStyle: { color: '#666' },
    minValue: 0,
    gridlines: { color: 'transparent' } // Combine gridlines with vAxis
  },
  chartArea: { width: '70%', height: '70%' },
  backgroundColor: '#f5f5f5',
  legend: { position: 'top', alignment: 'center' },
  colors: ['#3366CC', '#DC3912'],
  curveType: 'function',
  lineWidth: 2
};

const Portal = () => {
  const trendingData = {
    "json": [
      {
        "strategy": "FAVSpnZsNWKTnPmn4qPttZjT6MiWyCQjUVzDuf6pLcTB",
        "apy": "1.828020131712942446238850242484090060298",
        "pnl": "0.001467379347",
        "pnlSol": "0.0009711407",
        "volume": "221843.8299453858",
        "fees": "2007.6866610057",
        "tvl": "98941.20393389365189102619999999999999996",
        "tokenAMint": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        "tokenBMint": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
        "tokenAMetadata": {
          "name": "Marinade",
          "symbol": "MNDE",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png",
          "price": 0.04627586,
          "volume": 71003,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "999999535939420442",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Marinade staked SOL (mSOL)",
          "symbol": "mSOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
          "price": 24.25,
          "volume": 1620953,
          "decimals": 9,
          "tokenAuthority": "3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM",
          "freezeAuthority": null,
          "supply": "4662593504636167",
          "type": "token_address"
        }
      },
      {
        "strategy": "2hu7iT2HuT2pNiYtGWasQds6KQya3rM4ApgKNPonW7yi",
        "apy": "39281.11726663979693040184101641025497985",
        "pnl": "0.001203283853",
        "pnlSol": "0.000777710187",
        "volume": "20969.4930636035",
        "fees": "62.9084791908",
        "tvl": "794.4816097565135534999999999999999999995",
        "tokenAMint": "So11111111111111111111111111111111111111112",
        "tokenBMint": "74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ",
        "tokenAMetadata": {
          "name": "Wrapped SOL",
          "symbol": "SOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "price": 21.49,
          "volume": 405413237,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "0",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "COCO Token",
          "symbol": "COCO",
          "icon": "https://shdw-drive.genesysgo.net/EV1ARo89dwRzR1kv7JMr7V97qrcXjffkcwEuNHMJfJmz/COCO_icon.png",
          "price": 0.00060231,
          "decimals": 5,
          "tokenAuthority": "3LcKTdV47hLhXmaqDqzCqby7Y2pPbvW91RME99rCVQSG",
          "freezeAuthority": "3LcKTdV47hLhXmaqDqzCqby7Y2pPbvW91RME99rCVQSG",
          "supply": "4999999982329193",
          "type": "token_address"
        }
      },
      {
        "strategy": "AepjvYK4QfGhV3UjSRkZviR2AJAkLGtqdyKJFCf9kpz9",
        "apy": "0.732651259930519351254927986370155328828",
        "pnl": "0.001161632664",
        "pnlSol": "0.000726807566",
        "volume": "287299.0401686778",
        "fees": "650.0140783816",
        "tvl": "64050.08451015517246176999999999999999996",
        "tokenAMint": "RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a",
        "tokenBMint": "So11111111111111111111111111111111111111112",
        "tokenAMetadata": {
          "name": "Rollbit Coin",
          "symbol": "RLB",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a/logo.png",
          "price": 0.193725,
          "volume": 697244,
          "decimals": 2,
          "tokenAuthority": "RLB7VtCq4GkZrjkkQguvwPz32njCA13LDkjNxeAGKXH",
          "freezeAuthority": "RLB7VtCq4GkZrjkkQguvwPz32njCA13LDkjNxeAGKXH",
          "supply": "320945286684",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Wrapped SOL",
          "symbol": "SOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "price": 21.49,
          "volume": 405413237,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "0",
          "type": "token_address"
        }
      },
      {
        "strategy": "6satrFEw7p382wkJPcS1U3AWi25YcGiJuHkt7NyJa9vi",
        "apy": "1.161384037889876495758240167663121352",
        "pnl": "0.000973275731",
        "pnlSol": "0.000498418892",
        "volume": "25.8989559523",
        "fees": "0.2343855514",
        "tvl": "114.7103000894200599591999999999999999999",
        "tokenAMint": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        "tokenBMint": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
        "tokenAMetadata": {
          "name": "Marinade",
          "symbol": "MNDE",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png",
          "price": 0.04626604,
          "volume": 71003,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "999999535939420442",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Marinade staked SOL (mSOL)",
          "symbol": "mSOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
          "price": 24.3,
          "volume": 1620953,
          "decimals": 9,
          "tokenAuthority": "3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM",
          "freezeAuthority": null,
          "supply": "4662593508454649",
          "type": "token_address"
        }
      },
      {
        "strategy": "46HF3cV4JBkbPbiT6HsXMkBh9qLsmifLzt8F8iNcPdnv",
        "apy": "0.295913323902113130508879752562566043884",
        "pnl": "0.000963780366",
        "pnlSol": "0.000520134921",
        "volume": "1752.0917411289",
        "fees": "15.593616496",
        "tvl": "3084.383402837131728301499999999999999999",
        "tokenAMint": "So11111111111111111111111111111111111111112",
        "tokenBMint": "BWXrrYFhT7bMHmNBFoQFWdsSgA3yXoAnMhDK6Fn1eSEn",
        "tokenAMetadata": {
          "name": "Wrapped SOL",
          "symbol": "SOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "price": 21.49,
          "volume": 405413237,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "0",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Hades",
          "symbol": "HADES",
          "icon": "https://arweave.net/dvKu5BgpSo6j-iGzQOyVXYZ8OU7iyfhHNpkkJ_8qkkQ",
          "price": 0.120135,
          "volume": 121797,
          "decimals": 9,
          "tokenAuthority": "d4sH8ckL3iowTSin8gQaXtY9nQvdKCx2jimiV9qdndd",
          "freezeAuthority": null,
          "supply": "97412832177132695",
          "type": "token_address"
        }
      },
      {
        "strategy": "A4ufgHTe3jLzxbR6sDdrZhLxNdR1Lw2ija1uEdDFLPbX",
        "apy": "0.220937160328923781071243495787720893279",
        "pnl": "0.000895967139",
        "pnlSol": "0.000468220481",
        "volume": "33297.9758380203",
        "fees": "88.4061258499",
        "tvl": "22499.72407462732169246799999999999999999",
        "tokenAMint": "So11111111111111111111111111111111111111112",
        "tokenBMint": "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
        "tokenAMetadata": {
          "name": "Wrapped SOL",
          "symbol": "SOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "price": 21.49,
          "volume": 405413237,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "0",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "DUST Protocol",
          "symbol": "DUST",
          "icon": "https://gateway.pinata.cloud/ipfs/Qmb5qNLPhR8fJaz5MN1W55iSCXdNgMMSdWn94Z9oiFjw3o",
          "price": 0.873061,
          "volume": 976198,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "33297795152932449",
          "type": "token_address"
        }
      },
      {
        "strategy": "H62RwxzuHiKkSTbrieJc9Xukj6ZZHfoMGZnSGnpEsWNo",
        "apy": "0.850692697725694292210570771629080981398",
        "pnl": "0.000884105068",
        "pnlSol": "0.000413106995",
        "volume": "94695.6510552046",
        "fees": "411.6656993063",
        "tvl": "45100.02095989633591112402308199999999997",
        "tokenAMint": "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
        "tokenBMint": "mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6",
        "tokenAMetadata": {
          "name": "Helium Network Token",
          "symbol": "HNT",
          "icon": "https://shdw-drive.genesysgo.net/6tcnBSybPG7piEDShBcrVtYJDPSvGrDbVvXmXKpzBvWP/hnt.png",
          "price": 1.65,
          "decimals": 8,
          "tokenAuthority": "3QqEkX1juz4bW8mCQBMJLWjEpHqYawvbEUvpc6iwYom3",
          "freezeAuthority": "BQ3MCuTT5zVBhNfQ4SjMh3NPVhFy73MPV8rjfq5d1zie",
          "supply": "15461350647964585",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Helium Mobile",
          "symbol": "MOBILE",
          "icon": "https://shdw-drive.genesysgo.net/6tcnBSybPG7piEDShBcrVtYJDPSvGrDbVvXmXKpzBvWP/mobile.png",
          "price": 0.00025967,
          "decimals": 6,
          "tokenAuthority": "3xGSXWtUTpZKEcM68wYSCaBRNPs8kxNeTEdi5HsDVKxh",
          "freezeAuthority": "Gm9xDCJawDEKDrrQW6haw94gABaYzQwCq4ZQU8h8bd22",
          "supply": "70977106985952288",
          "type": "token_address"
        }
      },
      {
        "strategy": "HWg7yB3C1BnmTKFMU3KGD7E96xx2rUhv4gxrwbZLXHBt",
        "apy": "0.094417402925437546732641758132882341432",
        "pnl": "0.000745625423",
        "pnlSol": "0.000321610014",
        "volume": "23765.8889805482",
        "fees": "63.4549235781",
        "tvl": "31833.53386344527794850999999999999999999",
        "tokenAMint": "So11111111111111111111111111111111111111112",
        "tokenBMint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        "tokenAMetadata": {
          "name": "Wrapped SOL",
          "symbol": "SOL",
          "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "price": 21.49,
          "volume": 405413237,
          "decimals": 9,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "0",
          "type": "token_address"
        },
        "tokenBMetadata": {
          "name": "Bonk",
          "symbol": "Bonk",
          "icon": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
          "price": 2.66026e-7,
          "volume": 2072388,
          "decimals": 5,
          "tokenAuthority": null,
          "freezeAuthority": null,
          "supply": "9371729971034482072",
          "type": "token_address"
        }
      }
    ]
  };

  const fetchVaultBalance = async (vault: string) => { 
    const apiUrl = `https://orca-app-eq7y4.ondigitalocean.app/balances/${vault}?sendAll=true&cacheBypass=false&useProd=true`;
    console.log("apiUrl "  + apiUrl);
    if(vault !== "None" || vault !== null) {
    fetch(apiUrl)
    .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.balances && Array.isArray(data.balances)) {
      data.balances.forEach((balance: any) => {
        const mint = balance.mint;
        const uiAmount = balance.uiAmount;
        const uiPrice = balance.uiPrice;

        if(mint === "2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg") {
        setEuroEBalance(uiAmount);
        setEuroEValue(uiPrice);
        }

        if(mint === "So11111111111111111111111111111111111111112") {
          setSolBalance(uiAmount);
        }
      });
    }
  
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  }
  }
  
  const fetchTrendingStrategies = async () => {
    try {
      const response = await fetch("https://beta.kamino.one/api/leaderboard?view=true", {
        method: 'GET',
        headers: {
          'Origin': 'https://localhost:5173', // Specify your origin here
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  const { publicKey, signMessage } = useWallet(); // Use useWallet hook here
  const [signed, setSigned] = useState(false); // Add a state variable to track signing status
  const wallet = useAnchorWallet();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalState, setModalState] = useState('loading'); // Initial state
  const [privateKey, setPrivateKey] = useState(''); // Initial state
  const [cPublicKey, setcPublicKey] = useState(''); // Initial state
  const [depositTransaction, setDepositTransaction] = useState('');
  const [copied, setCopied] = useState(false);
  const [creatorWallet, setCreatorWallet] = useState<Keypair | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [vaultDepositWallet, setVaultDepositWallet] = useState('');
  const [vaultWallet, setVaultWallet] = useState('');

  const [euroEBalance, setEuroEBalance] = useState<number>(0);

  const [euroEValue, setEuroEValue] = useState<number>(0);

  const [solBalance, setSolBalance] = useState<number>(0);

  useEffect(() => {

    if(vaultWallet !== null && vaultWallet !== "") {
    fetchVaultBalance(vaultWallet);
    }
  }, [vaultWallet]);

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      if (vaultWallet !== null && vaultWallet !== "") {
        fetchVaultBalance(vaultWallet);
      }
    }, 60000); 

    return () => {
      clearInterval(intervalId);
    };
  }, [vaultWallet]);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  function shortenAddress(address: string, startLength = 8, endLength = 8) {
    if (!address) return address;
  
    const trimmedStart = address.slice(0, startLength);
    const trimmedEnd = address.slice(-endLength);
  
    return `${trimmedStart}...${trimmedEnd}`;
  }

  const openModal = (state: any) => {
    setModalState(state); 
    setModalIsOpen(true); 
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  async function fetchNonce() {
    const requestBody = {
      wallet: publicKey,
    };
    
      const response = await fetch('https://binaramics.com:5173/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
    const { nonce } = await response.json();
    
    return nonce;
  }
  
  async function sign() {
    if(signMessage && publicKey)
    try {
  
      const nonce = await fetchNonce();
      const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = bs58.encode(await signMessage(encodedMessage));
      setSigned(true);
      return signature;
  
    } catch (e) {
      console.log('could not sign message' + e);
    }
  }

  

  const handleCopyVault = async () => {
    await navigator.clipboard.writeText(vaultDepositWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setToastMessage("Vault Wallet copied");
    handleShowToast();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("[" + privateKey + "]");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);

      const connection = new Connection("https://solana.coin.ledger.com", "confirmed");
      
      const receiver = new PublicKey(cPublicKey);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet!.publicKey,
          toPubkey: receiver,
          lamports: 5500000,
        })
      );
  
      transaction.feePayer = wallet!.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
    let signed = await wallet!.signTransaction(transaction); 
  
    let txid = await connection.sendRawTransaction(signed.serialize());
    setDepositTransaction(txid);

    setModalState('loading');
    setTimeout(async () => {
     
      const multiSignPDAKey = Keypair.generate();
    
    const pdaPublicKey = multiSignPDAKey.publicKey; 
    console.log(pdaPublicKey.toBase58());
    // Derive the multisig account PDA
    const [multisigPda] = multisig.getMultisigPda({
      createKey: pdaPublicKey, // Pass the public key
    });

    
        // Create the multisig
        const signature = await multisig.rpc.multisigCreate({
            connection,
           
            createKey: multiSignPDAKey,
            // The creator & fee payer
            creator: creatorWallet!,
            multisigPda,
            configAuthority: publicKey,
            timeLock: 0,
            members: [{
                    key: receiver,
                    permissions: Permissions.all(),
                },
                {
                    key: publicKey!,
                    permissions: Permissions.all(),
                },
            ],
            // This means that there needs to be 2 votes for a transaction proposal to be approved
            threshold: 2,
        });
       
        const [vaultPda] = multisig.getVaultPda({
          multisigPda,
          index: 0,
      });

      const payload = {
        vaultDepositWallet: vaultPda.toBase58(),
        vaultPDA: multisigPda.toBase58(),
        vaultCreator: cPublicKey,
        vaultOwner: publicKey!
      };
      
      // Create the request options
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      
      // Send the POST request
      fetch('https://binaramics.com:5000/newVault', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          // Handle the response data here
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error here
        });


     
      openModal('finish');

    }, 12000); 
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const fetchVaultWallet = async () => {
    const url = `https://binaramics.com:5000/getVaultDepositByOwner?wallet=${publicKey!}`;

  // Send the GET request
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {

      const depositWallet = data[0].SQUADS_DEPOSIT_WALLET;

      console.log(depositWallet);
      setVaultWallet(depositWallet.toString());
      
    } else if (data.error === "No data found") {
      setVaultDepositWallet("None");
      return;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
 
  };

  const handleGoals = async (event: any) => {
    event.preventDefault();
    const url = `https://binaramics.com:5000/getVaultDepositByOwner?wallet=${publicKey!}`;

   openModal('goal');
  }


  const handleVaultDeposit = async (event: any) => {
    event.preventDefault();
    const url = `https://binaramics.com:5000/getVaultDepositByOwner?wallet=${publicKey!}`;

  // Send the GET request
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      const depositWallet = data[0].SQUADS_DEPOSIT_WALLET;
      setVaultDepositWallet(depositWallet);
      if (depositWallet) {
        openModal('depositVault');
        return;
      } 
    } else if (data.error === "No data found") {
      setToastMessage("Please create a vault first!");
      handleShowToast();
      return;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  };
  
  const handleVaultUnlink = async (event: any) => {
    event.preventDefault();
    const url = `https://binaramics.com:5000/getVaultDepositByOwner?wallet=${publicKey!}`;

  // Send the GET request
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      const depositWallet = data[0].SQUADS_DEPOSIT_WALLET;
      if (depositWallet) {
        openModal('depositVault')
        return;
      } 
    } else if (data.error === "No data found") {
      setToastMessage("Please create a vault first!");
      handleShowToast();
      return;
      
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  };

  const percentage = (euroEBalance / 12) * 100;

  const handleNewVault = async (event: any) => {
    event.preventDefault();
    openModal('loading')

    const url = `https://binaramics.com:5000/getVaultDepositByOwner?wallet=${publicKey!}`;

  // Send the GET request
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      const depositWallet = data[0].SQUADS_DEPOSIT_WALLET;
      if (depositWallet) {
        setModalState('fail');
        return;
      } 
    } else if (data.error === "No data found") {
      console.log("true");
      const creatorWallet = Keypair.generate();
      setPrivateKey(creatorWallet.secretKey.toString());
      setcPublicKey(creatorWallet.publicKey.toString());
      setCreatorWallet(creatorWallet); 
      setTimeout(() => {
        setModalState('deposit');
      }, 2000); 
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
 
  };

  
    const handleSubmit = async (event: any) => {
      event.preventDefault();
  
     await sign();
     fetchVaultWallet();
    };

    const data = generateDummyData();

  return (
<section className="section wrapper-section">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.3.1/css/all.min.css"
      />

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
            
      {signed ? (


<div className="">
  <section className="stats">
  <div className="toast-container">
      
        {showToast && (
          <div className="toast">
          {toastMessage}
          </div>
        )}
        </div>

      <div>
     
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        className={`modal-content ${modalState}`} 
        overlayClassName="modal-overlay"
        contentLabel="Example Modal"
      >

        <div>
          <button onClick={closeModal} className="modal-close-button">
            Close
          </button>
        </div>

        {modalState === 'loading' && (
          <div>
            <h1>Loading</h1>
            <p>We're getting everything ready.</p>
            <img src="../public/Loading.gif" className="loading-animation" alt="Loading" />
          </div>
        )}

      {modalState === 'fail' && (
            <div>
            <h1>Vault Exists</h1>
            <p>Sorry, but you already got a vault.</p>
            <img src="../public/fail.gif" className="loading-animation" alt="Fail" />
          </div>
        )}

        {modalState === 'deposit' && (
          <div>
            <h1>Vault Creation</h1>
            <p>Save this Private-Key and deposit some SOL</p>
            <div className="copy-button-container">
            <button className="copy-button" onClick={handleCopy}>
              Copy Private Key
            </button>
            </div>
            <img src="../public/sign.gif" className="loading-animation" alt="Deposit" />
           
          </div>
        )}

        {modalState === 'depositVault' && (
            <div>
            <h1>Deposit</h1>
            
            <img src="../public/Deposit.gif" className="loading-animation" alt="Deposit" />
            <p>Deposit EuroE into your vault.</p>


            
            <button className="copy-button" onClick={handleCopyVault}>
              Copy Vault Address
            </button>
           
           
            <div className="p2">{shortenAddress(vaultDepositWallet)}</div>
           
            
            <div className="copy-button-container">
            </div>
           
          </div>
        )}

        {modalState === 'goal' && (
          <div>
           
            <h1>Goal Progress</h1>
            <p>See your current progress of your goal!</p>
      <div style={{ width: '150px', margin: '0 auto' }}>
        <CircularProgressbar
          value={percentage}
          className="goal-progress"
          text={`${Math.round(percentage)}%`}
          styles={buildStyles({
            textColor: 'black',
            pathColor: 'orange',
          })}

          
        />

    <div className="buttons-container">
      <button className="new-button">New</button>
      <button className="reset-button">Reset</button>
    </div>

      </div>
          </div>
        )}

        {modalState === 'finish' && (
          <div>
            <h1>Vault Created</h1>
            <p>Your vault was created successfully!</p>
            <img src="../public/finish.gif" className="loading-animation" alt="Loading" />
          </div>
        )}
      </Modal>
    </div>

<div className="buttons">
    <button className="button" onClick={handleNewVault}>
      <i className="fa fa-key" ></i> Create Vault
    </button>

    <button className="button"onClick={handleVaultDeposit}>
      <i className="fa fa-share-square"></i> Deposit
    </button>

    <button className="button" onClick={handleGoals}>
      <i className="fa fa-trophy"></i> Goals
    </button>
  </div>

    <form>

    <h4>E-Dashboard</h4>
<div className="intro">GM. Check Out the Latest Data!</div>

      <h2>Balance</h2>
      <div className="balance-sub">
  Vault Funds Overview (Total {
    typeof euroEValue === 'number'
      ? euroEValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0, 
        })
      : 'N/A'
  })
</div>
    </form>


    <div className="balance-container">
  <div className="balance">
    <img src="../public/EuroELogo.png" alt="EuroE Balance" />
    <span>{euroEBalance}</span>
  </div>
  <div className="balance">
    <img src="../public/Solana.png" alt="SOL Balance" />
    <span>{solBalance}</span>
  </div>
</div>

  <Chart
    chartType="LineChart"
    width="100%"
    height="400px"
    data={data}
    options={options}
    legendToggle
  />

</section>

<div className="strategies">
  <h2>Best APR Strategies</h2>
  {trendingData.json.map((strategy, index) => (
    <div key={index} className="strategy-item">
      <div className="token-info">
        <div className="token">
          <img src={strategy.tokenAMetadata.icon} alt={strategy.tokenAMetadata.name} />
          <p className="token-name">{strategy.tokenAMetadata.name}</p>
        </div>
        <div className="token">
          <img src={strategy.tokenBMetadata.icon} alt={strategy.tokenBMetadata.name} />
          <p className="token-name">{strategy.tokenBMetadata.name}</p>
        </div>
      </div>
      <div className="strategy-info">
        <div className="strategy-header">
          <h3>{strategy.strategy} <i className="fas fa-info-circle custom-icon"></i></h3>
          
        </div>
        <div className="strategy-details">
        <p>
  <i className="fas fa-percent custom-icon"></i> APY: <span>{(Math.round(Number(strategy.apy) * 100)).toFixed(2)}%</span>
</p>
<p>
<p>
  <i className="fas fa-chart-bar custom-icon"></i> Volume:{" "}
  <span>${(Math.round(Number(strategy.volume) * 100) / 100).toLocaleString()}</span>
</p>
</p>
<p>
<p> 
  <i className="fas fa-dollar-sign custom-icon"></i> Fees:{" "}
  <span>
    {(
      Math.round(Number(strategy.fees) * 100) / 100
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })}
  </span>
</p>
</p>
<p>
<p>
  <i className="fas fa-chart-pie custom-icon"></i> TVL: <span></span>
  <span>
     {(Math.round(Number(strategy.tvl) * 100) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })}
  </span>
</p>
</p>
<p>
</p>
        </div>
      </div>
    </div>
  ))}
</div>

  
  </div>





      
      ) : (
        <div className="container">
        <div className="wrapper">
          <form>
            <h1>Environ</h1>
            <p>Log in using your Solana wallet</p>
            <WalletMultiButton />
            <div className="register">
              <p>Sign the message</p>
              <button className="register-btn" onClick={handleSubmit}>
                Sign
              </button>
            </div>
          </form>
        </div>
        <div className="main-img"></div>
      </div>
      )}
    </section>
  
    
  );
};

const AppPage = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Portal />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};



const App = () => {

  
  return (
    <Router>
       <Header/>
    <div>
      <Route path="/" exact component={AppPage} />

      
    
     
    </div>
  </Router>
  );
};

export default App;


