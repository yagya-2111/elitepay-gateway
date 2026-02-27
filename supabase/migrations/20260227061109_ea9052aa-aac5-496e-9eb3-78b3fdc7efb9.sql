
-- Allow admins to insert withdrawal requests (for fake entries)
CREATE POLICY "Admins can insert withdrawals"
  ON public.withdrawal_requests
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
