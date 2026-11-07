DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_catalog.pg_tables WHERE schemaname = 'public') THEN
  RAISE EXCEPTION 'Staging schema import requires an empty application schema';
 END IF;
END $$;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated, service_role;
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: driver_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.driver_status AS ENUM (
    'active',
    'on_leave',
    'inactive'
);


--
-- Name: hub_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hub_type AS ENUM (
    'warehouse',
    'branch',
    'transit_center'
);


--
-- Name: id_proof_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.id_proof_type AS ENUM (
    'aadhaar',
    'pan',
    'passport',
    'none'
);


--
-- Name: invoice_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invoice_status AS ENUM (
    'unpaid',
    'paid',
    'void'
);


--
-- Name: item_condition; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.item_condition AS ENUM (
    'new',
    'used',
    'refurbished'
);


--
-- Name: leg_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.leg_status AS ENUM (
    'pending',
    'in_transit',
    'completed',
    'exception'
);


--
-- Name: manifest_handoff_outcome; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.manifest_handoff_outcome AS ENUM (
    'received',
    'exception'
);


--
-- Name: manifest_leg_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.manifest_leg_type AS ENUM (
    'pickup',
    'line_haul',
    'delivery'
);


--
-- Name: manifest_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.manifest_status AS ENUM (
    'draft',
    'finalized'
);


--
-- Name: nature_of_goods; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.nature_of_goods AS ENUM (
    'documents',
    'electronics',
    'garments',
    'fragile',
    'medicines',
    'others'
);


--
-- Name: packaging_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.packaging_type AS ENUM (
    'none',
    'corrugated_box',
    'bubble_wrap',
    'wooden_crate',
    'pallet'
);


--
-- Name: payment_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_mode AS ENUM (
    'cash',
    'upi',
    'card',
    'wallet',
    'credit',
    'to_pay'
);


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'staff',
    'customer'
);


--
-- Name: service_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.service_type AS ENUM (
    'express_air',
    'standard_ocean',
    'road_freight'
);


--
-- Name: shipment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.shipment_status AS ENUM (
    'pending',
    'in-transit',
    'delivered'
);


--
-- Name: ticket_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ticket_status AS ENUM (
    'open',
    'in_progress',
    'awaiting_customer',
    'resolved'
);


--
-- Name: vehicle_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.vehicle_status AS ENUM (
    'active',
    'maintenance',
    'retired'
);


--
-- Name: whatsapp_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.whatsapp_status AS ENUM (
    'pending',
    'sent',
    'failed'
);


--
-- Name: get_resolution_metrics(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_resolution_metrics(days_back integer) RETURNS TABLE(total_resolved bigint, avg_resolution_hours numeric, ai_touched bigint, ai_touch_rate numeric)
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT t.id)::BIGINT as total_resolved,
    ROUND(AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at))/3600)::numeric, 2) as avg_resolution_hours,
    COUNT(DISTINCT CASE WHEN tr.ticket_id IS NOT NULL THEN t.id END)::BIGINT as ai_touched,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN tr.ticket_id IS NOT NULL THEN t.id END) / NULLIF(COUNT(DISTINCT t.id), 0), 2) as ai_touch_rate
  FROM tickets t
  LEFT JOIN (
    SELECT DISTINCT ticket_id FROM ticket_replies WHERE sender_type = 'ai'
  ) tr ON tr.ticket_id = t.id
  WHERE t.status IN ('resolved')
  AND t.created_at > NOW() - (days_back || ' days')::INTERVAL;
END;
$$;


