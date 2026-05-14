import { Bell } from 'lucide-react';

const Footer = () => (
  <footer className="mt-auto py-8 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
          <Bell className="h-4 w-4 text-brand-400" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Polomolok Alert Terminal</p>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        MDRRMO Polomolok &copy; {new Date().getFullYear()} • Secure Connection Active
      </p>
    </div>
  </footer>
);

export default Footer;
