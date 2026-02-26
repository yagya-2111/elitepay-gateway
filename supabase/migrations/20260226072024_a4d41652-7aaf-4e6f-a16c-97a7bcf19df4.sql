
-- Create kyc_documents table
CREATE TABLE public.kyc_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aadhaar_front_url TEXT NOT NULL,
  aadhaar_back_url TEXT NOT NULL,
  pan_card_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can insert their own KYC" ON public.kyc_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own KYC" ON public.kyc_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all KYC" ON public.kyc_documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update KYC status" ON public.kyc_documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create kyc-documents storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', true);

-- Storage policies for kyc-documents
CREATE POLICY "Users can upload KYC docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own KYC docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins can view all KYC docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kyc-documents' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for screenshots bucket (admin access)
CREATE POLICY "Admins can view all screenshots" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'screenshots' AND public.has_role(auth.uid(), 'admin'));
