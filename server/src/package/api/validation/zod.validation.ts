
import { z } from "zod";

export const isMongoId = z.string().regex(/^[a-f\d]{24}$/i, {
  message: "Invalid MongoDB ObjectId",
});