import { Schema, model } from "mongoose";
import { TSlot } from "./slot.interface";

// create schema for slot
const slotSchema = new Schema<TSlot>({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// create model for slot
export const SlotModel = model<TSlot>("Slot", slotSchema);
