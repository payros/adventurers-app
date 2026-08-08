-- Dev-only sample data. Applied via: ./dev.sh --sample-data
-- Never runs in production.
SET search_path TO adv_db;

INSERT INTO club_years (label, club_name, church_name, start_date, end_date) 
VALUES ('25-26', 'Little Eagles', 'Grace Community Church', '2025-08-15', '2026-05-28');

INSERT INTO children (first_name, last_name, allergies, medical_conditions, physical_restrictions, sex, date_of_birth) 
VALUES ('John', 'Doe', 'Peanuts', 'Asthma', 'Limited running due to asthma', 'male', '2015-03-10'),
       ('Jane', 'Smith', 'Dairy', 'Eczema', NULL, 'female', '2016-07-22'),
       ('Alex', 'Johnson', 'Wheat', 'Allergies', NULL, 'male', '2014-11-05'),
       ('Emily', 'Brown', 'Shellfish', 'Hypertension', NULL, 'female', '2017-02-18'),
       ('Michael', 'Davis', 'Eggs', 'Diabetes', 'Requires snack breaks for blood sugar', 'male', '2013-09-30'),
       ('Sarah', 'Miller', 'Peanuts', 'Asthma', NULL, 'female', '2018-05-12'),
       ('David', 'Wilson', 'Dairy', 'Eczema', NULL, 'male', '2019-08-25'),
       ('Laura', 'Moore', 'Wheat', 'Allergies', NULL, 'female', '2016-04-08'),
       ('James', 'Taylor', 'Shellfish', 'Hypertension', NULL, 'male', '2017-01-15'),
       ('Mia', 'Anderson', 'Eggs', 'Diabetes', 'Requires snack breaks for blood sugar', 'female', '2018-06-20');

INSERT INTO staff (first_name, last_name, email, phone, background_check_expiration)
VALUES ('Alice', 'Johnson', 'alice.johnson@example.com', '555-1234', '2024-08-15'),
       ('Bob', 'Smith', 'bob.smith@example.com', '555-5678', '2024-09-20'),
       ('Charlie', 'Brown', 'charlie.brown@example.com', '555-9012', '2024-10-10'),
       ('Diana', 'Wilson', 'diana.wilson@example.com', '555-3456', '2024-11-05'),
       ('Ethan', 'Moore', 'ethan.moore@example.com', '555-7890', '2024-12-10'),
       ('Fiona', 'Taylor', 'fiona.taylor@example.com', '555-2345', '2024-07-15'),
       ('Grace', 'Harper', 'grace.harper@example.com', '555-4321', '2025-06-01');

INSERT INTO club_years_staff (club_year_id, staff_id, staff_role)
VALUES (1, 7, 'director'),
       (1, 1, 'instructor'),
       (1, 2, 'instructor'),
       (1, 3, 'instructor'),
       (1, 4, 'instructor'),
       (1, 5, 'instructor'),
       (1, 6, 'instructor');

INSERT INTO classes (class, club_year_id, instructor_id)
VALUES ('little_lambs', 1, 1),
       ('eager_beavers', 1, 2),
       ('busy_bees', 1, 3),
       ('sunbeams', 1, 4),
       ('builders', 1, 5),
       ('helping_hands', 1, 6);

INSERT INTO classes_children (club_year_id, class_id, child_id, grade)
VALUES (1, 1, 1,  '5th'),
       (1, 2, 2,  '4th'),
       (1, 3, 3,  '5th'),
       (1, 4, 4,  '3rd'),
       (1, 5, 5,  '5th'),
       (1, 6, 6,  '2nd'),
       (1, 1, 7,  '1st'),
       (1, 2, 8,  '4th'),
       (1, 3, 9,  '3rd'),
       (1, 4, 10, '2nd');

INSERT INTO parents (first_name, last_name, email, phone, address, is_emergency_contact)
VALUES ('Robert', 'Doe', 'robert.doe@example.com', '555-1001', '123 Maple St, Springfield', true),
       ('Susan', 'Smith', 'susan.smith@example.com', '555-1002', '456 Oak Ave, Shelbyville', true),
       ('Mark', 'Johnson', 'mark.johnson@example.com', '555-1003', '789 Pine Rd, Springfield', true),
       ('Linda', 'Brown', 'linda.brown@example.com', '555-1004', '321 Elm St, Shelbyville', true),
       ('Thomas', 'Davis', 'thomas.davis@example.com', '555-1005', '654 Cedar Ln, Springfield', true),
       ('Karen', 'Miller', 'karen.miller@example.com', '555-1006', '987 Birch Blvd, Shelbyville', false),
       ('Patricia', 'Wilson', 'patricia.wilson@example.com', '555-1007', '111 Walnut Dr, Springfield', true),
       ('Steven', 'Taylor', 'steven.taylor@example.com', '555-1008', '222 Spruce Ct, Shelbyville', true);

