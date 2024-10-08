import { Schema, model, Types } from "mongoose";
import { TBooking, BookingModel } from "./booking.interface";

// create schema for booking
const bookingSchema = new Schema<TBooking, BookingModel>({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  slots: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  isConfirmed: {
    type: String,
    enum: ["confirmed", "unconfirmed", "canceled"],
    default: "unconfirmed",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  // isApproved: {
  //   type: String,
  // },
});

// retrieve booking details with populated fields
bookingSchema.statics.getByIdWithDetails = function (
  bookingId: Types.ObjectId
) {
  return this.findOne({ _id: bookingId })
    .populate("room")
    .populate("slots")
    .populate("user");
};

export const Booking = model<TBooking, BookingModel>("Booking", bookingSchema);
