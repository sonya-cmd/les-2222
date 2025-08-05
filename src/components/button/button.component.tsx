import {
  BaseButton,
  GoogleSignInButton,
  InvertedButton,
  ButtonSpinner,
} from './button.styles';

import { BUTTON_TYPE_CLASSES, ButtonType } from './button.types';
import { FC, ButtonHTMLAttributes } from 'react';

const getButton = (buttonType: ButtonType = 'base') => ({
  base: BaseButton,
  google: GoogleSignInButton,
  inverted: InvertedButton,
}[buttonType]);

export type ButtonProps = {
  children: React.ReactNode;
  buttonType?: ButtonType;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({
  children,
  buttonType = 'base',
  isLoading = false,
  ...otherProps
}) => {
  const CustomButton = getButton(buttonType);
  return (
    <CustomButton disabled={isLoading || otherProps.disabled} {...otherProps}>
      {isLoading ? <ButtonSpinner /> : children}
    </CustomButton>
  );
};

export default Button;