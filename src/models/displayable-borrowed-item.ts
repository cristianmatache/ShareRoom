export interface DisplayableBorrowedItem {
  name: string;
  picture: string;
  description: string;
  type: string;
  category: string;

  owner: string;
  borrower : string;

  borrow_time: string;
  max_borrow_duration: string;
  percentage_time: number;
}
