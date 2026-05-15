import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] shadow-2xl w-full ${sizes[size]} flex flex-col max-h-[95vh] overflow-hidden`}>
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-7 border-b border-white/5 bg-white/5">
          <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
        {footer && <div className="px-6 sm:px-8 py-5 sm:py-6 border-t border-white/5 bg-white/5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
