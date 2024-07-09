import { z } from "zod";

export const Priority = z.enum(["HIGH", "MEDIUM", "LOW"]);
export type Priority = z.infer<typeof Priority>;
