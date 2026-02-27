
-- Assign super_admin role to satyam71716@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'super_admin'::app_role
FROM public.profiles p
WHERE p.email = 'satyam71716@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Super admins can delete from all tables
CREATE POLICY "Super admins can delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete bank_accounts" ON public.bank_accounts FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete kyc_documents" ON public.kyc_documents FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete payment_screenshots" ON public.payment_screenshots FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete deposits" ON public.deposits FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete withdrawal_requests" ON public.withdrawal_requests FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete user_balances" ON public.user_balances FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admins can manage roles
CREATE POLICY "Super admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));
