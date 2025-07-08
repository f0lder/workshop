import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 })
    }

    const { workshopId } = await request.json()

    if (!workshopId) {
      return NextResponse.json({
        success: false,
        message: 'Workshop ID is required'
      }, { status: 400 })
    }

    // Check if registration exists
    const { data: existingRegistration } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .single()

    if (!existingRegistration) {
      return NextResponse.json({
        success: false,
        message: 'Not registered for this workshop'
      }, { status: 400 })
    }

    // Get workshop details to update capacity
    const { data: workshop } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .single()

    if (!workshop) {
      return NextResponse.json({
        success: false,
        message: 'Workshop not found'
      }, { status: 404 })
    }

    // Delete registration
    const { error } = await supabase
      .from('workshop_registrations')
      .delete()
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error cancelling registration:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to cancel registration'
      }, { status: 500 })
    }

    // Update workshop participants count
    await supabase
      .from('workshops')
      .update({
        current_participants: Math.max(0, workshop.current_participants - 1)
      })
      .eq('id', workshopId)

    return NextResponse.json({
      success: true,
      message: 'Successfully cancelled workshop registration',
      workshop
    })
  } catch (error) {
    console.error('Error in cancelling registration:', error)
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
}
