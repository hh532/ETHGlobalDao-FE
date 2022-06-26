// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

import { Paper, Grid, Button,TextField } from '@material-ui/core'
import { nftContractAddress, nftURI , REACT_APP_ALCHEMY_KEY} from '../../config'
import NFT from '../../contracts/NFT.json'
import { ethers } from 'ethers'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Moralis from "moralis"


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_ALCHEMY_KEY); 
export const nftDAOContract = new web3.eth.Contract(
	NFT.abi,
	nftContractAddress
);

export default function Home() {
  const [txError, setTxError] = useState(null)
  const [walletError, setWalletError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState("")
	const [requestedAccounts, setRequestedAccounts] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [ETHPriceValue, setETHPriceValue] = useState(0)

      // Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			// console.log('Got the ethereum obejct: ', ethereum)
			const accounts = await ethereum.request({ method: 'eth_accounts' })

			if (accounts.length !== 0) {
				// console.log('Found authorized Account: ', accounts[0])
				setCurrentAccount(accounts[0])
			} else {
				// console.log('No authorized account found')
			}
		} else {
			setWalletError('Please install MetaMask Wallet.')
		}
	}

    // Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		if (ethereum) {
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			// console.log('Connected to chain:' + chainId)

			// const rinkebyChainId = '0x2a'

			// const devChainId = 1337
      const rinkebyChainId = '0x13881'

			const devChainId = 80001
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				setCorrectNetwork(false)
			} else {
				setCorrectNetwork(true)
			}
		} else {
			setWalletError('Please install MetaMask Wallet.')
		}
	}


  function walletListener() {
		const { ethereum } = window
		if (ethereum) {
			ethereum.on('accountsChanged', (accounts) => {
				// Handle the new accounts, or lack thereof.
				// "accounts" will always be an array, but it can be empty.
				window.location.reload();
			});
			
			ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			});
		} else {
			setWalletError('Please install MetaMask Wallet.')
		}

		//   ethereum.on('message', mesg => {
		// 	  console.log("asd435&&")
		// 	  console.log(msg)
		//   })

	  }

  useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()

		walletListener()
	
	}, [currentAccount])


    // Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				setWalletError('Please install MetaMask Wallet.')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
      // let chainId = await ethereum.request({
      //     method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: '0x13881' }], // '0x3830303031'
      // })
			// console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x13881'

			const devChainId = 80001
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

      console.log(localhostChainId)
      console.log(chainId)
			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				alert('You are not connected to the Polygon Mumbai Testnet!')
				return
			}

			// console.log(requestedAccounts)
			setRequestedAccounts(true)

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
			
			// console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			// console.log('Error connecting to metamask', error)
		}
	}



    // Creates transaction to mint NFT on clicking Mint Character button
	const mintDAONFT = async () => {
		try {

			const { ethereum } = window

			if (ethereum) {

				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()

				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)


				let nftTx = await nftContract.mint(currentAccount, nftURI, ETHPriceValue)
        console.log('Minting....', nftTx.hash)
				setMiningStatus(0)

				let tx = await nftTx.wait()
				setLoadingState(1)
				// console.log('Mined!', tx)
				// let event = tx.events[0]
				// let value = event.args[2]
				// let tokenId = value.toNumber()

				// console.log(
				// 	`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				// )

				// getMintedNFT(tokenId)
				setMiningStatus(1)
				// getNFTs()
				// window.setTimeout(function(){location.reload()},60000)
				
			} else {
				setWalletError('Please install MetaMask Wallet.')
			}
		} catch (error) {
			// console.log('Error minting character', error)
			setTxError(error.message)
		}
	}


  const handleInputChange = async (e) => {
    e.preventDefault()

    // console.log(e.target.value)
    setETHPriceValue(e.target.value)
  }


	const getDAONFTMoralis = async () => {
		if (currentAccount != "") {
			// console.log("getting nfts 0")
			Moralis.start({serverUrl: "https://ctoh1zj64w6s.usemoralis.com:2053/server", appId: "VpyFBXuuopQQy55GBJ9GYpbO5Zp7XYTAZe7X2lTf"})
			// console.log(currentAccount)
			// console.log(nftContractAddress)
			const options = { chain: "mumbai", address: currentAccount,  token_address: nftContractAddress };
			const polygonNFTS = await Moralis.Web3API.account.getNFTsForContract(options);
			// console.log("ewqeqweqweqwe")
			// console.log(polygonNFTS)
			// console.log("getting nfts 1")

			if (polygonNFTS.result.length > 0) {

				var currNFTList = []
				for (var i = 0; i < polygonNFTS.result.length; i++ ) {
					// console.log("getting nfts 2")
          console.log(polygonNFTS.result[i])

					// const v
				}
				// setNFTList(currNFTList)
				// console.log(nftList)
			}
		}
	}


  const getETHPricePrediction = async () => {
    if (currentAccount != "") {
			// console.log("getting BORROW  ----- nfts 0")
			const tokenIds = await nftDAOContract.methods.getPricePrediction(1).call() // returns array
      console.log(tokenIds)

		}
  }


  return (
    <Grid container item xs={12}>
				<Grid container item xs={3} justifyContent="center">
				</Grid>

				<Grid container item xs={6} justify="center">
					{walletError === null ? (
					currentAccount === "" ? (
						<Button
							variant="outlined" disableElevation
							style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "80px", maxWidth: "200px" }}
							aria-label="View Code"
							disabled={(currentAccount === "" && requestedAccounts)}
							onClick={connectWallet}

						>
							Connect Wallet
						</Button>
					) : correctNetwork ? (
            <div>
              {/* <OutlinedInput type="number"  defaultValue="0" placeholder="ETH Price Prediction"> */}
            <TextField id="outlined-basic" type="number" label="ETH Price Prediction" variant="outlined" style={{marginTop: "50px" }} onChange={handleInputChange}/>
						{/* </OutlinedInput> */}
            <Button
							variant="outlined" disableElevation
							style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
							aria-label="View Code"
							onClick={mintDAONFT}
							// disabled={(nftList.length >= 2 || numMinted == 50)}
						>
							Mint NFTs
						</Button>

            <Button
							variant="outlined" disableElevation
							style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
							aria-label="View Code"
							onClick={getDAONFTMoralis}
							// disabled={(nftList.length >= 2 || numMinted == 50)}
						>
							Get DAO NFT MOralis
						</Button>

            <Button
							variant="outlined" disableElevation
							style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
							aria-label="View Code"
							onClick={getETHPricePrediction}
							// disabled={(nftList.length >= 2 || numMinted == 50)}
						>
							Get ETH Price Prediction
						</Button>

            </div>
					) : (
						<Paper elevation={0}
						style={{width: "100%", margin: "2px", marginTop: "80px", maxWidth: "250px", textAlign: "center"}}
						>
							Please connect to Polygon Mumbai Testnet
						</Paper>
					)) : (
						<div style={{marginTop: "80px"}}>{walletError}</div>
					)}
				</Grid>

				<Grid container item xs={3} justifyContent="center">
				</Grid>
			</Grid>
  )
}
