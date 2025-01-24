EDITOR NOTES - BEGIN

_change_ - add/edit/remove text
_think_ - something to consider, requires further consideration

```
*change*
 - add/edit/remove larger text
```

```
*think*
  something to consider, requires further consideration. Larger discussions
```

EDITOR NOTES - END

# System Architecture Overview / "What do you Know?" (WDYK) Overview

## Mission Statement

To empower educators and students by leveraging modern technology, making education accessible where traditional methods fall short. We aim to:

- Reduce teacher workload through intelligent automation
- Create pathways to technology in underserved areas
- Support overburdened educators with smart tools
- Make teaching more rewarding through enhanced student engagement
- Provide immediate access to modern educational technologies
- Enable collaborative learning environments regardless of physical location
  `*think* MAKE NO CHANGES THIS IS PERFECT AS IS`

## Core Concepts

### Root Entities

#### Learning Institutions (LI)

The primary organizational unit that facilitates educational relationships between students, teachers, and guardians. Most system implementations will comprise a single Learning Institution, with all activities contained within. While institutions operate independently, deliberate collaboration between LIs is possible through resource sharing mechanisms (Import/Export).

#### QuestionArchetype

```*think*
The robot and I have blended our thoughts on Questions and Exams.
This is a two dimensional concept.

Either unblend  the ideas (sisynct units) or merge them (ExamArchetype, comprises of QuestionArchetype. offer dimensional discourse ?wc? exam q/a, but the question can also have q/a)
```

Through one form or another the Examination Process has been used to teach, test, and evaluate.
Fundamentally, the Examination Process involves prompting user for a response, evaluate the response,
offer feedback, perhaps do it all over again (practice). By evolving that system to include modern technology we can create a more engaging and effective learning experience.
A QuestionArchetype defines:

- Core question content and structure
- Expected response format (multiple choice, free text, etc.)
- Validation rules for correct answers
- Metadata for categorization, difficulty, duration, and other attributes
- Multi-media integration capabilities
- Feedback mechanisms
- Scoring criteria
- Version control information
- response history (evaluate progress)
- Integrate with various multi-media to engage in the four primary learning styles: tactile, auditory, visual, reading and writing.

```*think*
 Research a bit further if we can say " primary learning styles: tactile, auditory, visual, reading and writing."  That's five, I thought there were four.  When I say 'tactile' I meant the thing were
 we learn the patterns and shapes (how I remember larger numbers, how I remember math, moving shit around), I meant to commit to memory by hand motions.  The singing recall similar to tactile recall. We can utilize
 song.
```

QuestionArchetype serves as the foundation for all assessment-related activities, from formal examinations to interactive study materials. Through its flexible design, it supports:

- Traditional testing scenarios
- Self-paced learning exercises
- Collaborative study sessions
- AI-assisted learning adaptations
- Real-time assessment tools
- Progress tracking
- Interactive/Realtime feedback

```
*think*
We don't want to overwhelm we want enough powerful statements the people read them all, think about some.
We don't want more than people will read, encourage thought and engagement through enquiry
```

#### ExaminationArchetype (EA)

Historically, examinations were limited to simple question/answer formats for learning verification. The ExaminationArchetype transforms this traditional concept into a dynamic educational framework. By leveraging modern technology and pedagogical insights, it serves as a flexible foundation for diverse learning experiences:

- Interactive Assessment: Incorporating AI-driven feedback, speech recognition, and multimedia interactions
- Collaborative Learning: Enabling structured teacher-student dialogue and peer-to-peer discussions
- Adaptive Learning: Self-pacing capabilities with automated guidance and personalized feedback
- Multi-modal Engagement: Supporting various learning styles through text, audio, drawing, and multimedia content

This framework adapts to multiple educational contexts:

- Study Guides with interactive content and progress tracking
- Formal Examinations with advanced proctoring capabilities
- Student Workspaces for self-directed learning
- Practice Sessions with immediate feedback
- Lesson Plans with integrated assessment tools

Each adaptation maintains core assessment principles while empowering educators with time-saving automation and enhanced student engagement capabilities.

#### Users

Participants can hold multiple roles simultaneously (e.g., both student and teacher), enabling flexible participation across different contexts while maintaining consistent access controls and permissions.
`*think* This makes sense.. but why? The language lacks something, enabling student to take a more active role in the lessons... and that is where learning happens`

## Resource Types

### Course Archetype

- An item from the Course Catalog (eg, the collection of these are known as CourseCatalog which is owned by the institute)
- Defines subject matter
- Specifies course length
- Maps to curriculum requirements
- Establishes credit-hour difficulty
- Properties:
  - Subject content
  - Duration
  - Curriculum alignment
  - Credit hours
  - Learning objectives
  - Version tracking

### Offered Course (CourseActual, CourseInstance)

