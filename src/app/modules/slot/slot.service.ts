/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TSlot } from "./slot.interface";
import { SlotModel } from "./slot.model";
import { RoomModel } from "../room/room.model";
import {
  checkRoomExists,
  checkSlotConflicts,
  convertTimeToMinutes,
  createSlotIntervals,
} from "./slot.utils";
import { Types } from "mongoose";

// create slot function
const createASlot = async (slotData: TSlot) => {
  const { room, date, startTime, endTime } = slotData;

  // Check if the room exists
  const roomRecord = await RoomModel.findById(room);
  if (!roomRecord || roomRecord.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found");
  }

  // Verify overlapping slots
  const overlaps = await SlotModel.find({
    room,
    date,
    $or: [
      {
        $and: [
          { startTime: { $lt: endTime } },
          { endTime: { $gt: startTime } },
        ],
      },
    ],
  });

  if (overlaps.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot already used");
  }

  // Convert start and end times to minutes
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);

  // Calculate the total number of slots
  const slotDuration = 60; // Slot duration in minutes
  const totalDuration = endMinutes - startMinutes;
  const numberOfSlots = totalDuration / slotDuration;

  // Generate slot intervals
  const newSlots = createSlotIntervals(
    room,
    date,
    startMinutes,
    numberOfSlots,
    slotDuration
  );

  const result = await SlotModel.insertMany(newSlots);
  return result;
};

// get all slots
const getAllSlots = async (): Promise<TSlot[]> => {
  const slots = await SlotModel.find()
    .populate({
      path: "room",
      select:
        "name roomNo floorNo capacity pricePerSlot amenities images isDeleted",
    })
    .lean();

  // Filter out slots where room is deleted
  const filteredSlots = slots.filter(
    (slot) => slot.room && !(slot.room as any).isDeleted
  );

  return filteredSlots;
};

// get All Available Slots
const getAllAvailableSlot = async (date?: string, roomId?: string) => {
  const filterCriteria: any = { isBooked: false };

  if (roomId) {
    if (!Types.ObjectId.isValid(roomId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid room Id format");
    }

    // Check if the room exists and is not deleted
    const roomExists = await RoomModel.exists({
      _id: roomId,
      isDeleted: false,
    });
    if (!roomExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Room not found or has been deleted"
      );
    }

    filterCriteria.room = roomId;

    // If a date is provided, verify room availability for that date
    if (date) {
      const hasSlotsOnDate = await SlotModel.exists({
        room: roomId,
        date: date,
      });

      if (!hasSlotsOnDate) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "No slots found for this room on the specified date"
        );
      }
      filterCriteria.date = date;
    }
  } else {
    const nonDeletedRooms = await RoomModel.find({ isDeleted: false });
    const roomIds = nonDeletedRooms.map((room) => room._id);

    filterCriteria.room = { $in: roomIds };

    // Handle date filtering when no roomId is provided
    if (date) {
      const availableRoomsOnDate = await SlotModel.exists({
        room: { $in: roomIds },
        date: date,
      });

      if (!availableRoomsOnDate) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "No available rooms on the specified date"
        );
      }

      filterCriteria.date = date;
    } else {
      filterCriteria.date = { $exists: true }; // Ensure date field exists
    }
  }

  // Fetch available slots
  const availableSlots = await SlotModel.find(filterCriteria).populate({
    path: "room",
    match: { isDeleted: false },
  });

  return availableSlots;
};

// delete a slot
const deleteASlot = async (_id: string) => {
  // If not booked, proceed to soft delete the slot
  const result = await SlotModel.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

// update a single slot
const updateASlot = async (_id: string, updateFields: Partial<TSlot>) => {
  const slotToModify = await SlotModel.findById(_id);

  // to avoid ts error
  if (!slotToModify) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }

  // Prevent updates to deleted slots
  if (slotToModify.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot modify a deleted slot");
  }

  // Check if the room exists when room is being updated
  if (updateFields.room) {
    await checkRoomExists(updateFields.room);
  }

  // If time fields are being updated, handle conflict checks
  const newStartTime = updateFields.startTime || slotToModify.startTime;
  const newEndTime = updateFields.endTime || slotToModify.endTime;

  if (updateFields.startTime || updateFields.endTime) {
    await checkSlotConflicts(
      slotToModify.room,
      slotToModify.date,
      newStartTime,
      newEndTime,
      _id // Exclude the current slot from conflict checking
    );
  }

  // Apply updates and return the modified slot
  const updatedSlot = await SlotModel.findByIdAndUpdate(_id, updateFields, {
    new: true,
  });

  return updatedSlot;
};

export const SlotServices = {
  createASlot,
  getAllSlots,
  getAllAvailableSlot,
  deleteASlot,
  updateASlot,
};
