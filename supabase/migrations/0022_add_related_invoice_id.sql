ALTER TABLE message_outbound ADD COLUMN IF NOT EXISTS related_invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL;
