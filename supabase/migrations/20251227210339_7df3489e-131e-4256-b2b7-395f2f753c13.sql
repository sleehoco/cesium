-- Insert Episode 1 with earlier date
INSERT INTO podcast_episodes (title, audio_url, published_at) 
VALUES ('Cyber Pulse Episode 1', '/podcasts/cyber-pulse-ep-1.mp3', CURRENT_DATE - INTERVAL '7 days');