import { useEffect, useState } from 'react'
import Web3 from 'web3'
import './App.css'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })

  useEffect(() => {
    const loadProvider = async () => {
      let provider = null
      const { ethereum, web3 } = window

      if (ethereum) {
        provider = ethereum
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

  return (
    <div className="app-wrapper">
      <div className="faucet-wrapper">
        <div className="faucet">
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
