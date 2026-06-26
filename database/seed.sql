-- Career Roles
INSERT INTO career_roles (role_name, description)
VALUES
('AI Engineer', 'Builds AI and Machine Learning solutions'),
('Data Scientist', 'Analyzes data to generate insights'),
('Full Stack Developer', 'Develops frontend and backend applications'),
('Frontend Developer', 'Builds modern web interfaces'),
('Backend Developer', 'Develops APIs and server-side systems')
ON CONFLICT (role_name) DO NOTHING;
-- ==========================
-- Data Scientist Skills
-- ==========================

INSERT INTO role_skills (role_id, skill_name, importance)
SELECT id, 'Python', 5 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'SQL', 5 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Pandas', 5 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'NumPy', 4 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Statistics', 5 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Machine Learning', 4 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Data Visualization', 5 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Power BI', 4 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Tableau', 4 FROM career_roles WHERE role_name='Data Scientist'
UNION ALL
SELECT id, 'Excel', 3 FROM career_roles WHERE role_name='Data Scientist';
-- ==========================
-- Full Stack Developer Skills
-- ==========================

INSERT INTO role_skills (role_id, skill_name, importance)
SELECT id,'HTML',5 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'CSS',5 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'JavaScript',5 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'TypeScript',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'React',5 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'Next.js',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'Node.js',5 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'Express.js',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'PostgreSQL',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'MongoDB',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'Git',4 FROM career_roles WHERE role_name='Full Stack Developer'
UNION ALL
SELECT id,'REST API',5 FROM career_roles WHERE role_name='Full Stack Developer';
-- ==========================
-- Frontend Developer Skills
-- ==========================

INSERT INTO role_skills (role_id, skill_name, importance)
SELECT id,'HTML',5 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'CSS',5 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'JavaScript',5 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'TypeScript',4 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'React',5 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'Next.js',4 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'Tailwind CSS',5 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'Responsive Design',4 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'Git',4 FROM career_roles WHERE role_name='Frontend Developer'
UNION ALL
SELECT id,'UI/UX Basics',3 FROM career_roles WHERE role_name='Frontend Developer';
-- ==========================
-- Backend Developer Skills
-- ==========================

INSERT INTO role_skills (role_id, skill_name, importance)
SELECT id,'Node.js',5 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'Express.js',5 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'PostgreSQL',5 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'MongoDB',4 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'REST API',5 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'Authentication',5 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'JWT',4 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'Docker',3 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'Git',4 FROM career_roles WHERE role_name='Backend Developer'
UNION ALL
SELECT id,'API Security',5 FROM career_roles WHERE role_name='Backend Developer';