-- parent_id → child_id
-- Robert Doe → John Doe (1)
-- Susan Smith → Jane Smith (2)
-- Mark Johnson → Alex Johnson (3)
-- Linda Brown → Emily Brown (4)
-- Thomas Davis → Michael Davis (5), Sarah Miller (6)  [blended family]
-- Karen Miller → Sarah Miller (6)
-- Patricia Wilson → David Wilson (7), Laura Moore (8)  [blended family]
-- Steven Taylor → James Taylor (9), Mia Anderson (10)  [blended family]
INSERT INTO parents_children (parent_id, child_id)
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5),
       (5, 6),
       (6, 6),
       (7, 7),
       (7, 8),
       (8, 9),
       (8, 10);

INSERT INTO events (club_year_id, title, event_date)
VALUES (1, 'Summer Picnic', '2025-07-15'),
       (1, 'Fall Festival', '2025-10-05'),
       (1, 'Winter Wonderland', '2025-12-20'),
       (1, 'Spring Cleanup', '2026-03-10'),
       (1, 'Regular Meeting', '2025-09-01'),
       (1, 'Easter Egg Hunt', '2026-04-05');

-- events_awards: link awards to events + classes for 25-26
-- little_lambs (class_id=1) gets awards from Summer Picnic (event_id=1) and Fall Festival (event_id=2)
-- eager_beavers (class_id=2) gets awards from Regular Meeting (event_id=5)
INSERT INTO events_awards (award_id, event_id, class_id)
VALUES (1, 1, 1),
       (2, 1, 1),
       (3, 2, 1),
       (4, 2, 1),
       (22, 5, 2),
       (23, 5, 2);

-- =============================================
-- Club Year 2: 24-25
-- =============================================
INSERT INTO club_years (label, club_name, church_name, start_date, end_date)
VALUES ('24-25', 'Little Eagles', 'Grace Community Church', '2024-08-16', '2025-05-29');

-- Staff assignments for 24-25 (club_year_id = 2)
INSERT INTO club_years_staff (club_year_id, staff_id, staff_role)
VALUES (2, 1, 'director'),
       (2, 2, 'instructor'),
       (2, 3, 'instructor'),
       (2, 4, 'instructor'),
       (2, 5, 'instructor'),
       (2, 6, 'secretary');

-- Classes for 24-25 (club_year_id = 2)
INSERT INTO classes (class, club_year_id, instructor_id)
VALUES ('little_lambs',   2, 2),
       ('eager_beavers',  2, 3),
       ('busy_bees',      2, 4),
       ('sunbeams',       2, 5),
       ('builders',       2, 6),
       ('helping_hands',  2, 1);

-- Class enrollments for 24-25 (club_year_id = 2, class_ids = 7–12)
INSERT INTO classes_children (club_year_id, class_id, child_id, grade)
VALUES (2, 7,  1, '4th'),
       (2, 8,  2, '3rd'),
       (2, 9,  3, '4th'),
       (2, 10, 4, '2nd'),
       (2, 11, 5, '4th'),
       (2, 12, 6, '1st'),
       (2, 7,  7, 'k'),
       (2, 8,  8, '3rd');

-- Events for 24-25
INSERT INTO events (club_year_id, title, event_date)
VALUES (2, 'Kickoff BBQ',        '2024-08-24'),
       (2, 'Harvest Festival',   '2024-10-12'),
       (2, 'Christmas Concert',  '2024-12-14'),
       (2, 'Science Fair',       '2025-02-08'),
       (2, 'Spring Carnival',    '2025-04-19'),
       (2, 'End-of-Year Banquet','2025-05-24');

-- =============================================
-- Club Year 3: 23-24
-- =============================================
INSERT INTO club_years (label, club_name, church_name, start_date, end_date)
VALUES ('23-24', 'Trailblazers', 'Grace Community Church', '2023-08-18', '2024-05-30');

-- Staff assignments for 23-24 (club_year_id = 3)
INSERT INTO club_years_staff (club_year_id, staff_id, staff_role)
VALUES (3, 3, 'director'),
       (3, 1, 'instructor'),
       (3, 2, 'instructor'),
       (3, 4, 'instructor'),
       (3, 5, 'counselor'),
       (3, 6, 'instructor');

-- Classes for 23-24 (club_year_id = 3)
INSERT INTO classes (class, club_year_id, instructor_id)
VALUES ('little_lambs',  3, 1),
       ('eager_beavers', 3, 2),
       ('busy_bees',     3, 4),
       ('sunbeams',      3, 6),
       ('builders',      3, 3),
       ('helping_hands', 3, 5);

