import { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { BUTTON_TYPE_CLASSES } from '../button/button.types';

import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import { setCurrentUser } from '../../store/user/user.action';

import { SignInContainer, ButtonsContainer } from './sign-in-form.styles';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      const userDoc = await createUserDocumentFromAuth(user);
      const userData = userDoc?.data();
      if (userData) {
        dispatch(setCurrentUser({
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          createdAt: userData.createdAt,
        }));
      }
    } catch (error) {
      console.log('Google sign-in error', error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCredential = await signInAuthUserWithEmailAndPassword(email, password);
      if (!userCredential) return;

      const { user } = userCredential;
      const userDoc = await createUserDocumentFromAuth(user);
      const userData = userDoc?.data();
      if (userData) {
        dispatch(setCurrentUser({
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          createdAt: userData.createdAt,
        }));
      }
      resetFormFields();
    } catch (error) {
      console.log('Email/password sign-in error', error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignInContainer>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <ButtonsContainer>
          <Button type="submit">Sign In</Button>
          <Button
  type="button"
  buttonType="google"
  onClick={signInWithGoogle}
>
  Google sign in
</Button>
        </ButtonsContainer>
      </form>
    </SignInContainer>
  );
};

export default SignInForm;
