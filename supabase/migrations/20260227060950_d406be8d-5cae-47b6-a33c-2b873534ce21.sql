
-- Create triggers for all 3 tables

-- 1. Trigger on deposits table (USDT to INR exchange)
CREATE OR REPLACE TRIGGER on_deposit_approved
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deposit_approved();

-- 2. Trigger on withdrawal_requests table
CREATE OR REPLACE TRIGGER on_withdrawal_approved
  AFTER UPDATE ON public.withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_withdrawal_approved();

-- 3. Function + trigger for payment_screenshots (fund plans)
CREATE OR REPLACE FUNCTION public.handle_payment_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reward_inr numeric;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Determine reward based on plan_number
    CASE NEW.plan_number
      WHEN 1 THEN reward_inr := 20000;
      WHEN 2 THEN reward_inr := 40000;
      WHEN 3 THEN reward_inr := 80000;
      ELSE reward_inr := 0;
    END CASE;

    IF reward_inr > 0 THEN
      UPDATE public.user_balances
      SET inr_balance = inr_balance + reward_inr,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_payment_approved
  AFTER UPDATE ON public.payment_screenshots
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_payment_approved();
