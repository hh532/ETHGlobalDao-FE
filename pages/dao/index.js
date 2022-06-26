
import { useState, useEffect } from 'react'

import { Paper, Grid, Button,TextField } from '@material-ui/core'
import { daoContractAddress, nftURI , REACT_APP_ALCHEMY_KEY} from '../../config'
import DAO from '../../contracts/DAO.json'
import { ethers } from 'ethers'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Moralis from "moralis"


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_ALCHEMY_KEY); 
export const DAOContract = new web3.eth.Contract(
	DAO.abi,
	daoContractAddress
);


export default function Home() {
    const [txError, setTxError] = useState(null)
  const [walletError, setWalletError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState("")
	const [requestedAccounts, setRequestedAccounts] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [ETHPriceValue, setETHPriceValue] = useState(0)

  const [ProposalDescription, setProposalDescription] = useState("")
  const [ProposalChoice1, setProposalChoice1] = useState("")
  const [ProposalChoice2, setProposalChoice2] = useState("")
  const [ProposalChoice3, setProposalChoice3] = useState("")

  const [proposal, setProposal] = useState("")


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
const joinDAO = async () => {
    try {

        const { ethereum } = window

        if (ethereum) {

            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const daoContract = new ethers.Contract(
                daoContractAddress,
                DAO.abi,
                signer
            )


            let nftTx = await daoContract.joinDAO(currentAccount)
    console.log('Minting....', nftTx.hash)
            setMiningStatus(0)

            let tx = await nftTx.wait()
            setLoadingState(1)

            setMiningStatus(1)
            // getNFTs()            
        } else {
            setWalletError('Please install MetaMask Wallet.')
        }
    } catch (error) {
        // console.log('Error minting character', error)
        setTxError(error.message)
    }
}





const getDAOMembers = async () => {
    if (currentAccount != "") {
        // console.log("getting BORROW  ----- nfts 0")
        const tokenIds = await DAOContract.methods.getDAOMembers().call() // returns array
        console.log(tokenIds)
    }
}


const handleInputChangeDescription = async (e) => {
    e.preventDefault()

    setProposalDescription(e.target.value)
  }

  const handleInputChangeChoice1 = async (e) => {
    e.preventDefault()

    setProposalChoice1(e.target.value)
  }

  const handleInputChangeChoice2 = async (e) => {
    e.preventDefault()

    setProposalChoice2(e.target.value)
  }

  const handleInputChangeChoice3 = async (e) => {
    e.preventDefault()

    setProposalChoice3(e.target.value)
  }

  const createProposal = async () => {
    try {
        const { ethereum } = window

        if (ethereum) {

            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const daoContract = new ethers.Contract(
                daoContractAddress,
                DAO.abi,
                signer
            )


            let nftTx = await daoContract.createProposal(ProposalDescription, ProposalChoice1, ProposalChoice2, ProposalChoice3)
    console.log('Minting....', nftTx.hash)
            // setMiningStatus(0)

            let tx = await nftTx.wait()
            // setLoadingState(1)

            // setMiningStatus(1)
            // getNFTs()            
        } else {
            setWalletError('Please install MetaMask Wallet.')
        }
    } catch (error) {
        // console.log('Error minting character', error)
        setTxError(error.message)
    }

  }

  const selectedChoice1 = async () => {
    try {
        const { ethereum } = window

        if (ethereum) {

            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const daoContract = new ethers.Contract(
                daoContractAddress,
                DAO.abi,
                signer
            )

            let nftTx = await daoContract.voteOnProposal(1, 1)
    console.log('Minting....', nftTx.hash)
            // setMiningStatus(0)

            let tx = await nftTx.wait()
           
        } else {
            setWalletError('Please install MetaMask Wallet.')
        }
    } catch (error) {
        // console.log('Error minting character', error)
        setTxError(error.message)
    }
  }


  const selectedChoice2 = async () => {
    try {
        const { ethereum } = window

        if (ethereum) {

            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const daoContract = new ethers.Contract(
                daoContractAddress,
                DAO.abi,
                signer
            )

            let nftTx = await daoContract.voteOnProposal(1, 2)
    console.log('Minting....', nftTx.hash)
            // setMiningStatus(0)

            let tx = await nftTx.wait()
           
        } else {
            setWalletError('Please install MetaMask Wallet.')
        }
    } catch (error) {
        // console.log('Error minting character', error)
        setTxError(error.message)
    }
  }

  const selectedChoice3 = async () => {
    try {
        const { ethereum } = window

        if (ethereum) {

            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const daoContract = new ethers.Contract(
                daoContractAddress,
                DAO.abi,
                signer
            )

            let nftTx = await daoContract.voteOnProposal(1, 3)
    console.log('Minting....', nftTx.hash)
            // setMiningStatus(0)

            let tx = await nftTx.wait()
           
        } else {
            setWalletError('Please install MetaMask Wallet.')
        }
    } catch (error) {
        // console.log('Error minting character', error)
        setTxError(error.message)
    }
  }


  
  const getProposal = async () => {
    if (currentAccount != "") {
			// console.log("getting BORROW  ----- nfts 0")
            const proposal = await DAOContract.methods.getProposal(1).call() // returns array
            console.log(proposal)
            setProposal(proposal)
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
        
        <Button
                        variant="outlined" disableElevation
                        style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "50px", maxWidth: "200px" }}
                        aria-label="View Code"
                        onClick={joinDAO}
                        // disabled={(nftList.length >= 2 || numMinted == 50)}
                    >
                       Join DAO
                    </Button>

                        <Button
                            variant="outlined" disableElevation
                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                            aria-label="View Code"
                            onClick={getDAOMembers}
                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                            >
                            Get DAO Members
                        </Button>


                        <TextField
                            placeholder="Dao Proposal description goes here"
                            multiline
                            rows={2}
                            maxRows={4}
                            onChange={handleInputChangeDescription}
                            />

<TextField id="outlined-basic" type="text" label="Choice 1" variant="outlined" style={{marginTop: "20px" }} onChange={handleInputChangeChoice1}/>
<TextField id="outlined-basic" type="text" label="Choice 2" variant="outlined" style={{marginTop: "20px" }} onChange={handleInputChangeChoice2}/>
<TextField id="outlined-basic" type="text" label="Choice 3" variant="outlined" style={{marginTop: "20px" }} onChange={handleInputChangeChoice3}/>


<Button
                            variant="outlined" disableElevation
                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                            aria-label="View Code"
                            onClick={createProposal}
                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                            >
                            Create Proposal
                        </Button>



                        <Button
                            variant="outlined" disableElevation
                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                            aria-label="View Code"
                            onClick={getProposal}
                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                            >
                            Get Proposal
                        </Button>


                        <Grid container item xs={6} justify="center">
                            <div>
                                {proposal != "" ? (
                                    <div >
                                        {console.log(proposal)}
                                        <div>{proposal.description}</div>
                                        <Button
                                            variant="outlined" disableElevation
                                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                                            aria-label="View Code"
                                            onClick={selectedChoice1}
                                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                                            >
                                            Choice 1: {proposal.choice1}
                                        </Button>

                                        <Button
                                            variant="outlined" disableElevation
                                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                                            aria-label="View Code"
                                            onClick={selectedChoice2}
                                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                                            >
                                            Choice 2: {proposal.choice2}
                                        </Button>

                                        <Button
                                            variant="outlined" disableElevation
                                            style={{ border: '2px solid', height: "50px", width: "100%", margin: "2px", marginTop: "10px", maxWidth: "200px" }}
                                            aria-label="View Code"
                                            onClick={selectedChoice3}
                                            // disabled={(nftList.length >= 2 || numMinted == 50)}
                                            >
                                            Choice 3: {proposal.choice3}
                                        </Button>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </Grid>
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
            </Grid>
        )
}