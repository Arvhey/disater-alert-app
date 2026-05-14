import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen, size = 'default' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const content = (
    <div className="flex items-center justify-center text-brand-600">
      <Loader2 className={`animate-spin ${sizes[size]}`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 items-center justify-center">
        {content}
        <p className="mt-4 text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  return content;
};

export default Loader;
