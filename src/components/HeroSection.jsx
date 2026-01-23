export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900 h-64 flex items-center px-12 shadow-xl">
      <div 
        className="absolute inset-0 opacity-40" 
        style={{
          backgroundImage: 'linear-gradient(45deg, #13b6ec 25%, transparent 25%), linear-gradient(-45deg, #13b6ec 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #13b6ec 75%), linear-gradient(-45deg, transparent 75%, #13b6ec 75%)',
          backgroundSize: '40px 40px'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      
      <div className="relative z-10 max-w-2xl">
        <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block">
          Enterprise Edition
        </span>
        <h1 className="text-4xl font-black text-white mb-3">Trustless ESG Verification</h1>
        <p className="text-slate-300 text-lg">
          Verify carbon footprints and supply chain transparency with immutable blockchain proofs. 
          Real-time auditing for the modern enterprise.
        </p>
      </div>
      
      <div className="absolute right-12 bottom-0 hidden lg:block">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-t-xl border-x border-t border-white/10 w-64 h-48 flex flex-col justify-end">
          <div className="text-primary text-3xl font-bold mb-1">2.4M</div>
          <p className="text-slate-400 text-xs uppercase font-bold">tCO2e Verified</p>
          <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
