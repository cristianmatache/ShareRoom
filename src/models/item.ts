import {User} from "./user";

export interface Item {
  id: string;
  name: string;
  location: Array<number>;
  owner_uid: string;
  picture: string;
  description: string;
  date_posted: number;
  type: string;
  borrower_uid : string;
  borrow_time: number;
  return_time: number;
  max_borrow_duration: number;
  category: string;
  requesters: Array<string>;
}

// TODO: I plagiaried categories from shpock, might want to change them.
// TODO: add constants for category names.

export let ItemType = {
  SWAP: "SWAP",
  FREE: "FREE",
  LOAN: "LOAN",
};
