import { Search, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Overview</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Search proofs, hashes..." 
            type="text"
          />
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              alt="Corporate user profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCzzabEhUxeJAwNndfu2tiOPaNMFfJk7Ecbb-Tn_8BK25yRtcP9jpOabU3n34ygx17cC0jCOnGPqrAmkha8o-NunikI1m1XMmOcNDey3j8PmT6HHtz132E49yjoYXaK2UeYgUz3xTGyy85mLSg_yUJ-NDbsJRqfIh0LOPxdZzyFkfsYq7FtgQ1ES-fKw7aYPwrik1qcODXB03-aIQuBNC9FMTc_SYfeD9aaGSGjjl8E-JICvYaryCyT2aPshvJJq_mUNPVDI7MPHI_"
            />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">EcoCorp Admin</span>
        </div>
      </div>
    </header>
  )
}
