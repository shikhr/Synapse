import { FieldValues, UseFormRegister } from 'react-hook-form';

interface FloatTextareaProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  fieldName: any;
  label: string;
  errors?: any;
  defaultVal?: any;
}

const FloatTextarea = <T extends FieldValues>({
  register,
  defaultVal,
  fieldName,
  label,
  errors,
}: FloatTextareaProps<T>) => {
  return (
    <div className="w-full relative isolate border-b-2 border-text-secondary-dark focus-within:border-primary-100">
      <textarea
        rows={1}
        className={`btn-float ${
          errors[fieldName] && 'error'
        } block w-full resize-none max-h-96 overflow-auto pb-2 bg-transparent appearance-none outline-none text-text-primary-dark transition-colors duration-300`}
        placeholder=" "
        defaultValue={defaultVal}
        onInput={(e) => {
          const elem = e.target as HTMLTextAreaElement;
          elem.style.height = '1px';
          elem.style.height = elem.scrollHeight + 'px';
        }}
        {...register(fieldName)}
      ></textarea>
      <label className="absolute -z-1 w-full whitespace-nowrap text-ellipsis overflow-hidden text-text-secondary-dark top-0 origin-left duration-300">
        {label}
      </label>
      <div className="absolute text-error top-full right-0 text-xs py-0.5">
        {errors[fieldName] && errors[fieldName]?.message && (
          <span className="lowercase">{errors[fieldName].message}</span>
        )}
      </div>
    </div>
  );
};

export default FloatTextarea;
