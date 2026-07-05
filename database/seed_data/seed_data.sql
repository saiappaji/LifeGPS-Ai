-- LifeGPS AI Seed Data
-- Pre-populated career paths for MVP

INSERT INTO career_paths (career_name, required_skills, salary_range_min, salary_range_max, description, difficulty_level, avg_timeline_months) VALUES
(
    'Cloud Engineer',
    '["Linux", "AWS", "Azure", "GCP", "Networking", "Docker", "Kubernetes", "Terraform", "CI/CD", "Python", "Security Fundamentals", "Monitoring"]',
    75000, 145000,
    'Design, implement, and manage cloud infrastructure and services. Work with major cloud providers to build scalable, reliable, and secure systems.',
    'Intermediate',
    8
),
(
    'Software Engineer',
    '["Data Structures", "Algorithms", "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "REST APIs", "System Design", "Testing"]',
    70000, 160000,
    'Design, develop, test, and maintain software applications. Build scalable systems using modern programming languages and frameworks.',
    'Intermediate',
    6
),
(
    'AI Engineer',
    '["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Mathematics", "Statistics", "Data Preprocessing", "MLOps", "SQL"]',
    90000, 180000,
    'Build and deploy AI/ML models and systems. Work with cutting-edge technologies in machine learning, deep learning, and artificial intelligence.',
    'Advanced',
    12
),
(
    'Data Analyst',
    '["SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics", "Data Visualization", "R", "Data Cleaning", "Business Intelligence", "Communication"]',
    55000, 95000,
    'Analyze data to derive actionable insights. Create dashboards, reports, and visualizations to support business decisions.',
    'Beginner',
    4
),
(
    'Cybersecurity Analyst',
    '["Networking", "Linux", "Security Fundamentals", "SIEM", "Firewalls", "Incident Response", "Ethical Hacking", "Compliance", "Cryptography", "Vulnerability Assessment", "Python"]',
    70000, 130000,
    'Protect organizations from cyber threats. Monitor systems, respond to security incidents, and implement security measures.',
    'Intermediate',
    8
),
(
    'DevOps Engineer',
    '["Linux", "Docker", "Kubernetes", "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Ansible", "AWS", "Monitoring", "Python", "Bash Scripting", "Networking"]',
    80000, 155000,
    'Bridge development and operations. Automate infrastructure, manage deployments, and ensure system reliability through DevOps practices.',
    'Intermediate',
    7
);
