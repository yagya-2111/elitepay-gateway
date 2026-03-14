
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (public site needs QR/UPI info)
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT TO public USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Super admins too
CREATE POLICY "Super admins can manage site settings" ON public.site_settings FOR ALL TO public USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default empty settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('usdt_qr_url', ''),
  ('upi_qr_url', ''),
  ('usdt_address', ''),
  ('upi_address', '');
