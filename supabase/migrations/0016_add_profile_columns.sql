ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_notifications boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false;
