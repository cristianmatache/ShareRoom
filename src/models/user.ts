export interface User {
  uid: string;
  email: string;
  password?: string;
  profile_picture: string;
  display_name: string;
  emailVerified: boolean;
  phoneNumber: string;
}
