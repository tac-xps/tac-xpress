CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role role DEFAULT 'customer',
  email_notifications boolean DEFAULT true,
  whatsapp_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_notifications boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false;
