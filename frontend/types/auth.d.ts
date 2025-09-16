export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};