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

- Adaptive Learning: Self-paced exercises with AI-assisted guidance and real-time feedback
- Collaborative Growth: Interactive study sessions and peer-to-peer learning opportunities
- Progress Insights: Comprehensive tracking and assessment tools for both students and educators

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

The system embraces a dynamic role model where participants can hold multiple roles simultaneously (e.g., both student and teacher). This approach:

- Enables peer-teaching opportunities, reinforcing learning through explanation
- Supports mentorship pathways as students progress to teaching assistants
- Creates authentic learning experiences through role transitions
- Maintains consistent access controls while allowing role flexibility

Users manage their AI capabilities through personal API keys, stored securely in their encrypted profile. Agent access is controlled through user-initiated decryption, with clear status indicators (read/locked/unavailable).

## Resource Types

### Course Archetype

- A template in the Course Catalog
- Defines the course structure and requirements
- Owned by the institution
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

### Course Actual

- An implementation of Course Archetype
- Represents a specific offering of a course
- Co-owned by Instructor and Institution
- Is observable with the proper permissions
- Is locked to non-particpants or non-observers
- Has start date and end date
- has meeting schedule (Mondays, Wednesday, Fridays from 13:30 - 15:30) We want actual schedule items so we can do scheduling in the future
- Properties:
  - Course Archetype ID
  - StudentId List (actual relation not yet determiend)
  - instructorId

### ExaminationArchetype

- Serves as a template for Exam Actuals
- Defines the structure and content of examinations
- No direct interaction - only used to create Exam Actuals

### Exam Actual

- A specific implementation of an Examination Archetype
- Owned by a specific student
- Contains student-specific responses and scoring

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

- Associated with Course Actuals
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
  - Course Archetypes
  - Exam Archetypes
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

## Agent Architecture

The system is designed with AI-first principles, prioritizing natural language interactions over traditional point-and-click interfaces. This architecture enables users to accomplish tasks through conversation while maintaining traditional UI access as a fallback.

### Agent Golden Rules

1. Operational Boundaries:
   - Agents can operate only on entities wholly owned by the agent operator (user)
   - All write operations must be confirmed by the agent operator (user)
   - The underlying APIs will ALWAYS verify ownership of the entity before write operations
   - Confirmation tokens may be required for sensitive operations

### Core Agent Concepts

- All agents support streaming responses
- Standard agent operations:
  - fetchAll message
  - findMessage
  - createMessage
  - fileUpload
  - Free text interaction
  - Security/logging appropriate for agent operations

### Communication Infrastructure

Implementation considerations for agent communication:

- Websocket implementation for real-time communication
- Users profile will store API Keys (encrypted), only the user can decrypt agent to guarantee agents is started/stoped by only the user
- Need to carefully scope chat functionality for security/privacy
- Consider real-time features:
  - Exam proctor announcements
  - Study group chat
  - Video conferencing for study groups
- Need working chat prototype to validate agent architecture
- Simple one-way notification system as secondary validation

### Agent Types

#### Resource Agents

Agents that manage specific entity types:

- UserAgent: Manages user entity operations
- Exam Archetype Agent: Handles exam template operations
- Course Agent: Manages course-related tasks

#### Role-Based Agents

Agents that handle role-specific workflows:

- Instructor Agent capabilities:
  - Create/edit exams
  - Manage questions
  - Course management
  - Lesson plan creation
  - Study guide management
  - Study group administration
  - Learning journal oversight

### Agent Implementation Guidelines

1. API Integration:

   - APIs marked with @isAiCallable decorator
   - Endpoints designed for both AI and traditional access
   - Structured for natural language processing

2. Development Flow:

   - Build core entity functionality first
   - Follow with corresponding agent implementation
   - Example: Exam Archetype development followed by Exam Archetype Agent

3. Frontend Integration:

   - Minimize component proliferation
   - Enable natural language task completion
   - Example: "I want a new lesson plan" triggers appropriate agent workflow

4. Testing Considerations:
   - Agent response validation
   - Natural language command coverage
   - Integration with entity operations
   - Security testing:
     - Prompt injection and jailbreak attempts
     - API key misuse prevention
     - Malicious agent call detection
     - Agent operation boundary enforcement

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
- Archetype/Actual Pattern:
  - "Archetype" denotes a template or blueprint
  - "Actual" represents a specific implementation
  - Example: An instructor defines an Exam Archetype (template), students take Exam Actuals
  - This pattern ensures:
    - Clear ownership boundaries
    - Implementation-specific customization
    - Privacy and anti-cheating measures
    - Proper access control

## Core Entity Definitions

### Learning Institution

- **Key Fields**:
  - institutionId: Primary system identifier
  - name: Unique identifier for the institution
  - status: Active/Inactive state
  - settings: Institution-wide configuration
