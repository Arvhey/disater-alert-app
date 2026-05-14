import { Phone, Shield, Flame, Heart, Info } from 'lucide-react';

const HOTLINES = [
  {
    name: 'PNP Polomolok',
    number: '09985987158',
    description: 'Philippine National Police',
    icon: Shield,
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    name: 'BFP Polomolok',
    number: '09177148119',
    description: 'Bureau of Fire Protection',
    icon: Flame,
    color: 'bg-red-50 text-red-700 border-red-100',
  },
  {
    name: 'MDRRMO Polomolok',
    number: '09756885138',
    description: 'Disaster Risk Reduction Office',
    icon: Info,
    color: 'bg-brand-50 text-brand-700 border-brand-100',
  },
  {
    name: 'Municipal Health Office',
    number: '083-500-2445',
    description: 'Emergency Medical Services',
    icon: Heart,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
];

const Hotlines = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Emergency Hotlines</h1>
        <p className="text-slate-500 mt-1">Tap any number to call immediately. Available 24/7.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOTLINES.map((item) => (
          <a
            key={item.name}
            href={`tel:${item.number}`}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-md active:scale-[0.98] ${item.color}`}
          >
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <item.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-500 mb-1">{item.description}</p>
              <p className="text-lg font-mono font-bold">{item.number}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Phone className="h-5 w-5" />
            </div>
          </a>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Calling Tip</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            When calling, state your name, exact location, and the nature of the emergency clearly. 
            Stay on the line until the operator confirms they have all the information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hotlines;
