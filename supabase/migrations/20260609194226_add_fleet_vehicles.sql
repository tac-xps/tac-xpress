DO $$ BEGIN
    CREATE TYPE "fleet_vehicle_status" AS ENUM ('active', 'maintenance', 'idle');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "fleet_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_number" text NOT NULL,
	"driver_id" uuid,
	"status" "fleet_vehicle_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "fleet_vehicles_registration_number_unique" UNIQUE("registration_number")
);

DO $$ BEGIN
 ALTER TABLE "fleet_vehicles" ADD CONSTRAINT "fleet_vehicles_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