--
-- Name: get_sla_breach_rate(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_sla_breach_rate(days_back integer) RETURNS TABLE(priority text, total bigint, breached bigint, rate numeric)
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.priority,
    COUNT(*)::BIGINT as total,
    SUM(CASE WHEN t.sla_breached THEN 1 ELSE 0 END)::BIGINT as breached,
    ROUND(100.0 * SUM(CASE WHEN t.sla_breached THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) as rate
  FROM tickets t
  WHERE t.created_at > NOW() - (days_back || ' days')::INTERVAL
  GROUP BY t.priority
  ORDER BY rate DESC;
END;
$$;


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


--
-- Name: update_first_reply(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_first_reply() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
BEGIN
  UPDATE tickets 
  SET first_reply_at = NEW.created_at 
  WHERE id = NEW.ticket_id 
  AND first_reply_at IS NULL;
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_email text NOT NULL,
    action text NOT NULL,
    resource_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    entity text,
    entity_id text,
    before jsonb,
    after jsonb
);


--
-- Name: auth_token_consumptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_token_consumptions (
    jti text NOT NULL,
    purpose text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: background_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.background_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kind text NOT NULL,
    dedupe_key text NOT NULL,
    payload jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    available_at timestamp with time zone DEFAULT now() NOT NULL,
    locked_until timestamp with time zone,
    lease_token uuid,
    last_error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT background_jobs_attempts_check CHECK ((attempts >= 0)),
    CONSTRAINT background_jobs_kind_check CHECK ((kind = ANY (ARRAY['support_email'::text, 'support_triage'::text]))),
    CONSTRAINT background_jobs_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: TABLE background_jobs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.background_jobs IS 'Server-only leased work queue. No client Data API access. Provider acceptance must be recorded before completion.';


--
-- Name: dead_letter_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dead_letter_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    action text NOT NULL,
    payload jsonb,
    error text,
    retry_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    recovery_token uuid,
    locked_until timestamp with time zone
);


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drivers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    license_number text NOT NULL,
    status public.driver_status DEFAULT 'active'::public.driver_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: email_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid,
    recipient_email text NOT NULL,
    template_name text NOT NULL,
    subject text NOT NULL,
    body_html text,
    body_text text,
    status text NOT NULL,
    provider_message_id text,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT email_notifications_status_check CHECK ((status = ANY (ARRAY['sent'::text, 'failed'::text])))
);


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: fleet_telemetry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fleet_telemetry (
    vehicle_id uuid NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    heading double precision NOT NULL,
    speed double precision NOT NULL,
    observed_at timestamp with time zone NOT NULL,
    received_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fleet_telemetry_heading_check CHECK (((heading >= (0)::double precision) AND (heading < (360)::double precision))),
    CONSTRAINT fleet_telemetry_latitude_check CHECK (((latitude >= ('-90'::integer)::double precision) AND (latitude <= (90)::double precision))),
    CONSTRAINT fleet_telemetry_longitude_check CHECK (((longitude >= ('-180'::integer)::double precision) AND (longitude <= (180)::double precision))),
    CONSTRAINT fleet_telemetry_speed_check CHECK (((speed >= (0)::double precision) AND (speed <= (400)::double precision)))
);


--
-- Name: hubs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hubs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    contact text,
    type public.hub_type DEFAULT 'branch'::public.hub_type NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_id uuid,
    customer_id uuid,
    amount integer NOT NULL,
    status public.invoice_status DEFAULT 'unpaid'::public.invoice_status NOT NULL,
    pdf_url text,
    due_date timestamp without time zone,
    freight_charge integer DEFAULT 0,
    pickup_charge integer DEFAULT 0,
    packing_charge integer DEFAULT 0,
    docket_charge integer DEFAULT 0,
    insurance_charge integer DEFAULT 0,
    other_charges integer DEFAULT 0,
    subtotal integer DEFAULT 0,
    gst_rate integer DEFAULT 0,
    hsn_code text DEFAULT '996511'::text,
    cgst integer DEFAULT 0,
    sgst integer DEFAULT 0,
    igst integer DEFAULT 0,
    payment_mode public.payment_mode DEFAULT 'cash'::public.payment_mode,
    advance_paid integer DEFAULT 0,
    balance_due integer DEFAULT 0,
    remarks text,
    terms_accepted boolean DEFAULT false,
    prohibited_accepted boolean DEFAULT false,
    signature_url text,
    whatsapp_status public.whatsapp_status DEFAULT 'pending'::public.whatsapp_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    document_snapshot jsonb,
    terms_version text DEFAULT '2026.10'::text,
    CONSTRAINT invoices_amount_nonnegative CHECK ((amount >= 0))
);


--
-- Name: manifest_item_handoffs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manifest_item_handoffs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    manifest_item_id uuid NOT NULL,
    outcome public.manifest_handoff_outcome NOT NULL,
    location text NOT NULL,
    receiving_party text,
    received_by uuid NOT NULL,
    event_key text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT manifest_item_handoffs_receiver_required CHECK (((outcome = 'exception'::public.manifest_handoff_outcome) OR ((receiving_party IS NOT NULL) AND (length(TRIM(BOTH FROM receiving_party)) > 0))))
);


--
-- Name: manifest_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manifest_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    manifest_id uuid NOT NULL,
    shipment_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: manifests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manifests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_id text NOT NULL,
    created_by uuid,
    origin_hub_id uuid,
    destination_hub_id uuid,
    vehicle_id uuid,
    driver_id uuid,
    status public.manifest_status DEFAULT 'draft'::public.manifest_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    leg_type public.manifest_leg_type DEFAULT 'line_haul'::public.manifest_leg_type NOT NULL
);


--
-- Name: message_outbound; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_outbound (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    body text NOT NULL,
    whatsapp_message_id text,
    provider_name text DEFAULT 'wpbox'::text,
    provider_message_id text,
    meta_message_id text,
    status text DEFAULT 'sent'::text NOT NULL,
    template_name text,
    template_language text,
    message_type text DEFAULT 'text'::text NOT NULL,
    related_ticket_id uuid,
    related_awb text,
    failure_reason text,
    provider_payload jsonb,
    last_status_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    related_invoice_id uuid
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid,
    recipient_email text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payload jsonb,
    created_at timestamp with time zone DEFAULT now(),
    sent_at timestamp with time zone,
    CONSTRAINT notifications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['sla_at_risk'::text, 'sla_breached'::text, 'escalation'::text, 'agent_assigned'::text])))
);


