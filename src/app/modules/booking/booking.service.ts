/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { SlotModel } from "../slot/slot.model";
import { RoomModel } from "../room/room.model";
import { User } from "../user/user.model";
import { Booking } from "./booking.model";
import mongoose from "mongoose";

// add booking function
const addABooking = async (bookings: TBooking) => {
  // console.log("bookings:", bookings);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user information
    const user = await User.findById(bookings.user).session(session);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User does not exist");

    // Fetch room information
    const room = await RoomModel.findById(bookings.room).session(session);
    if (!room) throw new AppError(httpStatus.NOT_FOUND, "Room does not exist");

    console.log("bookings:", user, room);

    // Check availability of slots for the given date
    const availableSlots = await SlotModel.find({
      _id: { $in: bookings.slots },
      date: bookings?.date,
      isBooked: false,
    }).session(session);

    // Mark the selected slots as booked
    const slotIdsToUpdate = availableSlots.map((slot) => slot._id);
    await SlotModel.updateMany(
      { _id: { $in: slotIdsToUpdate } },
      { isBooked: true },
      { session }
    );

    const totalPrice = room.pricePerSlot * availableSlots.length;

    // console.log("totalPrice:", totalPrice);

    // Create a new booking record
    const newBooking = new Booking({
      room: bookings.room,
      slots: availableSlots,
      user: bookings.user,
      date: bookings?.date,
      totalAmount: totalPrice,
      isConfirmed: "unconfirmed",
      isDeleted: false,
    });

    console.log("newBooking 1:", newBooking);

    await newBooking.save({ session });

    // Populate the booking with related references
    await newBooking.populate([
      { path: "room" },
      { path: "slots" },
      { path: "user" },
    ]);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the booking record
    console.log("newBooking2:", newBooking);
    return newBooking;
  } catch (err) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();

    // Propagate the error for the controller
    throw new AppError(httpStatus.BAD_REQUEST, "Booking creation failed");
  }
};

// get all booking
const getAllBookings = async () => {
  const bookings = await Booking.find({ isDeleted: false }) // Exclude bookings where isDeleted is true
    .populate("room")
    .populate("slots")
    .populate("user");

  return bookings;
};

// get my-bookings
const getMyBookings = async (email: string) => {
  try {
    // Retrieve user based on email
    const userRecord = await User.findOne({ email });

    if (!userRecord) {
      throw new Error("user doesn't exist");
    }

    // Get bookings associated with the found user
    const result = await Booking.find({
      user: userRecord._id,
      isDeleted: false,
    })
      .populate("room")
      .populate("slots")
      .populate("user");

    return result;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
  }
};

// delete a booking
const deleteABooking = async (_id: string) => {
  try {
    // Find the booking by ID and mark it as deleted
    const deletedBooking = await Booking.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );

    // Check if the booking was found and deleted
    if (!deletedBooking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    return deletedBooking;
  } catch (error) {
    // Handle unexpected errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete booking"
    );
  }
};

// update a single booking
const updateABooking = async (
  bookingId: string,
  updatedInfo: Partial<TBooking>
) => {
  try {
    // Locate the booking and apply updates
    const bookingToUpdate = await Booking.findById(bookingId).populate("slots");

    if (!bookingToUpdate) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking does not exist");
    }

    // Update the booking with provided data and populate necessary fields
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: updatedInfo }, // partial updates without overwriting
      {
        new: true,
      }
    )
      .populate("room")
      .populate("slots")
      .populate("user");

    if (!updatedBooking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking could not be updated");
    }

    return updatedBooking;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to modify booking"
    );
  }
};

export const BookingServices = {
  addABooking,
  getAllBookings,
  getMyBookings,
  deleteABooking,
  updateABooking,
};
