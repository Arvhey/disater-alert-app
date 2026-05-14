import { Bell } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white mt-auto">
    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Bell className="h-4 w-4 text-brand-600" />
        <span>Polomolok Disaster Alert &amp; Community Reporting System</span>
      </div>
      <p className="text-xs text-slate-400">
        Municipality of Polomolok, South Cotabato &copy; {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
