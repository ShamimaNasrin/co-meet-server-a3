import express from "express";
import { authAdmin, authUser } from "../../middlewares/authUser";
import validateRequest from "../../middlewares/validateRequest";
import {
  createSlotValidationSchema,
  updateSlotValidationSchema,
} from "./slot.validation";
import { SlotControllers } from "./slot.controller";

const router = express.Router();

// for creating slot
router.post(
  "/",
  authUser,
  authAdmin,
  validateRequest(createSlotValidationSchema),
  SlotControllers.createASlot
);

//get all product
router.get("/", SlotControllers.getAllSlots);

// get a available slot
router.get("/availability", SlotControllers.getAllAvailableSlot);

//delete a single product
router.delete("/:slotId", authUser, authAdmin, SlotControllers.deleteASlot);
// router.delete("/:slotId", SlotControllers.deleteASlot);

// update a single product
router.patch(
  "/:slotId",
  authUser,
  authAdmin,
  validateRequest(updateSlotValidationSchema),
  SlotControllers.updateASlot
);

export const SlotRoutes = router;
