import express from "express";
import { authAdmin, authUser } from "../../middlewares/authUser";
import validateRequest from "../../middlewares/validateRequest";
import {
  createARoomValidationSchema,
  updateARoomValidationSchema,
} from "./room.validation";
import { RoomControllers } from "./room.controller";

const router = express.Router();

// for creating room
router.post(
  "/",
  authUser,
  authAdmin,
  validateRequest(createARoomValidationSchema),
  RoomControllers.createARoom
);

// get all room
router.get("/", RoomControllers.getAllRoom);

// get a single product
router.get("/:roomId", RoomControllers.getASingleRoom);

// delete a single product
router.delete("/:roomId", authUser, authAdmin, RoomControllers.deleteARoom);
// router.delete("/:roomId", RoomControllers.deleteARoom);

// update a single product
router.patch(
  "/:roomId",
  authUser,
  authAdmin,
  validateRequest(updateARoomValidationSchema),
  RoomControllers.updateARoom
);

export const RoomRoutes = router;
