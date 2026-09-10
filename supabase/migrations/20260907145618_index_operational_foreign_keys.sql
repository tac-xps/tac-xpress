-- Added from live advisor findings; no table data is changed.
CREATE INDEX IF NOT EXISTS fleet_vehicles_driver_id_idx ON public.fleet_vehicles (driver_id);
CREATE INDEX IF NOT EXISTS manifests_driver_id_idx ON public.manifests (driver_id);
CREATE INDEX IF NOT EXISTS manifests_vehicle_id_idx ON public.manifests (vehicle_id);
CREATE INDEX IF NOT EXISTS message_outbound_related_invoice_id_idx ON public.message_outbound (related_invoice_id);
CREATE INDEX IF NOT EXISTS message_outbound_related_ticket_id_idx ON public.message_outbound (related_ticket_id);
CREATE INDEX IF NOT EXISTS notifications_ticket_id_idx ON public.notifications (ticket_id);
CREATE INDEX IF NOT EXISTS vehicles_driver_id_idx ON public.vehicles (driver_id);
