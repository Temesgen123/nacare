export default function Checkbox({ 
  label, 
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`flex items-center mb-3 ${className}`}>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        {...props}
      />
      {label && (
        <label 
          htmlFor={name} 
          className={`ml-2 text-sm text-gray-700 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
