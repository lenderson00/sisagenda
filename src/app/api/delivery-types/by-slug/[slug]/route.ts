import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
    })
  }

  try {
    const deliveryType = await prisma.deliveryType.findUnique({
      where: {
        slug,
      },
    })

    if (!deliveryType) {
      return new Response(JSON.stringify({ error: 'Delivery type not found' }), {
        status: 404,
      })
    }

    return NextResponse.json(deliveryType)
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'An error occurred while fetching the delivery type',
      }),
      { status: 500 },
    )
  }
}
