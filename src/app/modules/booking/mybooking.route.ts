import express from "express";
import { authUser } from "../../middlewares/authUser";

import { BookingControllers } from "./booking.controller";

const router = express.Router();

// get users booking(my-bookings)
router.get("/", authUser, BookingControllers.getMyBookings);
// router.get("/", BookingControllers.getMyBookings);

export const MyBookingRoutes = router;
