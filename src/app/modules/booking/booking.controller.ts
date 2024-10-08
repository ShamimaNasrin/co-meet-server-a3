import { BookingServices } from "./booking.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { verifyToken } from "../auth/auth.utils";

// add a booking
const addABooking = catchAsync(async (req, res) => {
  const result = await BookingServices.addABooking(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

// get all the bookings
const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookings();

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "bookings retrieved successfully",
      data: result,
    });
  }
});

const deleteABooking = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Booking Id");
  }

  const result = await BookingServices.deleteABooking(bookingId);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No such booking",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking deleted successfully",
      data: result,
    });
  }
});

const updateABooking = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const updatedInfo = req.body;

  const result = await BookingServices.updateABooking(bookingId, updatedInfo);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No such booking",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking updated successfully",
      data: result,
    });
  }
});

const getMyBookings = catchAsync(async (req, res) => {
  const token = req.header("authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not authorized");
  }

  const decoded = verifyToken(token);
  const email = decoded.email;

  // console.log("decoded token:", decoded);

  const result = await BookingServices.getMyBookings(email);

  if (!result?.length) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No such booking",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All bookings retrieved successfully",
      data: result,
    });
  }
});

export const BookingControllers = {
  addABooking,
  getAllBookings,
  deleteABooking,
  updateABooking,
  getMyBookings,
};
