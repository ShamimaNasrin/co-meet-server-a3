import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Define the Product schema
const createBookingValidationSchema = z.object({
  body: z.object({
    room: z
      .string()
      .regex(objectIdRegex, { message: "Invalid room ID" })
      .nonempty({ message: "Room ID is required" }),

    slots: z
      .array(z.string().regex(objectIdRegex, { message: "Invalid slot ID" }))
      .nonempty({ message: "Slot ID is required" }),
    user: z
      .string()
      .regex(objectIdRegex, { message: "Invalid user ID" })
      .nonempty({ message: "User ID is required" }),
    date: z.string().regex(dateRegex, {
      message: "Date must be in YYYY-MM-DD format",
    }),
    totalAmount: z
      .number()
      .min(0, { message: "Total amount must be a positive number" })
      .optional(),
    isConfirmed: z
      .enum(["confirmed", "unconfirmed", "canceled"])
      .default("unconfirmed")
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const updateBookingValidationSchema = z.object({
  body: z.object({
    room: z
      .string()
      .regex(objectIdRegex, { message: "Invalid room ID" })
      .nonempty({ message: "Room ID is required" })
      .optional(),

    slots: z
      .array(z.string().regex(objectIdRegex, { message: "Invalid slot ID" }))
      .nonempty({ message: "Slot ID is required" })
      .optional(),
    user: z
      .string()
      .regex(objectIdRegex, { message: "Invalid user ID" })
      .nonempty({ message: "User ID is required" })
      .optional(),
    date: z
      .string()
      .regex(dateRegex, {
        message: "Date must be in YYYY-MM-DD format",
      })
      .optional(),
    totalAmount: z
      .number()
      .min(0, { message: "Total amount must be a positive number" })
      .optional(),
    isConfirmed: z
      .enum(["confirmed", "unconfirmed", "canceled"])
      .default("unconfirmed")
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export { createBookingValidationSchema, updateBookingValidationSchema };
