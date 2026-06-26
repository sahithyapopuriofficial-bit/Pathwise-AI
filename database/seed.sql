-- Career Roles
INSERT INTO career_roles (role_name, description)
VALUES
('AI Engineer', 'Builds AI and Machine Learning solutions'),
('Data Scientist', 'Analyzes data to generate insights'),
('Full Stack Developer', 'Develops frontend and backend applications'),
('Frontend Developer', 'Builds modern web interfaces'),
('Backend Developer', 'Develops APIs and server-side systems')
ON CONFLICT (role_name) DO NOTHING;