import { Types } from "mongoose";

// Slot Interface
export interface TSlot {
  room: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isDeleted: boolean;
}
