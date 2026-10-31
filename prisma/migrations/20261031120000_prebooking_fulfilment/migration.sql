-- Additive only: delivery now handles stock and ledger; failed attempts and cash handover are tracked.
ALTER TABLE "pre_bookings" ADD COLUMN "stock_deducted_at" TIMESTAMP(3);
ALTER TABLE "pre_bookings" ADD COLUMN "cash_handed_over_at" TIMESTAMP(3);
ALTER TABLE "pre_bookings" ADD COLUMN "failed_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "pre_bookings" ADD COLUMN "last_fail_reason" TEXT;
ALTER TABLE "pre_bookings" ADD COLUMN "cancel_reason" TEXT;
