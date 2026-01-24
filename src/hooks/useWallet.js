import { useState, useEffect } from 'react'
import { connectWallet, isMetaMaskInstalled } from '../utils/blockchain'

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err)
        }
      }
    }
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount(null)
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      const connectedAccount = await connectWallet()
      setAccount(connectedAccount)
      return connectedAccount
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
  }

  return {
    account,
    isConnected: !!account,
    isConnecting,
    error,
    connect,
    disconnect,
    isMetaMaskInstalled: isMetaMaskInstalled()
  }
}
