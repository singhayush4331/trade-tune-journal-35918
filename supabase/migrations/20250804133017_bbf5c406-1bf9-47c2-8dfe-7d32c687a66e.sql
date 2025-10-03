-- Fix the missing initial capital for user wiggly.trader@gmail.com
-- This user has starting_fund = 100000 in their profile but no initial deposit in funds table

-- First, get the user details to confirm
DO $$
DECLARE
    target_user_id UUID;
    user_starting_fund NUMERIC;
    existing_deposits INTEGER;
BEGIN
    -- Get user info
    SELECT id, starting_fund INTO target_user_id, user_starting_fund
    FROM profiles 
    WHERE email = 'wiggly.trader@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Check if they already have an initial deposit
        SELECT COUNT(*) INTO existing_deposits
        FROM funds 
        WHERE user_id = target_user_id 
        AND transaction_type = 'deposit' 
        AND notes = 'Initial capital';
        
        -- Only create initial deposit if they don't have one and have starting_fund
        IF existing_deposits = 0 AND user_starting_fund IS NOT NULL AND user_starting_fund > 0 THEN
            INSERT INTO funds (user_id, amount, transaction_type, notes, date)
            VALUES (target_user_id, user_starting_fund, 'deposit', 'Initial capital', NOW());
            
            RAISE NOTICE 'Created initial deposit of % for user %', user_starting_fund, target_user_id;
        ELSE
            RAISE NOTICE 'User already has % initial deposits or no starting fund set', existing_deposits;
        END IF;
    ELSE
        RAISE NOTICE 'User with email wiggly.trader@gmail.com not found';
    END IF;
END $$;