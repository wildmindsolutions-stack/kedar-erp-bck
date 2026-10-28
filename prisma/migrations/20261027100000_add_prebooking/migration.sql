-- Additive only: website pre-bookings (cash on delivery), kept separate from sales orders.

-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pack_size" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "prebook_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum
CREATE TYPE "PreBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "pre_bookings" (
    "id" TEXT NOT NULL,
    "booking_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "notes" TEXT,
    "status" "PreBookingStatus" NOT NULL DEFAULT 'PENDING',
    "payment_mode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "payment_received" BOOLEAN NOT NULL DEFAULT false,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "customer_id" TEXT,
    "sales_order_id" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_booking_items" (
    "id" TEXT NOT NULL,
    "pre_booking_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "pack_size" TEXT,
    "qty" DECIMAL(12,3) NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "pre_booking_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_booking_sequences" (
    "id" TEXT NOT NULL,
    "financial_year" TEXT NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pre_booking_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pre_bookings_booking_no_key" ON "pre_bookings"("booking_no");
CREATE UNIQUE INDEX "pre_bookings_sales_order_id_key" ON "pre_bookings"("sales_order_id");
CREATE INDEX "pre_bookings_status_idx" ON "pre_bookings"("status");
CREATE INDEX "pre_bookings_phone_idx" ON "pre_bookings"("phone");
CREATE UNIQUE INDEX "pre_booking_sequences_financial_year_key" ON "pre_booking_sequences"("financial_year");

-- AddForeignKey
ALTER TABLE "pre_bookings" ADD CONSTRAINT "pre_bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pre_bookings" ADD CONSTRAINT "pre_bookings_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pre_booking_items" ADD CONSTRAINT "pre_booking_items_pre_booking_id_fkey" FOREIGN KEY ("pre_booking_id") REFERENCES "pre_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pre_booking_items" ADD CONSTRAINT "pre_booking_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
