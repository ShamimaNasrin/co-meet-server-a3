import express from "express";
import { authAdmin, authUser } from "../../middlewares/authUser";
import validateRequest from "../../middlewares/validateRequest";
import {
  createBookingValidationSchema,
  updateBookingValidationSchema,
} from "./booking.validation";
import { BookingControllers } from "./booking.controller";

const router = express.Router();

// for creating booking
router.post(
  "/",
  authUser,
  validateRequest(createBookingValidationSchema),
  BookingControllers.addABooking
);

//get all bookis
router.get("/", authUser, authAdmin, BookingControllers.getAllBookings);
// router.get("/", BookingControllers.getAllBookings);

// get users booking(my-bookings)
// router.get("/my-bookings", authUser, BookingControllers.getMyBookings);

//delete a single Bookings
router.delete(
  "/:bookingId",
  authUser,
  authAdmin,
  BookingControllers.deleteABooking
);

// Approve/Reject Bookings
router.patch(
  "/:bookingId",
  authUser,
  authAdmin,
  validateRequest(updateBookingValidationSchema),
  BookingControllers.updateABooking
);

export const BookingRoutes = router;
