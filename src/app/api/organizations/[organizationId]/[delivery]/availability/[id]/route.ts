import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCalculatedAvailability } from '@/lib/scheduling-engine';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; delivery: string; id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId, delivery: deliveryTypeId, id: date } = params;

    // Verify if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Verify if the delivery type exists and belongs to the organization
    const deliveryType = await prisma.deliveryType.findFirst({
      where: {
        id: deliveryTypeId,
        organizationId: organizationId,
      },
    });

    if (!deliveryType) {
      return NextResponse.json({ error: 'Delivery type not found' }, { status: 404 });
    }

    // Get availability for the specific date
    const availability = await getCalculatedAvailability({
      deliveryTypeId,
      date,
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
