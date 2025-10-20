# Premium Training System

This document describes the Premium Training courses with donation-based access and Student Dashboard features that have been added to the YCKF website.

## Features Added

### 1. Premium Training Courses
- **Location**: `/premium-training`
- **Features**:
  - Course catalog with filtering by category and level
  - Detailed course pages with modules, prerequisites, and learning objectives
  - Donation-based enrollment system
  - Multiple donation tiers with different benefits
  - Course enrollment with payment processing simulation

### 2. Student Dashboard
- **Location**: `/student-dashboard`
- **Features**:
  - Overview of enrolled courses
  - Progress tracking with visual indicators
  - Time spent tracking
  - Certificate management
  - Quick access to continue learning

### 3. Course Learning Interface
- **Location**: `/premium-training/[slug]/learn`
- **Features**:
  - Interactive course navigation
  - Module and lesson progress tracking
  - Real-time progress updates
  - Certificate request system
  - Responsive learning interface

### 4. Donation System
- **Features**:
  - Flexible donation amounts within specified ranges
  - Multiple donation tiers with benefits
  - Anonymous donation option
  - Payment method selection
  - Automatic enrollment after donation

## Database Schema

### New Sanity Content Types

#### 1. Premium Training (`premiumTraining`)
- Course information (title, description, instructor, etc.)
- Modules with lessons and resources
- Donation tiers and pricing
- Prerequisites and learning objectives
- Certificate templates

#### 2. Student Enrollment (`studentEnrollment`)
- Student information
- Course enrollment details
- Donation amount and tier
- Payment status and transaction details
- Certificate information

#### 3. Course Progress (`courseProgress`)
- Module and lesson completion tracking
- Overall progress percentage
- Time spent tracking
- Quiz scores and assessments
- Certificate eligibility and issuance

## API Endpoints

### 1. `/api/donations` (POST)
- Processes donation payments
- Creates enrollment records
- Initializes progress tracking
- Sends confirmation emails

### 2. `/api/progress` (GET/PUT)
- Fetches student progress data
- Updates course progress
- Tracks time spent and completion

### 3. `/api/certificates` (POST)
- Generates completion certificates
- Updates enrollment and progress records
- Sends certificate via email

## Navigation Updates

The main navigation has been updated to include a "Training" dropdown with:
- Free Training (existing)
- Premium Training (new)
- Student Dashboard (new)

## Usage Instructions

### For Students:
1. Browse premium courses at `/premium-training`
2. Select a course and view details
3. Choose donation amount and complete enrollment
4. Access course materials through Student Dashboard
5. Track progress and request certificates upon completion

### For Administrators:
1. Create premium courses in Sanity CMS
2. Set up donation tiers and pricing
3. Monitor enrollments and progress
4. Generate and manage certificates

## Technical Implementation

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **CMS**: Sanity for content management
- **State Management**: React hooks and context
- **API**: Next.js API routes
- **Authentication**: Ready for integration with auth providers

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Video streaming for course content
- Interactive assessments and quizzes
- Discussion forums and Q&A
- Mobile app integration
- Advanced analytics and reporting
- Multi-language support

## Development Notes

- All components are responsive and accessible
- Dark mode support throughout
- Error handling and loading states implemented
- Mock data and simulation for development
- Ready for production deployment with real payment processing
