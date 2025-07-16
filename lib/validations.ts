import { z } from "zod";

export const navigationLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  internalUrl: z.string().url("Please enter a valid internal URL"),
  externalUrl: z.string().url("Please enter a valid external URL"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  icon: z.string().optional(),
  favicon: z
    .string()
    .url("Please enter a valid favicon URL")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const updateNavigationLinkSchema = navigationLinkSchema
  .extend({
    id: z.string().min(1, "ID is required"),
  })
  .partial()
  .extend({
    id: z.string().min(1, "ID is required"),
  });

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const searchFiltersSchema = z.object({
  query: z.string().optional().default(""),
  isActive: z.boolean().optional(),
});

export type NavigationLinkFormData = z.infer<typeof navigationLinkSchema>;
export type UpdateNavigationLinkFormData = z.infer<
  typeof updateNavigationLinkSchema
>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>;
