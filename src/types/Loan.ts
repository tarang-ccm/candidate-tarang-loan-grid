export type Loan = {
  id: number;
  borrowerName: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  closeDate: string;
};
