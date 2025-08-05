import { FormInputLabel, Input, Group } from './form-input.styles';
import { InputHTMLAttributes, FC } from 'react';

type FormInputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<FormInputProps> = ({ label, ...otherProps }) => {
  const shrink = !!otherProps.value?.toString().length;

  return (
    <Group>
      <Input {...otherProps} />
      {label && <FormInputLabel $shrink={shrink}>{label}</FormInputLabel>}
    </Group>
  );
};

export default FormInput;