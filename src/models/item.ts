export interface Item {
  name: string;
  location: Array<number>;
  owner_uid: string;
  picture: string;
  description: string;
  date_posted: number;
}

enum ItemType {
  FOR_SWAP,
  FOR_FREE,
  FOR_LOAN,
}
