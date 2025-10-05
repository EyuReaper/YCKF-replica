import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      courseTitle,
      amount,
      tier,
      donorInfo,
      paymentMethod,
      transactionId
    } = body;

    // Validate required fields
    if (!courseId || !amount || !donorInfo?.name || !donorInfo?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Verify payment with payment processor
    // 2. Create enrollment record
    // 3. Send confirmation email
    // 4. Grant course access

    // For now, we'll create a mock enrollment record
    const enrollmentData = {
      _type: 'studentEnrollment',
      studentName: donorInfo.name,
      studentEmail: donorInfo.email,
      studentPhone: donorInfo.phone || '',
      course: {
        _type: 'reference',
        _ref: courseId
      },
      enrollmentDate: new Date().toISOString(),
      donationAmount: amount,
      donationTier: tier,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'card',
      transactionId: transactionId || `txn_${Date.now()}`,
      enrollmentStatus: 'active',
      certificateIssued: false
    };

    // Create enrollment in Sanity
    const enrollment = await client.create(enrollmentData);

    // Create initial progress record
    const progressData = {
      _type: 'courseProgress',
      enrollment: {
        _type: 'reference',
        _ref: enrollment._id
      },
      course: {
        _type: 'reference',
        _ref: courseId
      },
      studentEmail: donorInfo.email,
      overallProgress: 0,
      lastAccessed: new Date().toISOString(),
      totalTimeSpent: 0,
      moduleProgress: [],
      certificateEligible: false,
      certificateIssued: false
    };

    const progress = await client.create(progressData);

    // In a real application, you would send a confirmation email here
    console.log('Enrollment created:', enrollment._id);
    console.log('Progress record created:', progress._id);

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment._id,
      progressId: progress._id,
      message: 'Enrollment successful! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Donation processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}
