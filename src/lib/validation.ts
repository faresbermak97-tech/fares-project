import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),

  email: z
    .string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase()
    .max(254, "Email is too long"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .trim(),
});

// Use ContactFormData from types/index.ts instead

// Sanitization functions
export function sanitizeEmailSubject(text: string): string {
  return text
    .replace(/[\r\n]/g, "") // Remove newlines (header injection)
    .replace(/[^ -~]/g, "") // Remove non-ASCII
    .substring(0, 100); // Limit length
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, "") // Remove HTML brackets
    .trim();
}
