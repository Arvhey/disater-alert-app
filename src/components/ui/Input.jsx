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
    <div className={`space-y-1 ${containerClass}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm
            placeholder:text-slate-400 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-medium mt-1 ml-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 mt-1 ml-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
