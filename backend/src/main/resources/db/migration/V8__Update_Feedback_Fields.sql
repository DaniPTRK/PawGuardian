-- Updated the feedback page to have a better view on the user's experience
ALTER TABLE project.feedbacks DROP COLUMN IF EXISTS subscribe;
ALTER TABLE project.feedbacks ADD COLUMN would_recommend VARCHAR(20) NOT NULL DEFAULT 'maybe';
ALTER TABLE project.feedbacks ADD COLUMN mail_accuracy_good BOOLEAN DEFAULT false;
ALTER TABLE project.feedbacks ADD COLUMN experience_friendly BOOLEAN DEFAULT false;
ALTER TABLE project.feedbacks ADD COLUMN vet_satisfied BOOLEAN DEFAULT false;

