import { takeLatest, put, all, call } from "typed-redux-saga/macro";
import { User, UserCredential } from "firebase/auth";
import { DocumentSnapshot } from "firebase/firestore";

import { USER_ACTION_TYPES } from "./user.types";
import {
  signInSuccess,
  signInFailed,
  signUpSuccess,
  signUpFailed,
  signOutSuccess,
  signOutFailed,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess,
} from "./user.action";

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword,
  signOutUser as firebaseSignOutUser,
  AdditionalInformation,
  UserData,
} from "../../utils/firebase/firebase.utils";

// 👤 Тип с id
type UserDataWithId = UserData & { id: string };

// 📌 Получение snapshot'а пользователя
export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AdditionalInformation
) {
  try {
    const userSnapshot = (yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    )) as DocumentSnapshot<UserData> | undefined;

    if (!userSnapshot || !userSnapshot.exists()) return;

    const userData = userSnapshot.data();
    if (!userData) return;

    const userWithId: UserDataWithId = {
      id: userSnapshot.id,
      ...userData,
    };

    yield* put(signInSuccess(userWithId));
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// 📌 Вход через Google
export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);
    yield* call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// 📌 Вход через email и пароль
export function* signInWithEmail({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userCredential = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (!userCredential) return;

    const { user } = userCredential;
    yield* call(getSnapshotFromUserAuth, user);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// 📌 Проверка текущего пользователя
export function* isUserAuthenticated() {
  try {
    const userAuth: User | null = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

// 📌 Регистрация
export function* signUp({
  payload: { email, password, displayName },
}: SignUpStart) {
  try {
    const userCredential = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    );

    if (!userCredential) return;

    const { user } = userCredential;

    yield* put(signUpSuccess(user, { displayName }));
  } catch (error) {
    yield* put(signUpFailed(error as Error));
  }
}

// 📌 Вход после регистрации
export function* signInAfterSignUp({
  payload: { user, additionalDetails },
}: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

// 📌 Выход
export function* signOut() {
  try {
    yield* call(firebaseSignOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

// 📌 Слушатели
export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

// 📌 Главная сага
export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
  ]);
}