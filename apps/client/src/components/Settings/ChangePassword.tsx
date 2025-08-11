import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import Button from '../UI/Button';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import FloatInput from '../UI/FloatInput';
interface IEditPassword {
  oldPassword: string;
  newPassword: string;
}
const validationPassword = yup.object().shape({
  oldPassword: yup.string().min(8).required(),
  newPassword: yup.string().min(8).required(),
});

const ChangePassword = () => {
  const { authFetch } = useAppContext();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<IEditPassword>({
    resolver: yupResolver(validationPassword),
  });

  const passwordChangeHandler = async (data: IEditPassword) => {
    return authFetch.patch('/settings/change-password', data);
  };

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: passwordChangeHandler,

    onError: (error: AxiosError, variables, context) => {
      const data: any = error.response!.data;
      data.fields.forEach((field: any) => {
        setError(field, { type: 'server', message: data.msg });
      });
    },
  });

  const submitHandler: SubmitHandler<IEditPassword> = (data) => {
    console.log(data);
    changePassword(data);
  };

  return (
    <div>
      <DynamicNavTitle title="Change Password" />
      <form onSubmit={handleSubmit(submitHandler)} className="px-4 pt-8 pb-12">
        <div className="flex flex-col gap-10 pb-10">
          <FloatInput
            register={register}
            fieldName="oldPassword"
            label="Old Password"
            errors={errors}
            type="password"
          />
          <FloatInput
            register={register}
            fieldName="newPassword"
            label="New Password"
            errors={errors}
            type="password"
          />
        </div>
        <Button disabled={isPending} type="submit" variant="primary">
          Save
        </Button>
      </form>
      <div className="px-4 flex gap-4 flex-col pb-8">
        <span className="border-b  border-text-secondary-dark"></span>
        <div className="text-text-secondary-dark text-center">
          If you don't remember your password or logged in using google
        </div>
        <Button disabled={isPending} type="submit" variant="standard">
          Reset Password
        </Button>
      </div>
    </div>
  );
};
export default ChangePassword;
