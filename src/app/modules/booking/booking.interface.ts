import { Types, Model } from "mongoose";

// Booking Interface
export interface TBooking {
  room: Types.ObjectId;
  slots: Types.ObjectId[];
  user: Types.ObjectId;
  date: String;
  totalAmount: number;
  isConfirmed: "confirmed" | "unconfirmed" | "canceled";
  isDeleted?: boolean;
  // isApproved?: String;
}

export interface BookingModel extends Model<TBooking> {
  getByIdWithDetails(id: Types.ObjectId): Promise<TBooking | null>;
}
