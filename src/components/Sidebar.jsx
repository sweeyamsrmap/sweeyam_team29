import { Shield, LayoutDashboard, FileText, History, GitBranch, Settings, HelpCircle } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background-dark text-white hidden lg:flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">ESGChain</h1>
          <p className="text-xs text-slate-400">Enterprise Proof</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-4 space-y-1">
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary" href="#">
          <LayoutDashboard size={20} />
          <span className="text-sm font-medium">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" href="#">
          <FileText size={20} />
          <span className="text-sm font-medium">Submissions</span>
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" href="#">
          <History size={20} />
          <span className="text-sm font-medium">Verification History</span>
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" href="#">
          <GitBranch size={20} />
          <span className="text-sm font-medium">Supply Chain Map</span>
        </a>
        
        <div className="pt-4 mt-4 border-t border-slate-800">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" href="#">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" href="#">
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Support</span>
          </a>
        </div>
      </nav>
      
      <div className="p-4 bg-slate-900 m-4 rounded-xl">
        <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">Node Status</p>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-slate-300">Mainnet Connected</span>
        </div>
      </div>
    </aside>
  )
}