--
-- Name: pricing_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_type public.service_type NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    base_price integer NOT NULL,
    price_per_kg integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    avatar_url text,
    role text DEFAULT 'customer'::text,
    email_notifications boolean DEFAULT true,
    whatsapp_notifications boolean DEFAULT true,
    sms_notifications boolean DEFAULT false
);


--
-- Name: shipment_legs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment_legs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_id uuid NOT NULL,
    leg_number integer NOT NULL,
    origin_hub_id uuid,
    destination_hub_id uuid,
    origin_location text NOT NULL,
    destination_location text NOT NULL,
    vehicle_id uuid,
    driver_id uuid,
    manifest_id uuid,
    status public.leg_status DEFAULT 'pending'::public.leg_status NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    awb_number text NOT NULL,
    customer_id uuid,
    status public.shipment_status DEFAULT 'pending'::public.shipment_status NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    service_type public.service_type DEFAULT 'express_air'::public.service_type NOT NULL,
    weight_kg real DEFAULT 1 NOT NULL,
    booking_date timestamp without time zone DEFAULT now() NOT NULL,
    edd timestamp without time zone,
    consignor_name text,
    consignor_company text,
    consignor_phone text,
    consignor_alt_phone text,
    consignor_email text,
    consignor_address text,
    consignor_pin_code text,
    consignor_id_type public.id_proof_type DEFAULT 'none'::public.id_proof_type,
    consignor_id_number text,
    consignee_name text,
    consignee_phone text,
    consignee_alt_phone text,
    consignee_email text,
    consignee_address text,
    consignee_pin_code text,
    content_description text,
    nature_of_goods public.nature_of_goods DEFAULT 'others'::public.nature_of_goods,
    item_condition public.item_condition DEFAULT 'new'::public.item_condition,
    declared_value integer DEFAULT 0,
    pieces integer DEFAULT 1,
    dimensions_l integer,
    dimensions_w integer,
    dimensions_h integer,
    charged_weight_kg real,
    packaging_type public.packaging_type DEFAULT 'none'::public.packaging_type,
    is_fragile boolean DEFAULT false,
    insurance_opt_in boolean DEFAULT false,
    sla_at_risk boolean DEFAULT false,
    sla_at_risk_alerted_at timestamp without time zone,
    sla_risk_acknowledged boolean DEFAULT false,
    sla_risk_acknowledged_by uuid,
    sla_risk_acknowledged_at timestamp without time zone,
    deleted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT shipments_pieces_positive CHECK ((pieces >= 1)),
    CONSTRAINT shipments_weight_kg_positive CHECK ((weight_kg > (0)::double precision))
);


--
-- Name: sla_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sla_policies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    priority text NOT NULL,
    category text,
    first_response_minutes integer DEFAULT 240 NOT NULL,
    resolution_minutes integer DEFAULT 2880 NOT NULL,
    escalation_threshold numeric(3,2) DEFAULT 0.80 NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT sla_policies_category_check CHECK ((category = ANY (ARRAY['delay'::text, 'damage'::text, 'billing'::text, 'general'::text, 'lost'::text]))),
    CONSTRAINT sla_policies_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])))
);


--
-- Name: ticket_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid NOT NULL,
    message text,
    is_internal boolean DEFAULT false NOT NULL,
    sender_type text,
    sender_id text,
    sender_name text,
    sender_email text,
    whatsapp_message_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    user_id uuid,
    guest_email text,
    guest_phone text,
    customer_name text,
    customer_email text,
    customer_phone text,
    awb_number text,
    subject text NOT NULL,
    message text,
    description text NOT NULL,
    intake_category text,
    category text,
    status public.ticket_status DEFAULT 'open'::public.ticket_status NOT NULL,
    priority text DEFAULT 'medium'::text,
    assigned_to text,
    related_awb text,
    source text,
    resolved_at timestamp without time zone,
    ai_confidence real DEFAULT 0,
    ai_routing text,
    ai_auto_reply_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    sla_deadline_first_response timestamp with time zone,
    sla_deadline_resolution timestamp with time zone,
    sla_breached boolean DEFAULT false,
    sla_breach_type text,
    sla_at_risk boolean DEFAULT false,
    first_reply_at timestamp with time zone,
    assigned_team text,
    needs_human_review boolean DEFAULT false NOT NULL,
    sla_breach_processed_at timestamp with time zone,
    CONSTRAINT tickets_sla_breach_type_check CHECK ((sla_breach_type = ANY (ARRAY['first_response'::text, 'resolution'::text])))
);


--
-- Name: tracking_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tracking_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_id uuid NOT NULL,
    awb_number text,
    event_type text,
    status public.shipment_status NOT NULL,
    location text NOT NULL,
    location_code text,
    description text NOT NULL,
    event_time timestamp without time zone DEFAULT now() NOT NULL,
    logged_by text,
    is_public boolean DEFAULT false NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_mfa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_mfa (
    user_id uuid NOT NULL,
    totp_secret_encrypted text,
    totp_enabled boolean DEFAULT false NOT NULL,
    backup_codes_hash text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    totp_pending_secret_encrypted text,
    failed_attempts integer DEFAULT 0 NOT NULL,
    locked_until timestamp with time zone
);