-- Class enrollments for 23-24 (club_year_id = 3, class_ids = 13–18)
INSERT INTO classes_children (club_year_id, class_id, child_id, grade)
VALUES (3, 13, 3,  '3rd'),
       (3, 14, 4,  '1st'),
       (3, 15, 5,  '3rd'),
       (3, 16, 6,  'k'),
       (3, 17, 7,  'pre-k'),
       (3, 18, 8,  '2nd'),
       (3, 13, 9,  '2nd'),
       (3, 14, 10, '1st');

-- Events for 23-24
INSERT INTO events (club_year_id, title, event_date)
VALUES (3, 'Welcome Potluck',     '2023-09-09'),
       (3, 'Fall Hike',           '2023-10-21'),
       (3, 'Winter Craft Fair',   '2023-12-09'),
       (3, 'Bowling Night',       '2024-01-27'),
       (3, 'Easter Egg Hunt',     '2024-03-30'),
       (3, 'Closing Ceremony',    '2024-05-18');

-- =============================================
-- Club Year 4: 22-23
-- =============================================
INSERT INTO club_years (label, club_name, church_name, start_date, end_date)
VALUES ('22-23', 'Trailblazers', 'Grace Community Church', '2022-08-19', '2023-05-26');

-- Staff assignments for 22-23 (club_year_id = 4)
INSERT INTO club_years_staff (club_year_id, staff_id, staff_role)
VALUES (4, 5, 'director'),
       (4, 1, 'instructor'),
       (4, 2, 'instructor'),
       (4, 3, 'instructor'),
       (4, 4, 'instructor'),
       (4, 6, 'treasurer');

-- Classes for 22-23 (club_year_id = 4)
INSERT INTO classes (class, club_year_id, instructor_id)
VALUES ('little_lambs',  4, 1),
       ('eager_beavers', 4, 2),
       ('busy_bees',     4, 3),
       ('sunbeams',      4, 4),
       ('builders',      4, 5),
       ('helping_hands', 4, 6);

-- Class enrollments for 22-23 (club_year_id = 4, class_ids = 19–24)
INSERT INTO classes_children (club_year_id, class_id, child_id, grade)
VALUES (4, 19, 1, '2nd'),
       (4, 20, 2, '1st'),
       (4, 21, 3, '2nd'),
       (4, 22, 4, 'k'),
       (4, 23, 5, '2nd'),
       (4, 24, 6, 'pre-k');

-- Events for 22-23
INSERT INTO events (club_year_id, title, event_date)
VALUES (4, 'Opening Night',       '2022-09-03'),
       (4, 'Pumpkin Patch Trip',  '2022-10-15'),
       (4, 'Holiday Party',       '2022-12-10'),
       (4, 'Winter Games',        '2023-01-21'),
       (4, 'Nature Walk',         '2023-03-18'),
       (4, 'Year-End Picnic',     '2023-05-20');

-- =============================================
-- Club Year 5: 21-22
-- =============================================
INSERT INTO club_years (label, club_name, church_name, start_date, end_date)
VALUES ('21-22', 'Trailblazers', 'Grace Community Church', '2021-08-20', '2022-05-27');

-- Staff assignments for 21-22 (club_year_id = 5)
INSERT INTO club_years_staff (club_year_id, staff_id, staff_role)
VALUES (5, 2, 'director'),
       (5, 1, 'instructor'),
       (5, 3, 'instructor'),
       (5, 4, 'instructor'),
       (5, 5, 'instructor'),
       (5, 6, 'chaplain');

-- Classes for 21-22 (club_year_id = 5)
INSERT INTO classes (class, club_year_id, instructor_id)
VALUES ('little_lambs',  5, 1),
       ('eager_beavers', 5, 3),
       ('busy_bees',     5, 4),
       ('sunbeams',      5, 5),
       ('builders',      5, 2),
       ('helping_hands', 5, 6);

-- Class enrollments for 21-22 (club_year_id = 5, class_ids = 25–30)
INSERT INTO classes_children (club_year_id, class_id, child_id, grade)
VALUES (5, 25, 1, '1st'),
       (5, 26, 2, 'k'),
       (5, 27, 3, '1st'),
       (5, 28, 4, 'pre-k'),
       (5, 29, 5, '1st'),
       (5, 30, 6, 'pre-k'),
       (5, 25, 7, 'pre-k'),
       (5, 26, 8, '1st');

-- Events for 21-22
INSERT INTO events (club_year_id, title, event_date)
VALUES (5, 'Back-to-School Night',  '2021-09-11'),
       (5, 'Autumn Craft Day',      '2021-10-23'),
       (5, 'Christmas Play',        '2021-12-18'),
       (5, 'Talent Show',           '2022-02-12'),
       (5, 'Community Service Day', '2022-04-02'),
       (5, 'Graduation Ceremony',   '2022-05-21');
