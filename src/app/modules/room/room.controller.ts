import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { RoomServices } from "./room.service";
import AppError from "../../errors/AppError";

// create A room
const createARoom = catchAsync(async (req, res) => {
  const result = await RoomServices.createARoom(req.body);
  // console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room added successfully",
    data: result,
  });
});

// get A room
const getASingleRoom = catchAsync(async (req, res) => {
  const roomId = req.params.roomId;
  const result = await RoomServices.getSingleRoom(roomId);

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
      message: "Room retrieved successfully",
      data: result,
    });
  }
});

// get All rooms
const getAllRoom = catchAsync(async (req, res) => {
  const result = await RoomServices.getAllRoom(req.query);

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
      message: "Room retrieved successfully",
      data: result,
    });
  }
});

// delete A room
const deleteARoom = catchAsync(async (req, res) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Room Id");
  }

  const result = await RoomServices.deleteARoom(roomId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No such Room",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Room deleted successfully",
      data: result,
    });
  }
});

// update A room
const updateARoom = catchAsync(async (req, res) => {
  const roomId = req.params.roomId;
  const updatedRoom = req.body;

  const result = await RoomServices.updateARoom(roomId, updatedRoom);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Room not found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Room updated successfully",
      data: result,
    });
  }
});

export const RoomControllers = {
  createARoom,
  getAllRoom,
  getASingleRoom,
  deleteARoom,
  updateARoom,
};
