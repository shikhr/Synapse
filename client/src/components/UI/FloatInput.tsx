import { FieldValues, UseFormRegister } from 'react-hook-form';

interface FloatInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  fieldName: any;
  label: string;
  type?: string;
  errors?: any;
}

const FloatInput = <T extends FieldValues>({
  register,
  fieldName,
  label,
  type = 'text',
  errors,
}: FloatInputProps<T>) => {
  return (
    <div className="w-full relative isolate border-b-2 border-text-secondary-dark focus-within:border-primary-100">
      <input
        className={`btn-float ${
          errors[fieldName] && 'error'
        } block w-full pb-2 bg-transparent appearance-none outline-none text-text-primary-dark transition-colors duration-300`}
        placeholder=" "
        type={type}
        {...register(fieldName)}
      />
      <label className="absolute -z-1 text-text-secondary-dark top-0 origin-left duration-300">
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

export default FloatInput;
