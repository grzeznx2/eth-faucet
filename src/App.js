import { useEffect, useState } from 'react'
import Web3 from 'web3'
import './App.css'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      let provider = null
      const { ethereum, web3 } = window

      if (ethereum) {
        provider = ethereum
        try {
          await provider.request({ method: 'eth_requestAccounts' })
        } catch (error) {
          console.error('User denied access')
        }
      } else if (web3) {
        provider = web3.currentProvider
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider('http://localhost:7454')
      }

      setWeb3Api({
        web3: new Web3(provider),
        provider,
      })
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  return (
    <div className="app-wrapper">
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account</strong>
          </span>
          <h1>{account ? account : 'not connected'}</h1>
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </div>
  )
}

export default App
