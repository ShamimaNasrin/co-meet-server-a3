import { Types } from "mongoose";
import { SlotModel } from "./slot.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { RoomModel } from "../room/room.model";

// function to convert time string to minutes
export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// function to format minutes into HH:mm
const formatMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// function to create slot intervals
export const createSlotIntervals = (
  room: Types.ObjectId,
  date: string,
  startMinutes: number,
  numberOfSlots: number,
  slotDuration: number
) => {
  const slots = [];
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStart = startMinutes + i * slotDuration;
    const slotEnd = slotStart + slotDuration;
    const slot = new SlotModel({
      room,
      date,
      startTime: formatMinutesToTime(slotStart),
      endTime: formatMinutesToTime(slotEnd),
      isBooked: false,
      isDeleted: false,
    });
    slots.push(slot);
  }
  return slots;
};

// function to check if a room exists
export const checkRoomExists = async (roomId: Types.ObjectId) => {
  const roomFound = await RoomModel.exists({ _id: roomId });
  if (!roomFound) {
    throw new AppError(httpStatus.NOT_FOUND, "Room not found");
  }
};

// function to check for slot conflicts
export const checkSlotConflicts = async (
  roomId: Types.ObjectId,
  slotDate: string,
  startTime: string,
  endTime: string,
  excludeSlotId?: string
) => {
  const conflicts = await SlotModel.find({
    room: roomId,
    date: slotDate,
    _id: { $ne: excludeSlotId },
    $or: [
      {
        $and: [
          { startTime: { $lt: endTime } }, // Overlapping logic
          { endTime: { $gt: startTime } },
        ],
      },
    ],
  });

  if (conflicts.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Time overlap: Another slot exists during this time"
    );
  }
};
