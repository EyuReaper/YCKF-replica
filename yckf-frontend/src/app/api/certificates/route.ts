import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { progressId, studentName, courseTitle, completionDate } = body;

    if (!progressId || !studentName || !courseTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Generate a certificate PDF
    // 2. Upload it to a storage service
    // 3. Update the progress record with certificate URL
    // 4. Send certificate via email

    // For now, we'll create a mock certificate URL
    const certificateUrl = `https://yckf.org/certificates/${progressId}_${Date.now()}.pdf`;

    // Update progress record to mark certificate as issued
    const updatedProgress = await client
      .patch(progressId)
      .set({
        certificateIssued: true,
        certificateUrl: certificateUrl
      })
      .commit();

    // Update enrollment record as well
    const enrollmentQuery = `*[_type == "studentEnrollment" && _id in *[_type == "courseProgress" && _id == $progressId].enrollment._ref][0]`;
    const enrollment = await client.fetch(enrollmentQuery, { progressId });
    
    if (enrollment) {
      await client
        .patch(enrollment._id)
        .set({
          certificateIssued: true,
          certificateUrl: certificateUrl
        })
        .commit();
    }

    // In a real application, you would send the certificate via email here
    console.log('Certificate generated for:', studentName, 'Course:', courseTitle);

    return NextResponse.json({
      success: true,
      certificateUrl: certificateUrl,
      message: 'Certificate generated successfully!'
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
