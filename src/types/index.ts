export type { User, Product, ProductVariant, Category, Order, OrderItem, Payment, CartItem } from "@/generated/prisma/client";
export { UserRole, OrderStatus } from "@/generated/prisma/client";

export interface CartItemWithDetails {
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variant: {
    id: string;
    size: string | null;
    color: string | null;
    stock: number;
    priceOverride: number | null;
  };
}

export interface ProductWithVariants {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  featured: boolean;
  active: boolean;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  variants: {
    id: string;
    size: string | null;
    color: string | null;
    stock: number;
    sku: string | null;
    priceOverride: number | null;
  }[];
}

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageTicket: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }[];
  salesByMonth: { month: string; total: number }[];
}
