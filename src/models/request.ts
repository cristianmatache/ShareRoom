export interface Request {
  requester_uid: string;
  requester_name: string;
  requester_picture: string;

  owner_uid: string;
  owner_picture: string;

  borrow_time: number;
  max_borrow_duration: number;
  type: string;
}
