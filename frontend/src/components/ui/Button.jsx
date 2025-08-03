const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    success: 'btn-success',
    outline: 'btn-outline',
    danger: 'btn-danger',
    text: 'bg-transparent text-primary hover:underline',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;