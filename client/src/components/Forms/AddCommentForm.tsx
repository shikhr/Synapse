import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import Button from '../UI/Button';
import FloatTextarea from '../UI/FloatTextarea';

interface AddCommentFormProps {
  id: string;
}
interface IAddCommentFormFields {
  content: string;
}
const validationAddCommentSchema = yup.object().shape({
  content: yup.string().required().max(1000),
});

const AddCommentForm = ({ id }: AddCommentFormProps) => {
  const { authFetch } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<IAddCommentFormFields>({
    resolver: yupResolver(validationAddCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  const addCommentHandler = async (data: any) => {
    return authFetch.post(`/comments/post/${id}`, data);
  };

  const { mutate: addComment, isLoading } = useMutation(addCommentHandler, {
    onSuccess() {
      reset();
      queryClient.invalidateQueries(['commentList', id]);
    },
  });

  const submitHandler: SubmitHandler<IAddCommentFormFields> = (data) => {
    console.log(data);
    if (!data.content) return;
    addComment(data);
  };

  return (
    <div className="w-full flex justify-center border-b border-text-secondary-dark">
      <form
        className="w-full pt-6 px-4 flex flex-col gap-2 pb-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="grid grid-cols-[1fr_auto] group w-full gap-y-6">
          <fieldset className="row-start-1 w-full peer">
            <FloatTextarea
              register={register}
              label="Have something to say?"
              errors={errors}
              fieldName="content"
            />
          </fieldset>
          <div className="w-24 xs:w-28 ml-4 group-focus-within:row-start-2 group-focus-within:ml-auto">
            <Button type="submit" variant="primary">
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddCommentForm;
