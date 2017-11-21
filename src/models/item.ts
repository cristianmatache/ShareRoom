import {User} from "./user";
import {Request} from "./request";

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
  requests: Array<Request>;

  owner: string;
  borrower : string;

  borrow_readable_time: string;
  max_borrow_duration_readable_time: string;
  percentage_time: number;
}

// TODO: I plagiaried categories from shpock, might want to change them.
// TODO: add constants for category names.

export let ItemType = {
  SWAP: "SWAP",
  FREE: "FREE",
  LOAN: "LOAN",
};
