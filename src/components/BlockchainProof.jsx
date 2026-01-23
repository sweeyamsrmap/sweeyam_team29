import { ShieldCheck, ExternalLink } from 'lucide-react'

export default function BlockchainProof() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-500" size={20} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Proof</h3>
        </div>
        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800 uppercase tracking-tighter">
          Immutable
        </span>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center gap-6">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transaction Hash</label>
          <code className="text-sm font-mono text-primary break-all">
            0x742d35Cc6634C0532925a3b844Bc454e4438f44e
          </code>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Timestamp</label>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Oct 24, 2023 14:32:11 UTC</p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Network</label>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">ESGChain L2 Mainnet</p>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="size-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">V</div>
            <div className="size-6 rounded-full bg-primary border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">B</div>
            <div className="size-6 rounded-full bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">+</div>
          </div>
          <button className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1">
            View on Explorer <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
