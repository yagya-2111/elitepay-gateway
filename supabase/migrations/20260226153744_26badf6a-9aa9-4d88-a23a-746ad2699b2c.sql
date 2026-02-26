
CREATE OR REPLACE FUNCTION public.handle_deposit_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- When deposit status changes to 'confirmed', add equivalent INR to user balance
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.user_balances
    SET inr_balance = inr_balance + (NEW.amount_usd * NEW.rate),
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_deposit_approved
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deposit_approved();
