import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "PENDING",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
]);

export const PaymentMethodSchema = z.enum(["POS", "TRANSFER", "CASH"]);

export const PaymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);

export const OrderItemAddonSchema = z.object({
  addon_id: z.string().uuid("Addon ID must be a valid UUID"),
  quantity: z.number().int().positive("Quantity must be positive").default(1),
});

export const OrderItemSchema = z.object({
  menu_id: z.string().uuid("Menu ID must be a valid UUID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  special_notes: z.string().max(500).optional(),
  addons: z.array(OrderItemAddonSchema).optional(),
});

export const PaymentInputSchema = z.object({
  payment_method: PaymentMethodSchema,
  transaction_ref: z.string().max(255).optional(),
});

export const CreateOrderSchema = z
  .object({
    customer_name: z.string().min(1).max(255).optional(),
    customer_id: z.string().uuid().optional(),
    notes: z.string().max(1000).optional(),
    items: z.array(OrderItemSchema).min(1, "At least one item is required"),
    payment: PaymentInputSchema.optional(),
  })
  .refine((data) => data.customer_name || data.customer_id || true, {
    message:
      "Either customer_name or customer_id can be provided, but not required",
  });

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
  notes: z.string().max(500).optional(),
});

export const CancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
  restore_inventory: z.boolean().default(true),
});

export const UpdatePaymentStatusSchema = z.object({
  payment_status: PaymentStatusSchema,
  transaction_ref: z.string().max(255).optional(),
});

export const OrderQueryFiltersSchema = z.object({
  status: OrderStatusSchema.optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type OrderItemAddon = z.infer<typeof OrderItemAddonSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type PaymentInput = z.infer<typeof PaymentInputSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
export type CancelOrder = z.infer<typeof CancelOrderSchema>;
export type UpdatePaymentStatus = z.infer<typeof UpdatePaymentStatusSchema>;
export type OrderQueryFilters = z.infer<typeof OrderQueryFiltersSchema>;
