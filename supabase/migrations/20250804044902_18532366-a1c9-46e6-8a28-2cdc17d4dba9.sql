-- Manually verify the user's email since they clicked the confirmation link
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'wiggly.trader@gmail.com' AND email_confirmed_at IS NULL