- **Primary Relationships**:
  - One institution has many Users
  - One institution has many Course Archetypes
  - One institution has many Course Actuals

### User

- **Key Fields**:
  - userId: Primary system identifier
  - username: Login identifier (can be email)
  - password: Securely hashed authentication
  - email: Primary contact method
  - status: Account state (active/inactive/redacted)
  - roles: Array of assigned system roles
  - institutionId: Foreign key to Learning Institution
- **Primary Relationships**:
  - One user belongs to one Learning Institution
  - One user has many Course Enrollments
  - One user has many Exam Actuals

### Course Enrollment

- **Key Fields**:
  - enrollmentId: Primary system identifier
  - userId: Foreign key to User
  - courseActualId: Foreign key to Course Actual
  - role: Enrollment type (student/instructor)
  - status: Enrollment state (active/dropped/completed)
  - enrollmentDate: When user joined course
- **Primary Relationships**:
  - One enrollment belongs to one User
  - One enrollment belongs to one Course Actual

### Course Archetype

Course Archetype serves as the template for Course Actual. A dedicated conversion process transforms the Course Archetype record into a Course Actual record, ensuring proper initialization and relationship mapping.

- **Key Fields**:
  - courseArchetypeId: Primary system identifier
  - institutionId: Foreign key to Learning Institution
  - code: Course identifier (e.g., "MATH101")
  - title: Display name
  - creditHours: Academic credit value
  - version: For tracking changes
- **Primary Relationships**:
  - One course Archetype belongs to one Learning Institution
  - One course Archetype has many Course Actuals
  - One course Archetype has many Exam Archetypes

### Course Actual

- An implementation of Course Archetype
- Represents a specific offering of a course
- Co-owned by Instructor and Institution
- **Key Fields**:
  - courseActualId: Primary system identifier
  - courseArchetypeId: Foreign key to Course Archetype
  - startDate: Course begin date
  - endDate: Course completion date
  - schedule: Meeting times/frequency
  - status: Current state (draft/active/completed)
- **Primary Relationships**:
  - One course Actual belongs to one Course Archetype
  - One course Actual has many Course Enrollments
  - One course Actual has many Exam Actuals

### Exam Archetype

Exam Archetype serves as the template for Exam Actual. A dedicated conversion process transforms the Exam Archetype record into an Exam Actual record, ensuring proper initialization and relationship mapping.

- **Key Fields**:
  - examArchetypeId: Primary system identifier
  - courseArchetypeId: Foreign key to Course Archetype
  - title: Display name
  - timeLimit: Duration in minutes
  - passingScore: Minimum required score
  - version: For tracking changes
- **Primary Relationships**:
  - One exam Archetype belongs to one Course Archetype
  - One exam Archetype has many Question Archetypes
  - One exam Archetype has many Exam Actuals

### Exam Actual

- A specific implementation of an Exam Archetype
- Owned by a specific student
- Contains student-specific responses and scoring

### Question Archetype

Question Archetype serves as the template for Question Actual. A dedicated conversion process transforms the Question Archetype record into a Question Actual record, ensuring proper initialization and relationship mapping.

- **Key Fields**:
  - questionArchetypeId: Primary system identifier
  - examArchetypeId: Foreign key to Exam Archetype
  - type: Question format (multiple-choice/free-text/etc)
  - content: The actual question text/media
  - points: Maximum score value
  - difficulty: Relative complexity rating
- **Primary Relationships**:
  - One question Archetype belongs to one Exam Archetype
  - One question Archetype has many Valid Answers
  - One question Archetype has many Question Actuals

### Valid Answer

- **Key Fields**:
  - validAnswerId: Primary system identifier
  - questionArchetypeId: Foreign key to Question Archetype
  - content: The correct answer text/value
  - points: Points awarded for this answer
  - feedback: Response for this answer choice
- **Primary Relationships**:
  - One valid Answer belongs to one Question Archetype

### Question Actual

- Specific implementation of Question Archetype
- Contains student responses and scoring
- Linked to specific Exam Actual
- **Key Fields**:
  - questionActualId: Primary system identifier
  - questionArchetypeId: Foreign key to Question Archetype
  - examActualId: Foreign key to Exam Actual
  - response: Student's answer
  - score: Points awarded
  - attemptCount: Number of tries
  - feedback: Instructor comments
- **Primary Relationships**:
  - One question Actual belongs to one Question Archetype
  - One question Actual belongs to one Exam Actual

### Ramblings of a madman

_think_ we won't build speech/audio question types now, but we need to plan for it.

- The WDYK will hitherto be known as "The Open Source Learning Platform"

```

```
