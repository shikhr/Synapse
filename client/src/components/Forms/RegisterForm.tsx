import { spawn } from 'child_process';
import { useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../UI/Button';
import FloatInput from '../UI/FloatInput';
import OAuthButton from './OAuthButton';

interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  identity: string;
}
const validationLogin = {
  identity: yup.string().required(),
  username: yup.string().max(20),
  email: yup.string().email(),
  password: yup.string().min(8).max(40).required(),
};

const validationSignUp = {
  identity: yup.string(),
  username: yup.string().max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(40).required(),
};

const RegisterForm = () => {
  const [isLogin, setIsLogin] = useState<Boolean>(false);

  const validationScema = useMemo(
    () =>
      isLogin
        ? yup.object().shape(validationLogin)
        : yup.object().shape(validationSignUp),
    [isLogin]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IRegisterFields>({
    resolver: yupResolver(validationScema),
  });

  useEffect(() => {
    reset({
      username: '',
      email: '',
      password: '',
      identity: '',
    });
  }, [isLogin]);

  const submitHandler: SubmitHandler<IRegisterFields> = (data) => {
    console.log(data);
  };

  const loginToggleHandler = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="sm:bg-background-overlay-dark w-full max-w-2xl sm:w-11/12 px-4 sm:px-16 py-10 sm:rounded-md">
      <form
        className="flex flex-col w-full gap-4 items-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="w-full text-center pt-2 pb-8 font-bold text-gray-300 text-3xl">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h1>
        <div className="flex flex-col gap-10 w-full pb-4">
          {!isLogin && (
            <>
              <FloatInput<IRegisterFields>
                register={register}
                fieldName="username"
                label="Username"
                errors={errors}
              />
              <FloatInput<IRegisterFields>
                register={register}
                fieldName="email"
                label="Email"
                errors={errors}
              />
            </>
          )}
          {isLogin && (
            <FloatInput<IRegisterFields>
              register={register}
              fieldName="identity"
              label="Username or Email"
              errors={errors}
            />
          )}
          <FloatInput<IRegisterFields>
            type="password"
            register={register}
            fieldName="password"
            label="Password"
            errors={errors}
          />
        </div>
        <Button type="submit" variant="primary" onClick={() => {}}>
          {isLogin ? 'LOGIN' : 'SIGN UP'}
        </Button>

        <button type="button" className="text-text-secondary-dark w-fit">
          Forgot Password
        </button>

        <div className="relative w-full flex py-2 items-center">
          <div className="flex-grow border-t border-text-secondary-dark"></div>
          <span className="flex-shrink px-2 leading-none pb-1 text-xl text-text-secondary-dark">
            or
          </span>
          <div className="flex-grow border-t border-text-secondary-dark"></div>
        </div>

        <OAuthButton />

        <div className="flex gap-2 w-full justify-center">
          <span className="text-text-secondary-dark">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>

          <button
            type="button"
            className="text-primary-100 font-semibold"
            onClick={loginToggleHandler}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
