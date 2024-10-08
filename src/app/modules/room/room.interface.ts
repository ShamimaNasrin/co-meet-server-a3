// Room Interface
export interface TRoom {
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: string[];
  // images: string[];
  isDeleted: boolean;
}
