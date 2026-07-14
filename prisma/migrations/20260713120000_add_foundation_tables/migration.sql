-- Safe additive migration: foundation portal tables only.
-- Does NOT drop, truncate, or modify existing ERP tables/data.

CREATE TABLE IF NOT EXISTS "foundation_accounts" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "foundation_accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "foundation_accounts_customer_id_key" ON "foundation_accounts"("customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "foundation_accounts_email_key" ON "foundation_accounts"("email");

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'foundation_accounts_customer_id_fkey'
  ) THEN
    ALTER TABLE "foundation_accounts"
      ADD CONSTRAINT "foundation_accounts_customer_id_fkey"
      FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "customer_notifications" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ref_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "customer_notifications_customer_id_is_read_idx"
  ON "customer_notifications"("customer_id", "is_read");
CREATE INDEX IF NOT EXISTS "customer_notifications_created_at_idx"
  ON "customer_notifications"("created_at");

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_notifications_customer_id_fkey'
  ) THEN
    ALTER TABLE "customer_notifications"
      ADD CONSTRAINT "customer_notifications_customer_id_fkey"
      FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
