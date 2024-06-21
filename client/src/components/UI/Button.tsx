interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (params?: any) => any;
  variant: 'primary' | 'standard' | 'danger';
  disabled?: boolean | undefined;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  children,
  type = 'button',
  onClick,
  variant,
  disabled,
}: PrimaryButtonProps) => {
  const colorStyles = {
    primary:
      'bg-primary-100 hover:bg-primary-200 disabled:bg-primary-200 text-text-primary-dark',
    standard:
      'bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-background-dark',
    danger:
      'bg-red-600 hover:bg-red-700 disabled:bg-red-700 text-text-primary-dark ',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${colorStyles[variant]} p-2 w-full disabled:cursor-not-allowed rounded-full capitalize font-semibold transition-colors duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
