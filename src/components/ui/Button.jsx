import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all duration-300 focus:outline-none disabled:opacity-30 disabled:pointer-events-none active:scale-95 border';

  const variants = {
    primary: 'bg-brand-600 text-white border-brand-400/50 hover:bg-brand-500 shadow-lg shadow-brand-600/20',
    secondary: 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-600 text-white border-red-400/50 hover:bg-red-500 shadow-lg shadow-red-600/20',
    ghost: 'bg-transparent text-white/40 border-transparent hover:bg-white/5 hover:text-white',
    success: 'bg-emerald-600 text-white border-emerald-400/50 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20',
    white: 'bg-white text-brand-950 border-white hover:bg-white/90 shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] gap-2',
    md: 'px-6 py-3.5 text-[11px] sm:text-xs gap-2.5',
    lg: 'px-8 py-4 text-xs sm:text-sm gap-3',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
