import {User} from "./user";

export interface Item {
  name: string;
  location: Array<number>;
  owner_uid: string;
  picture: string;
  description: string;
  date_posted: number;
  type: string;
  borrower_uid : string;
  borrowTime: number;
  returnTime: number;
}

export let ItemType = {
  SWAP: "SWAP",
  FREE: "FREE",
  LOAN: "LOAN",
};
