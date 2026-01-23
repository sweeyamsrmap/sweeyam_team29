import { Edit3, Coins } from 'lucide-react'

export default function SubmissionForm() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Edit3 className="text-primary" size={20} />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">ESG Data Submission</h3>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none" 
              type="text" 
              defaultValue="EcoCorp Logistics"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Batch ID</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none" 
              placeholder="e.g. BTC-2023-09" 
              type="text"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Emissions (tCO2e)</label>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none" 
              placeholder="0.00" 
              type="number"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Energy Source</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none">
              <option>Solar Energy</option>
              <option>Wind Power</option>
              <option>Grid (Mixed)</option>
              <option>Hydroelectric</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20" 
            type="button"
          >
            <Coins size={20} />
            Generate Blockchain Proof
          </button>
        </div>
      </form>
    </div>
  )
}
