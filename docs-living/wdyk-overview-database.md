EDITOR NOTES - BEGIN

_change_ - add/edit/remove text
_think_ - something to consider, requires further consideration
_note_ - persistent comments, not editor notes

```
*change*
 - add/edit/remove larger text
```

```
*think*
  something to consider, requires further consideration. Larger discussions
```

```
*note*
  note to explain something anything.
  These have similar purpose as code comments. not really editor notes
  The should remain in the document, unchanged but anybody other than the user.
```

Editor's notes should never be removed.
The are used to identify user (my) thoughts, ideas and changes .

EDITOR NOTES - END

# Database Schema Overview

Root Entities are determined by their absence of FK.

## Implementation Priority - Root Entities

API CRUD Appropriate:

1. Course Archetype _FIRST_TO_BE_COMPLETED_

   - No FKs (institutionId is optional/configurable)
   - Template creation/management
   - Base for curriculum design

2. User _FIRST_TO_BE_COMPLETED_
   - No FKs (institutionId is optional/configurable)
   - Account management
   - Core identity entity

NOT API CRUD Appropriate:

1. Learning Institution _FIRST_TO_BE_COMPLETED_

   - No FKs
   - System-level configuration
   - Part of larger setup process

2. Role Type _FIRST_TO_BE_COMPLETED_
   - No FKs
   - System-defined roles
   - Core configuration

## Purpose of this document

This document is a high-level overview of the database schema for the What Do You Know (WDYK) platform. It is a living document and likely to change over time. It is used to facilitate understanding between the
developer and the Cursor/Composer/Agent.

We use this document to gain a mutual understanding of the database schema. For actual Schema, see the database.

For detailed discussion of role types, access patterns, and system architecture, see wdyk-overview-technical.md.

## Conventions

- PK: Primary Key
- FK: Foreign Key
- Table names should be plural except where it makes sense not to be
- Composite keys are preferred over synthetic keys when the natural composite key fully captures the entity's identity
- Use VARCHAR with size limits instead of TEXT when the maximum length can be reasonably determined
- All tables include:
  - created_at TIMESTAMP
  - updated_at TIMESTAMP
  - deleted_at TIMESTAMP (soft delete)

### Permission Resolution Rules

Access control follows these principles:

- Permissions are pessimistic (deny by default)
- Access requires an explicit 'allow' grant
- Any explicit 'deny' grant overrides all 'allow' grants
- Grants can come from group membership or individual user grants
- Empty conditions list means the grant always applies
- All conditions in a grant must be satisfied (logical AND)

### Grant Naming Conventions

Grants follow the pattern: `resource:action`

- Resources are plural nouns matching table names (e.g., courses, users, exams)
- Actions are standardized verbs describing the operation
- We make effort to create only allow grants. deny grants are created only in dire circumstances. (the default is to deny, no need to clutter permissions chain)

Standard Actions:

- create: Create new resource
- get-one: Read single resource
- get-many: Read multiple resources
- update-one: Modify existing resource
- update-many: Bulk modify resources
- delete-soft: Mark resource as deleted
- restore-soft-delete: Restore soft-deleted resource
- approve: Approve resource state change
- reject: Reject resource state change

* these are 'suggested' names. when applicable use these.
  Examples:

- courses:create
- users:manage
- exams:get-one
- enrollments:update-many
- content:approve

## Core Tables

learning_institutions

- institutionId,
- name VARCHAR(255) UNIQUE,
- settings JSONB
- PK(institutionId)

users

- userId,
- institutionId,
- username VARCHAR(255) UNIQUE,
- email VARCHAR(255) UNIQUE,
- status ENUM('active', 'inactive', 'redacted')
- PK(userId)
- FK(institutionId) references learning_institutions

groups

- groupId,
- name VARCHAR(255) UNIQUE,
- description VARCHAR(1024)
- PK(groupId)

group_memberships

- userId,
- groupId,
- status ENUM('active', 'inactive')
- PK(userId, groupId)
- FK(userId) references users
- FK(groupId) references groups

access_grants

- grantId VARCHAR(255) UNIQUE,
- description VARCHAR(1024),
- PK(grantId)

group_grants

- groupId,
- grantId,
- allowDeny ENUM('allow', 'deny'),
- conditions JSONB,
- PK(groupId, grantId)
- FK(groupId) references groups
- FK(grantId) references access_grants

```*notes*
  logging should have something to the effect
  'user' allowed access to 'action' on 'resource' by virtue of group grant 'grant', or individual grant 'grant'


  also we will need to log changes to grants, user x, added grant y, to group z.
```

user_grants

- userId,
- grantId,
- allowDeny ENUM('allow', 'deny'),
- conditions JSONB,
- PK(userId, grantId)
- FK(userId) references users
- FK(grantId) references access_grants

course_archetype

