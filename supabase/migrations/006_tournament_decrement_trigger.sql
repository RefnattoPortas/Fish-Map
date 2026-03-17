-- ============================================================
-- WikiFish Tournaments Decrement Trigger
-- ============================================================

-- Function to decrement available spots (max_participants) on new tournament registration
CREATE OR REPLACE FUNCTION public.decrement_tournament_participants()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.tournaments
    SET max_participants = max_participants - 1
    WHERE id = NEW.tournament_id AND max_participants > 0;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function after insertion on tournament_participants
DROP TRIGGER IF EXISTS on_tournament_participant_notify ON public.tournament_participants;
CREATE TRIGGER on_tournament_participant_notify
AFTER INSERT ON public.tournament_participants
FOR EACH ROW EXECUTE FUNCTION public.decrement_tournament_participants();
