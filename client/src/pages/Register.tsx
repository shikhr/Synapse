import logo from '../assets/logo/svg/logo-full.svg';
import RegisterForm from '../components/Forms/RegisterForm';

const Register = () => {
  return (
    <div className="bg-background-dark flex flex-col items-center min-h-screen">
      <div className="pt-4 w-48 sm:w-60">
        <img src={logo} alt="logo" />
      </div>
      <div className="flex-1 w-full flex sm:items-center sm:justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
