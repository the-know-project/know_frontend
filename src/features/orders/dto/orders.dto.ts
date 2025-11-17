import { z } from "zod";

export const Pagination = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1).max(100),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const OrdersData = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sellerId: z.string().uuid(),
  fileId: z.string(),
  assetUrl: z.string(),
  name: z.string(),
  artistFirstName: z.string(),
  artistLastName: z.string(),
  quantity: z.number().min(1).max(100),
  price: z.string(),
  totalAmount: z.string(),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export const OrderItems = z.object({
  fileId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  userId: z.string().uuid(), // this is the id of the artist who owns the artist
});

export const OrderSummaryData = z.object({
  totalOrders: z.number(),
  completedOrders: z.number(),
  pendingOrders: z.number(),
  rejectedOrders: z.number(),
  totalAmountSpent: z.string(),
});

export const CreateOrderDto = z.object({
  userId: z.string().uuid(),
  items: z.array(OrderItems),
});

export const FetchUserOrdersDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    orders: z.array(OrdersData),
    pagination: Pagination,
  }),
});

export const OrdersByIdDto = z.object({
  status: z.number(),
  message: z.string(),
  data: OrdersData,
});

export const OrdersSummaryDto = z.object({
  status: z.number(),
  message: z.string(),
  data: OrderSummaryData,
});

export const OrderStatus = z.enum([
  "pending",
  "accepted",
  "rejetced",
  "fulfilled",
  "completed",
]);

export const FetchUserOrders = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
  status: OrderStatus.optional(),
});
