export const BUTTON_TYPE_CLASSES = {
  base: 'base',
  google: 'google-sign-in',
  inverted: 'inverted',
} as const;

export type ButtonType = keyof typeof BUTTON_TYPE_CLASSES;