import { useWallet } from '../hooks/useWallet'

function WalletConnect() {
  const { account, isConnected, isConnecting, error, connect, isMetaMaskInstalled } = useWallet()

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-400/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-yellow-400">warning</span>
          <div>
            <h3 className="font-semibold text-yellow-300 mb-1">MetaMask Not Detected</h3>
            <p className="text-sm text-yellow-200 mb-2">
              Please install MetaMask to interact with the blockchain.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-300 underline hover:text-yellow-200"
            >
              Download MetaMask →
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <span className="material-symbols-outlined text-white">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">Wallet Connected</p>
              <p className="text-xs text-emerald-200 font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-emerald-300">Active</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-blue-400">account_balance_wallet</span>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-300 mb-1">Connect Your Wallet</h3>
          <p className="text-sm text-blue-200 mb-3">
            Connect your MetaMask wallet to submit data to the blockchain.
          </p>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && (
            <p className="text-sm text-red-400 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletConnect
