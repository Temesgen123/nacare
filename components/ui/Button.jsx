export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };
  
  const variantClass = variants[variant] || variants.primary;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
