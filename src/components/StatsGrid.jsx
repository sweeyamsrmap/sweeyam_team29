import { Factory, Link, Zap, Coins } from 'lucide-react'

export default function StatsGrid() {
  const stats = [
    {
      icon: Factory,
      label: 'Total Facilities',
      value: '42',
      badge: '+12%',
      badgeColor: 'text-green-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-500'
    },
    {
      icon: Link,
      label: 'Active Oracles',
      value: '128',
      badge: 'Live',
      badgeColor: 'text-green-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      iconColor: 'text-purple-500'
    },
    {
      icon: Zap,
      label: 'Avg Grid Intensity',
      value: '245',
      unit: 'g/kWh',
      badge: 'Stable',
      badgeColor: 'text-slate-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      iconColor: 'text-amber-500'
    },
    {
      icon: Coins,
      label: 'Carbon Offset Credit',
      value: '12,450',
      badge: 'YTD',
      badgeColor: 'text-slate-400',
      bgColor: 'bg-rose-50 dark:bg-rose-900/30',
      iconColor: 'text-rose-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 ${stat.bgColor} rounded-lg ${stat.iconColor}`}>
              <stat.icon size={20} />
            </div>
            <span className={`${stat.badgeColor} text-xs font-bold`}>{stat.badge}</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">{stat.label}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stat.value}
            {stat.unit && <span className="text-sm font-normal text-slate-400"> {stat.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
