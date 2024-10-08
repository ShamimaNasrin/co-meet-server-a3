/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRoom } from "./room.interface";
import { RoomModel } from "./room.model";

// create room function
const createARoom = async (payload: TRoom) => {
  const room = await RoomModel.create(payload);
  // console.log("result:", room);
  const result = {
    _id: room._id,
    name: room.name,
    roomNo: room.roomNo,
    floorNo: room.floorNo,
    capacity: room.capacity,
    pricePerSlot: room.pricePerSlot,
    amenities: room.amenities,
    isDeleted: room.isDeleted,
  };
  return result;
};

// get all room inclusding sorting, searching, filtering
const getAllRoom = async (queryParams: any) => {
  const { search, sortBy, minPrice, maxPrice, minCapacity, maxCapacity } =
    queryParams;

  const filter: any = { isDeleted: false };

  // by name
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // by price range
  if (maxPrice) {
    filter.pricePerSlot = {
      ...filter.pricePerSlot,
      $lte: parseFloat(maxPrice),
    };
  }

  if (minPrice) {
    filter.pricePerSlot = {
      ...filter.pricePerSlot,
      $gte: parseFloat(minPrice),
    };
  }

  // by capacity range
  if (maxCapacity) {
    filter.capacity = { ...filter.capacity, $lte: parseFloat(maxCapacity) };
  }

  if (minCapacity) {
    filter.capacity = { ...filter.capacity, $gte: parseFloat(minCapacity) };
  }

  // sorting by price
  let sort: any = {};
  if (sortBy) {
    if (sortBy === "asc") {
      sort.pricePerSlot = 1;
    } else if (sortBy === "desc") {
      sort.pricePerSlot = -1;
    }
  }

  const result = await RoomModel.find(filter).sort(sort);
  return result;
};

// get a single room
const getSingleRoom = async (_id: string) => {
  const room = await RoomModel.findOne({ _id });

  if (room) {
    const result = {
      _id: room._id,
      name: room.name,
      roomNo: room.roomNo,
      floorNo: room.floorNo,
      capacity: room.capacity,
      pricePerSlot: room.pricePerSlot,
      amenities: room.amenities,
      isDeleted: room.isDeleted,
    };
    return result;
  } else {
    return null;
  }
};

// delete a room
const deleteARoom = async (_id: string) => {
  const result = await RoomModel.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// update a single room
const updateARoom = async (
  _id: string,
  data: Partial<TRoom>
): Promise<TRoom | null> => {
  const result = await RoomModel.findByIdAndUpdate(_id, data, {
    new: true,
  });
  return result;
};

export const RoomServices = {
  createARoom,
  getAllRoom,
  getSingleRoom,
  deleteARoom,
  updateARoom,
};
