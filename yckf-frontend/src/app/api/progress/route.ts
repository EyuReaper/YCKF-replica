import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentEmail = searchParams.get('email');

    if (!studentEmail) {
      return NextResponse.json(
        { error: 'Student email is required' },
        { status: 400 }
      );
    }

    // Fetch student's progress data
    const query = `*[_type == "courseProgress" && studentEmail == $email] {
      _id,
      enrollment->{
        _id,
        studentName,
        course->{
          _id,
          title,
          image {
            asset->{
              url
            }
          },
          duration,
          instructor,
          level
        },
        enrollmentDate,
        enrollmentStatus,
        certificateIssued,
        certificateUrl
      },
      overallProgress,
      lastAccessed,
      totalTimeSpent,
      moduleProgress,
      certificateEligible,
      certificateIssued,
      certificateUrl
    }`;

    const progressData = await client.fetch(query, { email: studentEmail });

    return NextResponse.json({
      success: true,
      progress: progressData
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      progressId,
      moduleProgress,
      overallProgress,
      totalTimeSpent,
      lastAccessed
    } = body;

    if (!progressId) {
      return NextResponse.json(
        { error: 'Progress ID is required' },
        { status: 400 }
      );
    }

    // Update progress record
    const updateData: any = {
      lastAccessed: lastAccessed || new Date().toISOString()
    };

    if (moduleProgress !== undefined) {
      updateData.moduleProgress = moduleProgress;
    }

    if (overallProgress !== undefined) {
      updateData.overallProgress = overallProgress;
    }

    if (totalTimeSpent !== undefined) {
      updateData.totalTimeSpent = totalTimeSpent;
    }

    // Check if course is completed and certificate is eligible
    if (overallProgress === 100) {
      updateData.certificateEligible = true;
    }

    const updatedProgress = await client
      .patch(progressId)
      .set(updateData)
      .commit();

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
