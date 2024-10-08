import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { SlotServices } from "./slot.service";

// create slot
const createASlot = catchAsync(async (req, res) => {
  const result = await SlotServices.createASlot(req.body);
  // console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot added successfully",
    data: result,
  });
});

// get all the slots
const getAllSlots = catchAsync(async (req, res) => {
  const result = await SlotServices.getAllSlots();

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Slots retrieved successfully",
      data: result,
    });
  }
});

// get available slots
const getAllAvailableSlot = catchAsync(async (req, res) => {
  const queryParams = {
    date: req.query.date as string,
    roomId: req.query.roomId as string,
  };

  const result = await SlotServices.getAllAvailableSlot(
    queryParams.date,
    queryParams.roomId
  );

  if (!result?.length) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Slots retrieved successfully",
      data: result,
    });
  }
});

// delete slot
const deleteASlot = catchAsync(async (req, res) => {
  const slotId = req.params.slotId;

  if (!slotId) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Slot ID");
  }

  const result = await SlotServices.deleteASlot(slotId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No such slot",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "slot deleted successfully",
      data: result,
    });
  }
});

// update a slot
const updateASlot = catchAsync(async (req, res) => {
  const slotId = req.params.slotId;
  const updatedSlot = req.body;

  const result = await SlotServices.updateASlot(slotId, updatedSlot);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Slot updated successfully",
      data: result,
    });
  }
});

export const SlotControllers = {
  createASlot,
  getAllSlots,
  getAllAvailableSlot,
  deleteASlot,
  updateASlot,
};
