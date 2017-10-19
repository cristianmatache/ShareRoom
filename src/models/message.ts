import {User} from "./user";

export interface Message {
  text: String;
  from: User;
  at: Date;
}
