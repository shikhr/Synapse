import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FloatInput from '../UI/FloatInput';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';
import { FaTimes } from 'react-icons/fa';
import Button from '../UI/Button';
import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import FloatTextarea from '../UI/FloatTextarea';
import { IEditFormFields } from '../../types/Register.types';
import DynamicNavTitle from '../UI/DynamicNavTitle';

const EditProfileForm = () => {
  const navigate = useNavigate();
  const { user, getProfile } = useAppContext();

  const { isLoading, data: profile } = useQuery(['profile', 'me'], getProfile);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IEditFormFields>();
  useEffect(() => {
    console.log(watch('image')?.[0]);
  });
  const closeFormHandler = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <Overlay closeModal={closeFormHandler} />
      <Modal>
        <div className="px-4 relative isolate sm:px-16 pb-4">
          <div className="pt-4 text-text-primary-dark  pb-2 sticky z-20 top-0 left-0 flex justify-start items-center bg-opacity-90 bg-background-dark backdrop-blur-md">
            <button onClick={closeFormHandler} className="text-white text-xl">
              <FaTimes />
            </button>
            <div className="text-white px-4 font-semibold text-xl">
              <h2>Edit Profile</h2>
            </div>
            <div className="ml-auto w-20">
              <Button onClick={() => {}} variant="standard">
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-10 w-full py-4">
            <div className="relative w-28 h-28">
              <div className="w-full h-full rounded-full group overflow-hidden border border-background-overlay-dark">
                <input
                  className="absolute cursor-pointer opacity-0 inset-0 w-full h-full"
                  placeholder=" "
                  type="file"
                  {...register('image')}
                />
                <img
                  className="w-full h-full object-cover"
                  src={
                    (watch('image')?.[0] &&
                      URL.createObjectURL((watch('image') as FileList)[0])) ||
                    `/api/v1/users/avatar/${profile?.avatarId}`
                  }
                  alt=""
                />
              </div>
              {watch('image')?.[0] && (
                <button
                  onClick={() => setValue('image', undefined)}
                  className="absolute text-xl text-red-500 cursor-pointer bottom-0 -right-6"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <FloatInput
              register={register}
              fieldName="displayName"
              label="Display Name"
              errors={errors}
              defaultVal={profile?.displayName}
            />
            <FloatTextarea
              register={register}
              fieldName="bio"
              label="Bio"
              errors={errors}
              defaultVal={profile?.bio}
            />
            <FloatInput
              register={register}
              fieldName="location"
              label="Location"
              errors={errors}
              defaultVal={profile?.location}
            />
            <FloatInput
              register={register}
              fieldName="website"
              label="Website"
              errors={errors}
              defaultVal={profile?.website}
            />
            <FloatInput
              register={register}
              fieldName="birthDate"
              label="BirthDate"
              errors={errors}
              type="date"
              defaultVal={profile?.birthDate}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EditProfileForm;
