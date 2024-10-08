import { z } from "zod";

// Define the room schema
const createARoomValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    roomNo: z.number().int().positive("Room number must be a positive number"),
    floorNo: z
      .number()
      .int()
      .positive("Floor number must be a positive number"),
    capacity: z.number().int().positive("Capacity must be a positive number"),
    pricePerSlot: z
      .number()
      .positive("Price per slot must be a positive number"),
    amenities: z.array(z.string().min(1, "Amenity cannot be empty")),

    isDeleted: z.boolean().default(false),
  }),
});

const updateARoomValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    roomNo: z
      .number()
      .int()
      .positive("Room number must be a positive number")
      .optional(),
    floorNo: z
      .number()
      .int()
      .positive("Floor number must be a positive number")
      .optional(),
    capacity: z
      .number()
      .int()
      .positive("Capacity must be a positive number")
      .optional(),
    pricePerSlot: z
      .number()
      .positive("Price per slot must be a positive number")
      .optional(),
    amenities: z.array(z.string().min(1, "Amenity cannot be empty")).optional(),

    isDeleted: z.boolean().default(false).optional(),
  }),
});

export { createARoomValidationSchema, updateARoomValidationSchema };
