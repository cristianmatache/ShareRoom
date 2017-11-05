import {Review} from "./review";
import {Item} from "./item";

export interface User {
  uid: string;
  email: string;
  password?: string;
  profile_picture: string;
  display_name: string;
  emailVerified: boolean;
  phoneNumber: string;
  reviews: Array<Review>;
  items: Array<Item>;
}
