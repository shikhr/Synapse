import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import logo from '../assets/logo/svg/logo-full.svg';
import RegisterForm from '../components/Forms/RegisterForm';

const Register = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  return (
    <div className="bg-background-dark flex flex-col items-center min-h-screen">
      <div className="py-4 sm:flex sm:flex-1 max-h-40 justify-center items-center w-48 sm:w-60">
        <img src={logo} alt="logo" />
      </div>
      <div className="flex-1 w-full flex sm:items-center sm:justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
