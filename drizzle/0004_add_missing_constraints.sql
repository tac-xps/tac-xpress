ALTER TABLE invoices ADD CONSTRAINT invoices_amount_nonnegative CHECK (amount >= 0);
ALTER TABLE shipments ADD CONSTRAINT shipments_pieces_positive CHECK (pieces >= 1);
