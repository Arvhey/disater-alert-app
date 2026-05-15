import { Phone, Shield, Flame, Heart, Info } from 'lucide-react';

const HOTLINES = [
  {
    name: 'PNP Polomolok',
    number: '09985987158',
    description: 'Philippine National Police',
    icon: Shield,
    color: 'bg-brand-500/20 text-brand-300 border-brand-500/30 shadow-brand-500/10',
  },
  {
    name: 'BFP Polomolok',
    number: '09177148119',
    description: 'Bureau of Fire Protection',
    icon: Flame,
    color: 'bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/10',
  },
  {
    name: 'MDRRMO Polomolok',
    number: '09756885138',
    description: 'Disaster Risk Reduction Office',
    icon: Info,
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10',
  },
  {
    name: 'Municipal Health Office',
    number: '083-500-2445',
    description: 'Emergency Medical Services',
    icon: Heart,
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-rose-500/10',
  },
];

const Hotlines = () => {
  return (
    <div className="space-y-6 sm:space-y-10 relative z-10 max-w-5xl mx-auto px-1 sm:px-0">
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">Emergency Hotlines</h1>
        <p className="text-brand-100/60 font-medium mt-2 text-sm sm:text-base">Tap to call immediately. Available 24/7 ops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {HOTLINES.map((item) => (
          <a
            key={item.name}
            href={`tel:${item.number}`}
            className={`group flex items-center gap-4 sm:gap-6 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${item.color}`}
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group-hover:bg-white/10 transition-colors">
              <item.icon className="h-7 w-7 sm:h-10 sm:w-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-white mb-0.5 uppercase tracking-tight truncate">{item.name}</h3>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{item.description}</p>
              <p className="text-xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">{item.number}</p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-xl">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 flex flex-col sm:flex-row gap-6 shadow-2xl">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
          <Info className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <div>
          <h4 className="text-lg sm:text-xl font-black text-white mb-2 uppercase tracking-tight">Emergency Protocol</h4>
          <p className="text-sm sm:text-base text-brand-100/60 leading-relaxed font-medium">
            When calling, state your name, exact location, and nature of emergency. 
            Stay on the line until the operator confirms intel receipt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hotlines;
