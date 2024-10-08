import express from "express";
import { UserControllers } from "./user.controller";
import { authAdmin, authUser } from "../../middlewares/authUser";

const router = express.Router();

// get all user
router.get("/", authUser, authAdmin, UserControllers.getAllUsers);

// update user
router.patch(
  "/:userId",
  authUser,
  authAdmin,

  UserControllers.updateUserRole
);

export const UserRoutes = router;
