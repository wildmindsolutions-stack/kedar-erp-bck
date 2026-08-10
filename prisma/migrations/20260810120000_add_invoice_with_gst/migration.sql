-- Additive only: support invoices without GST (parchi / trade bill).
-- Existing invoices default to with_gst = true (Tax Invoice).
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "with_gst" BOOLEAN NOT NULL DEFAULT true;
