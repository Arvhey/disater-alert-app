import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClass = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-2 ${containerClass}`}>
      {label && (
        <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-white/20 group-focus-within:text-brand-400 transition-colors" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border bg-white/5 backdrop-blur-xl px-4 py-2 text-white text-sm sm:text-base
            placeholder:text-white/10 transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10
            disabled:cursor-not-allowed disabled:opacity-30
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : 'border-white/10'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mt-1.5 ml-1">{error}</p>}
      {helperText && !error && <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1.5 ml-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
