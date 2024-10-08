import { Schema, model } from "mongoose";
import { TRoom } from "./room.interface";

// create schema for room
const roomSchema = new Schema<TRoom>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  roomNo: {
    type: Number,
    required: true,
    unique: true,
  },
  floorNo: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerSlot: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  // images: {
  //   type: [String],
  //   required: true,
  // },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// create model for room
export const RoomModel = model<TRoom>("Room", roomSchema);
