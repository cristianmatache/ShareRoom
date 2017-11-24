export interface Shout {
  name: string;
  picture: string;
  type: string;
  location: Array<number>;

  shouter_uid: string;
  shouter: string;

  borrow_time: number;
  max_borrow_duration: number;
}
