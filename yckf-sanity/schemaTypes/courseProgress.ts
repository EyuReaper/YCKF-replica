export default {
  name: 'courseProgress',
  title: 'Course Progress',
  type: 'document',
  fields: [
    { name: 'enrollment', title: 'Enrollment', type: 'reference', to: [{ type: 'studentEnrollment' }] },
    { name: 'course', title: 'Course', type: 'reference', to: [{ type: 'premiumTraining' }] },
    { name: 'studentEmail', title: 'Student Email', type: 'string' },
    { 
      name: 'moduleProgress', 
      title: 'Module Progress', 
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'moduleTitle', title: 'Module Title', type: 'string' },
          { name: 'moduleId', title: 'Module ID', type: 'string' },
          { name: 'completed', title: 'Completed', type: 'boolean', initialValue: false },
          { name: 'completionDate', title: 'Completion Date', type: 'datetime' },
          { name: 'progressPercentage', title: 'Progress Percentage', type: 'number', initialValue: 0 },
          { 
            name: 'lessonProgress', 
            title: 'Lesson Progress', 
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'lessonTitle', title: 'Lesson Title', type: 'string' },
                { name: 'completed', title: 'Completed', type: 'boolean', initialValue: false },
                { name: 'completionDate', title: 'Completion Date', type: 'datetime' },
                { name: 'timeSpent', title: 'Time Spent (minutes)', type: 'number' }
              ]
            }]
          }
        ]
      }]
    },
    { name: 'overallProgress', title: 'Overall Progress (%)', type: 'number', initialValue: 0 },
    { name: 'lastAccessed', title: 'Last Accessed', type: 'datetime' },
    { name: 'totalTimeSpent', title: 'Total Time Spent (minutes)', type: 'number', initialValue: 0 },
    { name: 'quizScores', title: 'Quiz Scores', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'quizTitle', title: 'Quiz Title', type: 'string' },
        { name: 'score', title: 'Score', type: 'number' },
        { name: 'maxScore', title: 'Max Score', type: 'number' },
        { name: 'attempts', title: 'Attempts', type: 'number' },
        { name: 'completedDate', title: 'Completed Date', type: 'datetime' }
      ]
    }]},
    { name: 'certificateEligible', title: 'Certificate Eligible', type: 'boolean', initialValue: false },
    { name: 'certificateIssued', title: 'Certificate Issued', type: 'boolean', initialValue: false },
    { name: 'certificateUrl', title: 'Certificate URL', type: 'string' }
  ],
  preview: {
    select: {
      student: 'enrollment.studentName',
      course: 'course.title',
      progress: 'overallProgress',
      status: 'enrollment.enrollmentStatus'
    },
    prepare(selection) {
      const { student, course, progress, status } = selection;
      return {
        title: `${student} - ${course}`,
        subtitle: `${progress}% complete • ${status}`
      };
    }
  }
};
