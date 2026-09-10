-- Non-unique, additive indexes support replay checks and active WhatsApp inbox lookup.
create index if not exists audit_whatsapp_message_lookup on public.audit_log ((metadata->>'message_id')) where action = 'whatsapp_inbound';
create index if not exists tickets_whatsapp_active_lookup on public.tickets (customer_phone, updated_at desc) where source = 'whatsapp' and status in ('open', 'in_progress', 'awaiting_customer');
