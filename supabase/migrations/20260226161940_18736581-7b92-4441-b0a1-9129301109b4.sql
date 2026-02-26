
-- Recreate deposit approved trigger
CREATE OR REPLACE FUNCTION public.handle_deposit_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.user_balances
    SET inr_balance = inr_balance + (NEW.amount_usd * NEW.rate),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_deposit_approved ON public.deposits;
CREATE TRIGGER on_deposit_approved
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deposit_approved();

-- Create withdrawal approved trigger to deduct INR balance
CREATE OR REPLACE FUNCTION public.handle_withdrawal_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') AND NEW.withdrawal_type = 'inr' THEN
    UPDATE public.user_balances
    SET inr_balance = GREATEST(0, inr_balance - NEW.amount),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_withdrawal_approved ON public.withdrawal_requests;
CREATE TRIGGER on_withdrawal_approved
  AFTER UPDATE ON public.withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_withdrawal_approved();