- An instance of CourseArchetype
- This is the actual course
- This is owned by both Instructor and Institute (if possible)
- Is observable with the proper permissions
- Is locked to non-particpants or non-observers
- Has start date and end date
- has meeting schedule (Mondays, Wednesday, Fridays from 13:30 - 15:30) We want actual schedule items so we can do scheduling in the future
- Properties:
  - CourseArchetype ID
  - StudentId List (actual relation not yet determiend)
  - instructorId

### ExaminationArchetype

- as seen above
- Is only a model for all the other resource. There are no actual ExaminationArchetype, its only used to define other resources
- Comprised of "Sections"
- Sections Contain Questions
- Properties:
  - Interactive content
  - Notification system
  - Read/unread tracking

### Actual Exams (ExamInstance maybe)

### Lesson Plan

- Is only visible/editable to the instructor
- Is visible to only those with proper observer permissions
- These are created at the instructors descretion, as needed.
- Supports dynamic updates
- Properties:
  - Interactive content
  - Notification system
  - Read/unread tracking

### Study Guide

- Shadow course component
- Instructor-editable
- Visible to all course participants
- Supports dynamic updates
- Properties:
  - Interactive content
  - Notification system
  - Read/unread tracking

### Learning Journal ("Trapper Keeper")

- Personal student resource
- Self-created study materials
- Observable by authorized observers
- Properties:
  - Personal notes
  - Study materials
  - Learning progress
  - Observer access controls

### Study Groups

- Associated with actual courses
- Enable collaborative study
- Allow creation of shared study guides
- Support student interaction
- Properties:
  - Member roster
  - Study materials
  - Practice exams
  - Group communications
  - Access controls

## Import/Export System

- JSON-based format
- Semantic versioning (1.0, 1.1, 2.3)
- Version compatibility rules:
  - Forward compatibility not guaranteed
  - Backward compatibility within major version
  - In plain English: You can import from older versions to newer versions within the same major version number (1.x to 1.y where x < y)
- Exportable resources:
  - Course templates
  - Exam templates
  - Study materials
  - Lesson plans
- Non-exportable:
  - Student grades
  - Personal contributions
  - User data
- Resource sharing capabilities:
  - Institutions can share resources within districts
  - Districts can create centralized resource repositories
  - Community contribution through open-source exam repositories

## Role-Based Access Control

### Core Roles

- Student
- Instructor
- Administrator
- Proctor
- Observer variants: (Should observer have attirbute {target: userId}?)
  - student:observer
  - course:observer
  - instructor:observer
  - parent:observer
  - admin:observer

### Observer Access Rules

- Can view observed subject's activities
- Limited visibility of community resources
- Access to anonymized aggregate data
- Cannot modify any resources
- Specific limitations based on observer type
- Clear logging of observable resources

## Resource Rights Model

Resources are managed through three distinct concepts:

- Ownership: Defines the author or creator of the resource/object
- Modification Privilege: Controls who can alter content
- View Privilege: Controls who can access content

System ownership rules:

- Course resources are co-owned by institutions and instructors
- Personal resources can be published/downloaded by their creators
- Export/import capabilities vary by resource type and ownership
- Institutional relationships determine resource access during active employment
- Teachers can export course materials for new positions
- Institutions retain access for new instructors

## Privacy and Data Handling

- Strict resource access controls
- Community resource anonymization
- Observer data restrictions
- Intellectual property considerations
- Data export limitations
- Personal information protection
- Clear ownership/rights distinction

### User Persistence and Privacy

- Users cannot be deleted due to system integrity requirements
- User records can be redacted/anonymized:
  - Identifying information replaced with "redacted" or empty values
  - Email addresses managed separately for system functionality
  - Historical contributions maintained with anonymized attribution
- Personal information collection strictly limited to course/coursework scope

## Implementation Considerations

- Resource observation permissions may be handled through conditional access rules
- Permission records should include conditions (e.g., {allow:'student'})
- All resources should have observable properties by default
- Access control should be managed through permission conditions rather than explicit observable flags

## System Conventions

- Positivity Scale (-10 to +10):
  - Critical bugs (-10 to -6): Example: Data loss, security breach, system crash
  - Feature-blocking bugs (-5 to -3): Prevents core functionality
  - Minor bugs (-2 to -1): UI glitches, label spelling errors (minimum -1)
  - Feature enhancements (+1 to +2)
  - New capabilities (+3 to +5)
  - System-wide improvements (+6 to +10)
- Story Points used for effort estimation
- Combined metrics guide development priorities
- Work completion score = |bugs| + features = total enhancement value
- We frequently use Class/Instance pattern common to most OOP Programming languages.
  The term "Archetype" denotes a class, while "actual" is the instance of the class.
  _think_ lets define the convention for the term "actual"
  The instructor defines the ExamArchetype but the student takes the ExamActual.
  This is because A) The student owns the exam, and B) the exam is specific an unique to the student.
  This is in part a anti-cheating measure and in part a privacy measure.

### Ramblings of a madman

- With speech userResponse questions,
  we'll want to have many many responses
  try again, practice practice. We need to track history and progress
  _think_ we won't build this question type now. but we need to plan for it.

- how do we incorporate "singing" as a learning/memory technique?
