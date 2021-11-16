import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import './App.css'
import { loadContract } from './utils/load-contract'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isLoaded: false,
    web3: null,
    contract: null,
  })
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [shouldReload, setShouldReload] = useState(false)

  const networkHasContract = account && web3Api.contract

  const reload = useCallback(() => setShouldReload(!shouldReload), [shouldReload])

  const setAccountListener = provider => {
    provider.on('accountsChanged', accounts => setAccount(accounts[0]))
    provider.on('chainChanged', _ => window.location.reload())
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        const contract = await loadContract('Faucet', provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          isLoaded: true,
          provider,
          contract,
        })
      } else {
        setWeb3Api(web3Api => ({ ...web3Api, isLoaded: true }))
        console.log('Please install MetaMask')
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, 'ether'))
    }

    web3Api.contract && loadBalance()
  }, [web3Api, reload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  const addFunds = async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether'),
    })
    reload()
  }

  const withdrawFunds = async () => {
    const { contract, web3 } = web3Api
    const amount = web3.utils.toWei('0.1', 'ether')
    await contract.withdrawFunds(amount, { from: account })
    reload()
  }

  const handleConnect = () => {
    web3Api.provider && web3Api.provider.request({ method: 'eth_requestAccounts' })
  }

  return (
    <div className="app-wrapper">
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isLoaded ? (
            <div className="is-flex is-align-items-center">
              <span className="mr-2">
                <strong>Account</strong>
              </span>
              <div>
                {account ? (
                  account
                ) : web3Api.provider ? (
                  <button onClick={handleConnect} className="button is-small">
                    Connect
                  </button>
                ) : (
                  <div className="notification is-warning is-small is-rounded">
                    Wallet not detected.{' '}
                    <a target="_blank" rel="noreferrer" href="https://docs.metamask.io">
                      Please install MetaMask
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <span>Looking for web3...</span>
          )}
          <div className="balance-view is-size-2 my-5">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!networkHasContract && <i className="is-block">Connect to Ganache</i>}
          <button
            disabled={!networkHasContract}
            onClick={addFunds}
            className="button is-primary mr-2"
          >
            Donate 1 ETH
          </button>
          <button disabled={!networkHasContract} onClick={withdrawFunds} className="button is-link">
            Withdraw 0.1 ETH
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