- courseArchetypeId,
- institutionId,
- code VARCHAR(255) UNIQUE,
- creditHours INTEGER,
- version INTEGER
- PK(courseArchetypeId)
- FK(institutionId) references learning_institutions

course_actual

- courseArchetypeId,
- version INTEGER,
- schedule JSONB,
- startDate TIMESTAMP,
- endDate TIMESTAMP,
- status ENUM('draft', 'active', 'completed')
- PK(courseArchetypeId, version)
- FK(courseArchetypeId) references course_archetype

course_enrollment

- userId,
- courseArchetypeId,
- version INTEGER,
- role ENUM('student', 'instructor'),
- status ENUM('active', 'dropped', 'completed'),
- enrollmentDate TIMESTAMP
- PK(userId, courseArchetypeId, version)
- FK(userId) references users
- FK(courseArchetypeId, version) references course_actual

exam_archetype

- examArchetypeId,
- courseArchetypeId,
- timeLimit INTEGER,
- passingScore INTEGER,
- version INTEGER
- PK(examArchetypeId)
- FK(courseArchetypeId) references course_archetype

exam_actual

- examArchetypeId,
- version INTEGER,
- userId,
- startTime TIMESTAMP,
- completionTime TIMESTAMP,
- score INTEGER,
- status ENUM('in-progress', 'completed', 'graded')
- PK(examArchetypeId, version, userId)
- FK(examArchetypeId) references exam_archetype
- FK(userId) references users

question_archetype

- questionArchetypeId,
- examArchetypeId,
- type ENUM('multiple-choice', 'free-text', ...),
- points INTEGER,
- difficulty INTEGER
- PK(questionArchetypeId)
- FK(examArchetypeId) references exam_archetype

question_actual

- questionArchetypeId,
- examArchetypeId,
- version INTEGER,
- userId,
- score INTEGER,
- attemptCount INTEGER
- PK(questionArchetypeId, examArchetypeId, version, userId)
- FK(questionArchetypeId) references question_archetype
- FK(examArchetypeId, version, userId) references exam_actual

## Normalization Analysis

The schema achieves BCNF because:

1. All functional dependencies are on candidate keys
2. Every determinant is a candidate key
3. No transitive dependencies exist
4. All tables have atomic attributes

Key Design Decisions:

1. One-to-Many relationships are enforced through foreign keys
2. Composite types (e.g., schedule, settings) use JSONB for flexibility `*think* is that something we decided`?
3. Role relationships are fully normalized with support for conditions and observer patterns

## Relationship Summary

### One-to-Many Relationships:

1. Institution -> Users
2. Institution -> Course Archetypes
3. Course Archetype -> Course Actuals
4. Course Archetype -> Exam Archetypes
5. Course Actual -> Course Enrollments
6. Course Actual -> Exam Actuals
7. Exam Archetype -> Question Archetypes
8. Exam Archetype -> Exam Actuals
9. Question Archetype -> Question Actuals
10. Question Archetype -> Valid Answers
11. User -> User Roles
12. Role Type -> User Roles
13. User Role -> Observer Roles

## Seed Instructions

### groups table

    INSERT INTO groups (name, description) VALUES
        ('students', 'Base learning group'),
        ('instructors', 'Course management and content creation'),
        ('administrators', 'System administration'),
        ('proctors', 'Exam supervision'),
        ('teaching_assistants', 'Assists instructors with limited permissions'),
        ('content_creators', 'Creates course/exam templates'),
        ('student_mentors', 'Experienced students who help others'),
        ('observers', 'Base observation group'),
        ('parent_observers', 'Guardians with observation rights'),
        ('admin_observers', 'System-level observation'),
        ('course_observers', 'Course-specific observation');

### access_grants table

    INSERT INTO access_grants (grantValue, description) VALUES
        ('course:create', 'Can create new courses'),
        ('course:update', 'Can update course details'),
        ('course:delete', 'Can delete courses'),
        ('course:view', 'Can view course details'),
        ('course:observe', 'Can observe course activity'),
        ('exam:create', 'Can create new exams'),
        ('exam:take', 'Can take exams'),
        ('exam:grade', 'Can grade exams'),
        ('user:manage', 'Can manage user accounts'),
        ('group:manage', 'Can manage groups'),
        ('content:create', 'Can create course content'),
        ('content:approve', 'Can approve course content');

### group_grants example

    INSERT INTO group_grants (groupId, grantId, allowDeny, conditions) VALUES
        (1, 1, 'deny', '[]'),                              -- students denied course creation
        (2, 1, 'allow', '[]'),                            -- instructors can create courses
        (2, 5, 'allow', '{"courseIds": ["${ownCourses}"]}'), -- instructors can observe their own courses
        (9, 5, 'allow', '{"courseIds": ["${studentCourses}"]}'); -- parent observers can observe their student's courses
