import { SubmitHandler, useForm } from 'react-hook-form';
import { BsImageFill } from 'react-icons/bs';
import Button from '../UI/Button';
import FloatTextarea from '../UI/FloatTextarea';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaTimes } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IAddPostFormFields {
  description: string;
  media?: FileList | undefined;
}

const validationAddPostSchema = yup.object().shape({
  description: yup.string().required().max(1000),
  media: yup
    .mixed()
    .notRequired()
    .test('fileListLength', 'number of images exceeds 3', (value) => {
      return !value || value.length <= 3;
    }),
});

const AddPostForm = () => {
  const { authFetch } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<IAddPostFormFields>({
    resolver: yupResolver(validationAddPostSchema),
    defaultValues: {
      description: '',
      media: undefined,
    },
  });

  const addPostHandler = async (formdata: FormData) => {
    return authFetch.post('/posts', formdata);
  };

  const { mutate: addPost, isLoading } = useMutation(addPostHandler, {
    onSuccess() {
      reset();
      queryClient.invalidateQueries(['feed']);
    },
  });

  const submitHandler: SubmitHandler<IAddPostFormFields> = (data) => {
    const formData = new FormData();
    formData.append('description', data.description);
    if (data.media && data.media?.length > 0) {
      for (const file of data.media) {
        formData.append('media', file);
      }
    }
    console.log(formData);
    addPost(formData);
  };

  return (
    <div className="w-full flex justify-center border-b border-text-gray">
      <form
        className="w-full pt-6 px-4 flex flex-col gap-2 pb-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <fieldset disabled={isLoading}>
            <FloatTextarea
              register={register}
              label="What's happening?"
              errors={errors}
              fieldName="description"
            />
          </fieldset>
        </div>

        <div className="relative max-h-80 w-full flex pt-4">
          {watch('media') &&
            (watch('media') as FileList).length > 0 &&
            Array.from(watch('media') as FileList).map((file, index) => (
              <div
                key={index}
                className="flex-1 h-full overflow-hidden rounded-md"
              >
                <img
                  className="h-full w-full object-cover bg-center"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
              </div>
            ))}

          {watch('media') && (watch('media') as FileList).length > 0 && (
            <div
              onClick={() => resetField('media')}
              className="absolute top-6 right-2 bg-background-dark text-red-500 aspect-square flex items-center justify-center p-1 cursor-pointer rounded-full"
            >
              <FaTimes />
            </div>
          )}
        </div>

        <div className="text-error text-xs ml-auto">
          {errors['media'] && errors['media']?.message && (
            <span className="lowercase">{errors['media'].message}</span>
          )}
        </div>

        <div className="">
          <label
            htmlFor="attachment"
            className={`flex text-primary-200 cursor-pointer hover:text-primary-100 ${
              isLoading && 'pointer-events-none'
            } text-sm duration-300 items-center gap-2`}
          >
            <BsImageFill className="text-2xl" />
            <span>Add media</span>
          </label>
          <input
            className="hidden"
            id="attachment"
            type="file"
            accept="image/png, image/jpeg,"
            multiple
            disabled={isLoading}
            {...register('media')}
          />
        </div>

        <div className="ml-auto w-28">
          <Button disabled={isLoading} type="submit" variant="primary">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddPostForm;
