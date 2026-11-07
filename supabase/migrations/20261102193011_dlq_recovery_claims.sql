-- A lost recovery lease requires manual provider review before another send.
ALTER TABLE public.dead_letter_queue
  ADD COLUMN IF NOT EXISTS recovery_token uuid,
  ADD COLUMN IF NOT EXISTS locked_until timestamptz;