--
-- Name: user_passkeys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_passkeys (
    id text NOT NULL,
    user_id uuid NOT NULL,
    public_key text NOT NULL,
    counter integer DEFAULT 0 NOT NULL,
    device_type text DEFAULT 'platform'::text NOT NULL,
    transports jsonb,
    name text DEFAULT 'My Device'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_used_at timestamp without time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name text,
    email text,
    phone text,
    address text,
    city text,
    state text,
    pin_code text,
    password text,
    role public.role DEFAULT 'customer'::public.role NOT NULL,
    is_onboarded boolean DEFAULT false NOT NULL,
    avatar_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registration_number text NOT NULL,
    capacity_kg integer NOT NULL,
    status public.vehicle_status DEFAULT 'active'::public.vehicle_status NOT NULL,
    driver_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: whatsapp_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_subscribers (
    phone text NOT NULL,
    name text,
    opted_in boolean DEFAULT true,
    last_inbound_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: auth_token_consumptions auth_token_consumptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_token_consumptions
    ADD CONSTRAINT auth_token_consumptions_pkey PRIMARY KEY (jti);


--
-- Name: background_jobs background_jobs_kind_dedupe_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.background_jobs
    ADD CONSTRAINT background_jobs_kind_dedupe_key_key UNIQUE (kind, dedupe_key);


--
-- Name: background_jobs background_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.background_jobs
    ADD CONSTRAINT background_jobs_pkey PRIMARY KEY (id);


--
-- Name: dead_letter_queue dead_letter_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dead_letter_queue
    ADD CONSTRAINT dead_letter_queue_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_license_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_license_number_unique UNIQUE (license_number);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: email_notifications email_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: fleet_telemetry fleet_telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fleet_telemetry
    ADD CONSTRAINT fleet_telemetry_pkey PRIMARY KEY (vehicle_id);


--
-- Name: hubs hubs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hubs
    ADD CONSTRAINT hubs_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: manifest_item_handoffs manifest_item_handoffs_event_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_item_handoffs
    ADD CONSTRAINT manifest_item_handoffs_event_key_key UNIQUE (event_key);


--
-- Name: manifest_item_handoffs manifest_item_handoffs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_item_handoffs
    ADD CONSTRAINT manifest_item_handoffs_pkey PRIMARY KEY (id);


--
-- Name: manifest_items manifest_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_items
    ADD CONSTRAINT manifest_items_pkey PRIMARY KEY (id);


--
-- Name: manifests manifests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_pkey PRIMARY KEY (id);


--
-- Name: manifests manifests_reference_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_reference_id_unique UNIQUE (reference_id);


--
-- Name: message_outbound message_outbound_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_outbound
    ADD CONSTRAINT message_outbound_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: pricing_rules pricing_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_rules
    ADD CONSTRAINT pricing_rules_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: shipment_legs shipment_legs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_pkey PRIMARY KEY (id);


--
-- Name: shipment_legs shipment_legs_shipment_leg_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_shipment_leg_number_unique UNIQUE (shipment_id, leg_number);


--
-- Name: shipments shipments_awb_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_awb_number_unique UNIQUE (awb_number);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: sla_policies sla_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sla_policies
    ADD CONSTRAINT sla_policies_pkey PRIMARY KEY (id);


--
-- Name: ticket_replies ticket_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_replies
    ADD CONSTRAINT ticket_replies_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tracking_events tracking_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracking_events
    ADD CONSTRAINT tracking_events_pkey PRIMARY KEY (id);


--
-- Name: user_mfa user_mfa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_mfa
    ADD CONSTRAINT user_mfa_pkey PRIMARY KEY (user_id);


--
-- Name: user_passkeys user_passkeys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_passkeys
    ADD CONSTRAINT user_passkeys_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_registration_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_registration_number_unique UNIQUE (registration_number);


--
-- Name: whatsapp_subscribers whatsapp_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_subscribers
    ADD CONSTRAINT whatsapp_subscribers_pkey PRIMARY KEY (phone);


--
-- Name: audit_log_action_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_action_created_at_idx ON public.audit_log USING btree (action, created_at DESC);


--
-- Name: audit_log_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_created_at_idx ON public.audit_log USING btree (created_at DESC);


--
-- Name: audit_log_entity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_entity_idx ON public.audit_log USING btree (entity, entity_id, created_at DESC);


--
-- Name: audit_log_user_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_user_email_idx ON public.audit_log USING btree (user_email);


--
-- Name: audit_log_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_user_id_idx ON public.audit_log USING btree (user_id);


--
-- Name: audit_whatsapp_message_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_whatsapp_message_lookup ON public.audit_log USING btree (((metadata ->> 'message_id'::text))) WHERE (action = 'whatsapp_inbound'::text);


--
-- Name: auth_token_consumptions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_token_consumptions_expires_at_idx ON public.auth_token_consumptions USING btree (expires_at);


--
-- Name: background_jobs_claim_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX background_jobs_claim_idx ON public.background_jobs USING btree (status, available_at, created_at);


--
-- Name: background_jobs_status_available_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX background_jobs_status_available_at_idx ON public.background_jobs USING btree (status, available_at);


--
-- Name: dead_letter_queue_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dead_letter_queue_created_at_idx ON public.dead_letter_queue USING btree (created_at DESC);


--
-- Name: drivers_license_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX drivers_license_trgm_idx ON public.drivers USING gin (license_number public.gin_trgm_ops);


--
-- Name: drivers_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX drivers_name_trgm_idx ON public.drivers USING gin (name public.gin_trgm_ops);


--
-- Name: drivers_phone_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX drivers_phone_trgm_idx ON public.drivers USING gin (phone public.gin_trgm_ops);


--
-- Name: email_notifications_ticket_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_notifications_ticket_idx ON public.email_notifications USING btree (ticket_id, sent_at DESC);


--
-- Name: feedback_email_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_email_trgm_idx ON public.feedback USING gin (email public.gin_trgm_ops);


--
-- Name: feedback_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_name_trgm_idx ON public.feedback USING gin (name public.gin_trgm_ops);


--
-- Name: fleet_telemetry_observed_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fleet_telemetry_observed_at_idx ON public.fleet_telemetry USING btree (observed_at DESC);


--
-- Name: hubs_location_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hubs_location_trgm_idx ON public.hubs USING gin (location public.gin_trgm_ops);


--
-- Name: hubs_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hubs_name_trgm_idx ON public.hubs USING gin (name public.gin_trgm_ops);


--
-- Name: idx_message_outbound_meta_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_outbound_meta_message_id ON public.message_outbound USING btree (meta_message_id);


--
-- Name: idx_message_outbound_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_outbound_phone ON public.message_outbound USING btree (phone);


--
-- Name: idx_message_outbound_provider_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_outbound_provider_message_id ON public.message_outbound USING btree (provider_message_id);


--
-- Name: idx_notifications_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_pending ON public.notifications USING btree (status) WHERE (status = 'pending'::text);


--
-- Name: idx_tickets_sla_breach; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_sla_breach ON public.tickets USING btree (sla_breached) WHERE (sla_breached = true);


--
-- Name: idx_tickets_sla_deadlines; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_sla_deadlines ON public.tickets USING btree (sla_deadline_first_response, sla_deadline_resolution) WHERE (status <> 'resolved'::public.ticket_status);


--
-- Name: idx_whatsapp_subscribers_opted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_whatsapp_subscribers_opted ON public.whatsapp_subscribers USING btree (opted_in);


--
-- Name: invoices_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_created_at_idx ON public.invoices USING btree (created_at DESC);


--
-- Name: invoices_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_customer_id_idx ON public.invoices USING btree (customer_id);


--
-- Name: invoices_shipment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_shipment_id_idx ON public.invoices USING btree (shipment_id);


--
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- Name: manifest_item_handoffs_item_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifest_item_handoffs_item_created_idx ON public.manifest_item_handoffs USING btree (manifest_item_id, created_at);


--
-- Name: manifest_item_handoffs_one_received_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX manifest_item_handoffs_one_received_unique ON public.manifest_item_handoffs USING btree (manifest_item_id) WHERE (outcome = 'received'::public.manifest_handoff_outcome);


--
-- Name: manifest_items_manifest_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifest_items_manifest_id_idx ON public.manifest_items USING btree (manifest_id);


--
-- Name: manifest_items_manifest_shipment_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX manifest_items_manifest_shipment_unique ON public.manifest_items USING btree (manifest_id, shipment_id);


--
-- Name: manifest_items_one_active_shipment_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX manifest_items_one_active_shipment_unique ON public.manifest_items USING btree (shipment_id) WHERE is_active;


--
-- Name: manifest_items_shipment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifest_items_shipment_id_idx ON public.manifest_items USING btree (shipment_id);


--
-- Name: manifests_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_created_by_idx ON public.manifests USING btree (created_by);


--
-- Name: manifests_destination_hub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_destination_hub_idx ON public.manifests USING btree (destination_hub_id);


--
-- Name: manifests_driver_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_driver_id_idx ON public.manifests USING btree (driver_id);


--
-- Name: manifests_origin_hub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_origin_hub_idx ON public.manifests USING btree (origin_hub_id);


--
-- Name: manifests_reference_id_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_reference_id_trgm_idx ON public.manifests USING gin (reference_id public.gin_trgm_ops);


--
-- Name: manifests_vehicle_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX manifests_vehicle_id_idx ON public.manifests USING btree (vehicle_id);


--
-- Name: message_outbound_related_invoice_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_outbound_related_invoice_id_idx ON public.message_outbound USING btree (related_invoice_id);


--
-- Name: message_outbound_related_ticket_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_outbound_related_ticket_id_idx ON public.message_outbound USING btree (related_ticket_id);


--
-- Name: notifications_ticket_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_ticket_id_idx ON public.notifications USING btree (ticket_id);


--
-- Name: shipment_legs_shipment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_legs_shipment_id_idx ON public.shipment_legs USING btree (shipment_id);


--
-- Name: shipment_legs_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_legs_status_idx ON public.shipment_legs USING btree (status);


--
-- Name: shipments_awb_number_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_awb_number_trgm_idx ON public.shipments USING gin (awb_number public.gin_trgm_ops);


--
-- Name: shipments_booking_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_booking_date_idx ON public.shipments USING btree (booking_date);


--
-- Name: shipments_consignee_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_consignee_name_trgm_idx ON public.shipments USING gin (consignee_name public.gin_trgm_ops);


--
-- Name: shipments_consignor_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_consignor_name_trgm_idx ON public.shipments USING gin (consignor_name public.gin_trgm_ops);


--
-- Name: shipments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_created_at_idx ON public.shipments USING btree (created_at DESC);


--
-- Name: shipments_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_customer_id_idx ON public.shipments USING btree (customer_id);


--
-- Name: shipments_status_booking_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_status_booking_date_idx ON public.shipments USING btree (status, booking_date);


--
-- Name: shipments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_status_idx ON public.shipments USING btree (status);


--
-- Name: ticket_replies_ticket_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ticket_replies_ticket_id_idx ON public.ticket_replies USING btree (ticket_id);


--
-- Name: tickets_awb_number_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_awb_number_trgm_idx ON public.tickets USING gin (awb_number public.gin_trgm_ops);


--
-- Name: tickets_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_created_at_idx ON public.tickets USING btree (created_at DESC);


--
-- Name: tickets_customer_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_customer_email_idx ON public.tickets USING btree (customer_email);


--
-- Name: tickets_customer_email_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_customer_email_trgm_idx ON public.tickets USING gin (customer_email public.gin_trgm_ops);


--
-- Name: tickets_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_customer_id_idx ON public.tickets USING btree (customer_id);


--
-- Name: tickets_customer_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_customer_name_trgm_idx ON public.tickets USING gin (customer_name public.gin_trgm_ops);


--
-- Name: tickets_status_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_status_created_at_idx ON public.tickets USING btree (status, created_at DESC);


--
-- Name: tickets_subject_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_subject_trgm_idx ON public.tickets USING gin (subject public.gin_trgm_ops);


--
-- Name: tickets_whatsapp_active_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tickets_whatsapp_active_lookup ON public.tickets USING btree (customer_phone, updated_at DESC) WHERE ((source = 'whatsapp'::text) AND (status = ANY (ARRAY['open'::public.ticket_status, 'in_progress'::public.ticket_status, 'awaiting_customer'::public.ticket_status])));


--
-- Name: tracking_events_awb_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tracking_events_awb_number_idx ON public.tracking_events USING btree (awb_number);


--
-- Name: tracking_events_shipment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tracking_events_shipment_id_idx ON public.tracking_events USING btree (shipment_id);


--
-- Name: user_passkeys_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_passkeys_user_id_idx ON public.user_passkeys USING btree (user_id);


--
-- Name: users_city_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_city_trgm_idx ON public.users USING gin (city public.gin_trgm_ops);


--
-- Name: users_email_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_trgm_idx ON public.users USING gin (email public.gin_trgm_ops);


--
-- Name: users_name_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_name_trgm_idx ON public.users USING gin (name public.gin_trgm_ops);


--
-- Name: users_phone_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_phone_trgm_idx ON public.users USING gin (phone public.gin_trgm_ops);


--
-- Name: vehicles_driver_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicles_driver_id_idx ON public.vehicles USING btree (driver_id);


--
-- Name: vehicles_reg_number_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicles_reg_number_trgm_idx ON public.vehicles USING gin (registration_number public.gin_trgm_ops);


--
-- Name: ticket_replies trigger_first_reply; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_first_reply AFTER INSERT ON public.ticket_replies FOR EACH ROW EXECUTE FUNCTION public.update_first_reply();


--
-- Name: email_notifications email_notifications_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE SET NULL;


--
-- Name: fleet_telemetry fleet_telemetry_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fleet_telemetry
    ADD CONSTRAINT fleet_telemetry_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: invoices invoices_shipment_id_shipments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_shipment_id_shipments_id_fk FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE RESTRICT;


--
-- Name: manifest_item_handoffs manifest_item_handoffs_manifest_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_item_handoffs
    ADD CONSTRAINT manifest_item_handoffs_manifest_item_id_fkey FOREIGN KEY (manifest_item_id) REFERENCES public.manifest_items(id) ON DELETE RESTRICT;


--
-- Name: manifest_item_handoffs manifest_item_handoffs_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_item_handoffs
    ADD CONSTRAINT manifest_item_handoffs_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: manifest_items manifest_items_manifest_id_manifests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_items
    ADD CONSTRAINT manifest_items_manifest_id_manifests_id_fk FOREIGN KEY (manifest_id) REFERENCES public.manifests(id) ON DELETE CASCADE;


--
-- Name: manifest_items manifest_items_shipment_id_shipments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifest_items
    ADD CONSTRAINT manifest_items_shipment_id_shipments_id_fk FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE;


--
-- Name: manifests manifests_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: manifests manifests_destination_hub_id_hubs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_destination_hub_id_hubs_id_fk FOREIGN KEY (destination_hub_id) REFERENCES public.hubs(id) ON DELETE RESTRICT;


--
-- Name: manifests manifests_driver_id_drivers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_driver_id_drivers_id_fk FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: manifests manifests_origin_hub_id_hubs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_origin_hub_id_hubs_id_fk FOREIGN KEY (origin_hub_id) REFERENCES public.hubs(id) ON DELETE RESTRICT;


--
-- Name: manifests manifests_vehicle_id_vehicles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.manifests
    ADD CONSTRAINT manifests_vehicle_id_vehicles_id_fk FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;


--
-- Name: message_outbound message_outbound_related_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_outbound
    ADD CONSTRAINT message_outbound_related_invoice_id_fkey FOREIGN KEY (related_invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- Name: message_outbound message_outbound_related_ticket_id_tickets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_outbound
    ADD CONSTRAINT message_outbound_related_ticket_id_tickets_id_fk FOREIGN KEY (related_ticket_id) REFERENCES public.tickets(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shipment_legs shipment_legs_destination_hub_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_destination_hub_id_fkey FOREIGN KEY (destination_hub_id) REFERENCES public.hubs(id) ON DELETE RESTRICT;


--
-- Name: shipment_legs shipment_legs_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: shipment_legs shipment_legs_manifest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_manifest_id_fkey FOREIGN KEY (manifest_id) REFERENCES public.manifests(id) ON DELETE SET NULL;


--
-- Name: shipment_legs shipment_legs_origin_hub_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_origin_hub_id_fkey FOREIGN KEY (origin_hub_id) REFERENCES public.hubs(id) ON DELETE RESTRICT;


--
-- Name: shipment_legs shipment_legs_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE;


--
-- Name: shipment_legs shipment_legs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_legs
    ADD CONSTRAINT shipment_legs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;


--
-- Name: shipments shipments_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: ticket_replies ticket_replies_ticket_id_tickets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_replies
    ADD CONSTRAINT ticket_replies_ticket_id_tickets_id_fk FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tracking_events tracking_events_shipment_id_shipments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracking_events
    ADD CONSTRAINT tracking_events_shipment_id_shipments_id_fk FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE;


--
-- Name: user_mfa user_mfa_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_mfa
    ADD CONSTRAINT user_mfa_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_passkeys user_passkeys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_passkeys
    ADD CONSTRAINT user_passkeys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_driver_id_drivers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_driver_id_drivers_id_fk FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: profiles Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: profiles Enable update for users based on id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable update for users based on id" ON public.profiles FOR UPDATE TO authenticated USING ((( SELECT auth.uid() AS uid) = id)) WITH CHECK ((( SELECT auth.uid() AS uid) = id));


--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: auth_token_consumptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auth_token_consumptions ENABLE ROW LEVEL SECURITY;

--
-- Name: background_jobs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;

--
-- Name: dead_letter_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dead_letter_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: drivers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

--
-- Name: email_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: fleet_telemetry; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fleet_telemetry ENABLE ROW LEVEL SECURITY;

--
-- Name: hubs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: manifest_item_handoffs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.manifest_item_handoffs ENABLE ROW LEVEL SECURITY;

--
-- Name: manifest_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.manifest_items ENABLE ROW LEVEL SECURITY;

--
-- Name: manifests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.manifests ENABLE ROW LEVEL SECURITY;

--
-- Name: message_outbound; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.message_outbound ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: pricing_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: shipment_legs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shipment_legs ENABLE ROW LEVEL SECURITY;

--
-- Name: shipments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

--
-- Name: sla_policies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;

--
-- Name: ticket_replies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

--
-- Name: tickets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

--
-- Name: tracking_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

--
-- Name: user_mfa; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;

--
-- Name: user_passkeys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: vehicles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

--
-- Name: whatsapp_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.whatsapp_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION get_resolution_metrics(days_back integer); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.get_resolution_metrics(days_back integer) TO anon;
GRANT ALL ON FUNCTION public.get_resolution_metrics(days_back integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_resolution_metrics(days_back integer) TO service_role;


--
-- Name: FUNCTION get_sla_breach_rate(days_back integer); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.get_sla_breach_rate(days_back integer) TO anon;
GRANT ALL ON FUNCTION public.get_sla_breach_rate(days_back integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_sla_breach_rate(days_back integer) TO service_role;


--
-- Name: FUNCTION rls_auto_enable(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;


--
-- Name: FUNCTION update_first_reply(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.update_first_reply() TO anon;
GRANT ALL ON FUNCTION public.update_first_reply() TO authenticated;
GRANT ALL ON FUNCTION public.update_first_reply() TO service_role;


--
-- Name: TABLE audit_log; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.audit_log TO anon;
GRANT ALL ON TABLE public.audit_log TO authenticated;
GRANT ALL ON TABLE public.audit_log TO service_role;


--
-- Name: TABLE auth_token_consumptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.auth_token_consumptions TO service_role;


--
-- Name: TABLE background_jobs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.background_jobs TO service_role;


--
-- Name: TABLE dead_letter_queue; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.dead_letter_queue TO service_role;


--
-- Name: TABLE drivers; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.drivers TO anon;
GRANT ALL ON TABLE public.drivers TO authenticated;
GRANT ALL ON TABLE public.drivers TO service_role;


--
-- Name: TABLE email_notifications; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.email_notifications TO service_role;


--
-- Name: TABLE feedback; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.feedback TO anon;
GRANT ALL ON TABLE public.feedback TO authenticated;
GRANT ALL ON TABLE public.feedback TO service_role;


--
-- Name: TABLE fleet_telemetry; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.fleet_telemetry TO service_role;


--
-- Name: TABLE hubs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.hubs TO anon;
GRANT ALL ON TABLE public.hubs TO authenticated;
GRANT ALL ON TABLE public.hubs TO service_role;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.invoices TO anon;
GRANT ALL ON TABLE public.invoices TO authenticated;
GRANT ALL ON TABLE public.invoices TO service_role;


--
-- Name: TABLE manifest_item_handoffs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.manifest_item_handoffs TO service_role;


--
-- Name: TABLE manifest_items; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.manifest_items TO anon;
GRANT ALL ON TABLE public.manifest_items TO authenticated;
GRANT ALL ON TABLE public.manifest_items TO service_role;


--
-- Name: TABLE manifests; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.manifests TO anon;
GRANT ALL ON TABLE public.manifests TO authenticated;
GRANT ALL ON TABLE public.manifests TO service_role;


--
-- Name: TABLE message_outbound; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.message_outbound TO anon;
GRANT ALL ON TABLE public.message_outbound TO authenticated;
GRANT ALL ON TABLE public.message_outbound TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: TABLE pricing_rules; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.pricing_rules TO anon;
GRANT ALL ON TABLE public.pricing_rules TO authenticated;
GRANT ALL ON TABLE public.pricing_rules TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,MAINTAIN ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: COLUMN profiles.full_name; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(full_name) ON TABLE public.profiles TO authenticated;


--
-- Name: COLUMN profiles.avatar_url; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(avatar_url) ON TABLE public.profiles TO authenticated;


--
-- Name: COLUMN profiles.email_notifications; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(email_notifications) ON TABLE public.profiles TO authenticated;


--
-- Name: COLUMN profiles.whatsapp_notifications; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(whatsapp_notifications) ON TABLE public.profiles TO authenticated;


--
-- Name: COLUMN profiles.sms_notifications; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(sms_notifications) ON TABLE public.profiles TO authenticated;


--
-- Name: TABLE shipment_legs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.shipment_legs TO authenticated;
GRANT ALL ON TABLE public.shipment_legs TO service_role;


--
-- Name: TABLE shipments; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.shipments TO anon;
GRANT ALL ON TABLE public.shipments TO authenticated;
GRANT ALL ON TABLE public.shipments TO service_role;


--
-- Name: TABLE sla_policies; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.sla_policies TO anon;
GRANT ALL ON TABLE public.sla_policies TO authenticated;
GRANT ALL ON TABLE public.sla_policies TO service_role;


--
-- Name: TABLE ticket_replies; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.ticket_replies TO anon;
GRANT ALL ON TABLE public.ticket_replies TO authenticated;
GRANT ALL ON TABLE public.ticket_replies TO service_role;


--
-- Name: TABLE tickets; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.tickets TO anon;
GRANT ALL ON TABLE public.tickets TO authenticated;
GRANT ALL ON TABLE public.tickets TO service_role;


--
-- Name: TABLE tracking_events; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.tracking_events TO anon;
GRANT ALL ON TABLE public.tracking_events TO authenticated;
GRANT ALL ON TABLE public.tracking_events TO service_role;


--
-- Name: TABLE user_mfa; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_mfa TO service_role;


--
-- Name: TABLE user_passkeys; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.user_passkeys TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE vehicles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.vehicles TO anon;
GRANT ALL ON TABLE public.vehicles TO authenticated;
GRANT ALL ON TABLE public.vehicles TO service_role;


--
-- Name: TABLE whatsapp_subscribers; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.whatsapp_subscribers TO anon;
GRANT ALL ON TABLE public.whatsapp_subscribers TO authenticated;
GRANT ALL ON TABLE public.whatsapp_subscribers TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--



--
-- PostgreSQL database dump complete
--



SELECT pg_catalog.set_config('search_path','public, extensions',false);

CREATE EVENT TRIGGER ensure_rls ON ddl_command_end WHEN TAG IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO') EXECUTE FUNCTION public.rls_auto_enable();
