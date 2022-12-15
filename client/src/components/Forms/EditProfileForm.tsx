import { useForm } from 'react-hook-form';
import FloatInput from '../UI/FloatInput';
import { FaTimes } from 'react-icons/fa';
import Button from '../UI/Button';
import FloatTextarea from '../UI/FloatTextarea';
import { IEditFormFields, IUserProfile } from '../../types/Register.types';
import { SubmitHandler } from 'react-hook-form/dist/types/form';

interface EditProfileFormProps {
  profile: IUserProfile;
  closeHandler: () => void;
}
const EditProfileForm = ({ profile, closeHandler }: EditProfileFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    resetField,
    formState: { errors, dirtyFields },
  } = useForm<IEditFormFields>({
    defaultValues: {
      avatar: undefined,
      bio: profile.bio || '',
      birthDate: profile.birthDate,
      displayName: profile.displayName || '',
      location: profile.location || '',
      website: profile.website || '',
    },
  });

  const submitHandler: SubmitHandler<IEditFormFields> = (data) => {
    console.log(data);
    const { bio, birthDate, displayName, avatar, location, website } = data;
    const formData = new FormData();
    if (avatar?.[0]) {
      formData.set('avatar', avatar[0]);
    }
    console.log(dirtyFields);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="px-4 relative isolate sm:px-16 pb-4"
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
        <div className="relative w-28 h-28">
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
        <FloatInput
          register={register}
          fieldName="birthDate"
          label="BirthDate"
          errors={errors}
          type="date"
        />
      </div>
    </form>
  );
};

export default EditProfileForm;
