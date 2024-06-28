import { useForm } from 'react-hook-form';
import FloatInput from '../UI/FloatInput';
import { FaTimes } from 'react-icons/fa';
import Button from '../UI/Button';
import FloatTextarea from '../UI/FloatTextarea';
import { IEditFormFields, IUserProfile } from '../../types/Register.types';
import { SubmitHandler } from 'react-hook-form/dist/types/form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';

interface EditProfileFormProps {
  profile: IUserProfile;
  closeHandler: () => void;
  updateProfile: UseMutateFunction<any, unknown, FormData, unknown>;
}

const validationProfileSchema = yup.object().shape({
  bio: yup.string().max(150),
  avatar: yup.mixed().test('is-big-file', 'file is too big', function (value) {
    if (!value || !(value instanceof FileList)) {
      return true;
    }
    return value.length === 0 || value[0].size < 1048576;
  }),
  displayName: yup.string().max(30).required(),
  location: yup.string().max(30),
  birthDate: yup.string().nullable().typeError('Invalid Date'),
  website: yup.string().max(60),
});

const EditProfileForm = ({
  profile,
  closeHandler,
  updateProfile,
}: EditProfileFormProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    resetField,
    formState: { errors, dirtyFields },
  } = useForm<IEditFormFields>({
    resolver: yupResolver(validationProfileSchema),
    defaultValues: {
      avatar: undefined,
      bio: profile.bio || '',
      birthDate: profile.birthDate
        ? format(new Date(profile.birthDate as string), 'yyyy-MM-dd')
        : null,
      displayName: profile.displayName || '',
      location: profile.location || '',
      website: profile.website || '',
    },
  });
  const [showEditBirthDate, setShowEditBirthDate] = useState(false);

  const submitHandler: SubmitHandler<IEditFormFields> = (data) => {
    const touchedFields = Object.keys(dirtyFields);
    if (touchedFields.length === 0) {
      closeHandler();
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (touchedFields.includes(key)) {
        if (key === 'avatar' && data.avatar) {
          formData.set('avatar', data.avatar[0]);
        } else if (key === 'birthDate') {
          formData.set('birthDate', value);
        } else {
          formData.set(key, value);
        }
      }
    });
    updateProfile(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="px-4 relative isolate sm:px-16 pb-4 h-full overflow-auto"
    >
      <div className="pt-4 text-text-primary-dark  pb-2 sticky z-20 top-0 left-0 flex justify-start items-center bg-opacity-90 bg-background-dark backdrop-blur-md">
        <button onClick={closeHandler} className="text-white text-xl">
          <FaTimes />
        </button>
        <div className="text-white px-4 font-semibold text-xl">
          <h2>Edit Profile</h2>
        </div>
        <div className="ml-auto w-20">
          <Button onClick={() => {}} type="submit" variant="standard">
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-10 w-full py-4">
        <div className="relative w-28 h-28 mb-4">
          <div className="w-full h-full rounded-full group overflow-hidden border border-background-overlay-dark">
            <input
              className="absolute cursor-pointer opacity-0 inset-0 w-full h-full"
              placeholder=" "
              type="file"
              {...register('avatar')}
            />
            <img
              className="w-full h-full object-cover"
              src={
                (watch('avatar')?.[0] &&
                  URL.createObjectURL((watch('avatar') as FileList)[0])) ||
                `/api/v1/users/avatar/${profile?.avatarId}`
              }
              alt=""
            />
          </div>
          {watch('avatar')?.[0] && (
            <button
              onClick={() => resetField('avatar')}
              className="absolute text-xl text-red-500 cursor-pointer bottom-0 -right-6"
            >
              <FaTimes />
            </button>
          )}
          <div className="text-error text-xs py-1">
            {errors['avatar'] && errors['avatar']?.message && (
              <span className="lowercase">
                {String(errors['avatar'].message)}
              </span>
            )}
          </div>
        </div>

        <FloatInput
          register={register}
          fieldName="displayName"
          label="Display Name"
          errors={errors}
        />
        <FloatTextarea
          register={register}
          fieldName="bio"
          label="Bio"
          errors={errors}
        />
        <FloatInput
          register={register}
          fieldName="location"
          label="Location"
          errors={errors}
        />
        <FloatInput
          register={register}
          fieldName="website"
          label="Website"
          errors={errors}
        />
        {!showEditBirthDate && (
          <button
            className="w-fit relative flex gap-4 text-text-primary-dark"
            onClick={() => setShowEditBirthDate(true)}
          >
            <span className="absolute scale-75 origin-left -translate-y-6 text-text-secondary-dark top-0 left-0">
              Birth Date
            </span>
            {profile.birthDate && (
              <div className="">
                {format(new Date(profile.birthDate), 'MMM dd, yyyy')}
              </div>
            )}
            <span className="text-primary-100">
              {!profile.birthDate && 'Add Birth Date'}
              {profile.birthDate && 'Edit Birth Date'}
            </span>
          </button>
        )}
        {showEditBirthDate && (
          <div className="relative">
            <button
              onClick={() => {
                setShowEditBirthDate(false);
                resetField('birthDate');
              }}
              className="absolute -translate-y-6 z-40 scale-90 text-primary-100 top-0 right-0"
            >
              Cancel
            </button>
            <FloatInput
              register={register}
              fieldName="birthDate"
              label="Birth Date"
              errors={errors}
              type="date"
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default EditProfileForm;
