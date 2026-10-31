-- Additive only: area-wise pre-booking delivery (area -> supervisor -> executive).

-- AlterTable
ALTER TABLE "users" ADD COLUMN "supervisor_id" TEXT;
ALTER TABLE "pre_bookings" ADD COLUMN "area_id" TEXT;
ALTER TABLE "pre_bookings" ADD COLUMN "supervisor_id" TEXT;
ALTER TABLE "pre_bookings" ADD COLUMN "executive_id" TEXT;
ALTER TABLE "pre_bookings" ADD COLUMN "assigned_at" TIMESTAMP(3);
ALTER TABLE "pre_bookings" ADD COLUMN "out_for_delivery_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "delivery_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pincodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supervisor_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_areas_name_key" ON "delivery_areas"("name");
CREATE INDEX "pre_bookings_supervisor_id_idx" ON "pre_bookings"("supervisor_id");
CREATE INDEX "pre_bookings_executive_id_idx" ON "pre_bookings"("executive_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "delivery_areas" ADD CONSTRAINT "delivery_areas_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pre_bookings" ADD CONSTRAINT "pre_bookings_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "delivery_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pre_bookings" ADD CONSTRAINT "pre_bookings_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pre_bookings" ADD CONSTRAINT "pre_bookings_executive_id_fkey" FOREIGN KEY ("executive_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Roles are data, so create them here: every environment gets them on deploy.
INSERT INTO "roles" ("id", "name", "permissions", "updated_at") VALUES
  ('role_delivery_supervisor', 'Delivery Supervisor', '["delivery:read","delivery:write"]', CURRENT_TIMESTAMP),
  ('role_delivery_executive', 'Delivery Executive', '["delivery:read","delivery:write"]', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
