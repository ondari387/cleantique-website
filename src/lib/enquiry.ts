import { z } from "zod";

export * from "./enquiry-shared";

const str = (max: number) => z.string().trim().max(max);
const req = (label: string, max = 200) =>
  z.string({ required_error: `Please enter ${label}.`, invalid_type_error: `Please enter ${label}.` }).trim().min(1, `Please enter ${label}.`).max(max);

const phoneRe = /^(\+?\d[\d\s-]{7,16}\d)$/;

const common = {
  name: req("your name", 100),
  phone: z
    .string({ required_error: "Please enter your phone number." })
    .trim()
    .regex(phoneRe, "Please enter a valid phone number, for example 0712 345 678."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address, or leave it blank.")]).optional().default(""),
  message: str(3000).optional().default(""),
  preferredDate: str(40).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm that we may contact you about this request." }) }),
  // Anti-spam fields
  company: z.string().max(0).optional().default(""), // honeypot: must stay empty
  startedAt: z.number().int().optional(),
  turnstileToken: z.string().optional(),
  sourcePage: str(300).optional().default(""),
};

export const enquirySchema = z.discriminatedUnion("division", [
  z.object({
    division: z.literal("pest-control"),
    pestType: req("the type of pest"),
    propertyType: req("the property type"),
    propertySize: req("the approximate property size"),
    location: req("your location", 150),
    details: str(2000).optional().default(""),
    ...common,
  }),
  z.object({
    division: z.literal("cleaning"),
    cleaningType: req("the type of cleaning"),
    propertySize: req("the approximate property size"),
    rooms: str(100).optional().default(""),
    location: req("your location", 150),
    frequency: req("how often you need cleaning"),
    ...common,
  }),
  z.object({
    division: z.literal("moving-relocation"),
    origin: req("where you are moving from", 150),
    destination: req("where you are moving to", 150),
    moveType: req("the size of the move"),
    inventory: str(2000).optional().default(""),
    access: str(1000).optional().default(""),
    ...common,
  }),
  z.object({
    division: z.literal("transport-logistics"),
    collection: req("the collection location", 150),
    delivery: req("the delivery destination", 150),
    goods: req("a description of the goods", 1000),
    quantity: req("the approximate quantity, weight or volume", 300),
    handling: str(1000).optional().default(""),
    ...common,
  }),
]);

export type EnquiryInput = z.infer<typeof enquirySchema>;
