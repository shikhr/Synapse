interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => any;
  variant: 'primary' | 'standard';
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  children,
  type = 'button',
  onClick,
  variant,
}: PrimaryButtonProps) => {
  const colorStyles = {
    primary: 'bg-primary-100 hover:bg-primary-200 text-text-primary-dark',
    standard: 'bg-gray-300 hover:bg-gray-400 text-background-dark',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${colorStyles[variant]} p-2 w-full rounded-full capitalize font-semibold transition-colors duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
