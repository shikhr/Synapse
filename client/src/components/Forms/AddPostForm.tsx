import { useForm } from 'react-hook-form';
import { BsImageFill } from 'react-icons/bs';
import Button from '../UI/Button';
import FloatTextarea from '../UI/FloatTextarea';

interface IAddPostFormFields {
  description: string;
  media?: FileList | undefined;
}

const AddPostForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IAddPostFormFields>();

  const submitHandler = () => {};

  return (
    <div className="w-full flex justify-center border-b border-text-gray">
      <form
        className="w-full pt-6 px-4 flex flex-col gap-2 pb-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <FloatTextarea
            register={register}
            label="What's happening?"
            errors={errors}
            fieldName="description"
          />
        </div>

        <div className="relative max-h-60 w-full flex">
          {watch('media') &&
            (watch('media') as FileList).length > 0 &&
            Array.from(watch('media') as FileList).map((file, index) => (
              <div
                key={index}
                className="flex-1 h-full overflow-hidden rounded-md"
              >
                <img
                  className="h-full object-cover"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
              </div>
            ))}
        </div>

        <div className="">
          <label
            htmlFor="attachment"
            className="flex text-primary-200 cursor-pointer hover:text-primary-100 text-sm duration-300 items-center gap-2"
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
            {...register('media')}
          />
        </div>
        <div className="ml-auto w-28">
          <Button type="submit" variant="primary">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddPostForm;
