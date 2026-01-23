import { Search, CheckCircle } from 'lucide-react'

export default function VerificationPanel() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight">Verification Panel</h3>
            <p className="text-slate-500 text-sm">
              Validate an existing ESG proof by entering the transaction hash or batch ID below.
            </p>
          </div>
          
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="Enter Proof Hash (0x...)" 
                type="text"
              />
            </div>
            <button className="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Verify
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 flex items-center gap-5 pr-12 min-w-[280px]">
            <div className="size-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                Current Status
              </p>
              <h4 className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Verified</h4>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                Identity & Data Match Chain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
