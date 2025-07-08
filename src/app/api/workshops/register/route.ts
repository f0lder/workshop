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

    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('user_id', user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({
        success: false,
        message: 'Already registered for this workshop'
      }, { status: 400 })
    }

    // Get workshop details to check capacity
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

    if (workshop.current_participants >= workshop.max_participants) {
      return NextResponse.json({
        success: false,
        message: 'Workshop is full'
      }, { status: 400 })
    }

    // Create registration
    const registrationData = {
      workshop_id: workshopId,
      user_id: user.id
    }

    const { error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)

    if (error) {
      console.error('Error registering for workshop:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to register for workshop'
      }, { status: 500 })
    }

    // Update workshop participants count
    await supabase
      .from('workshops')
      .update({
        current_participants: workshop.current_participants + 1
      })
      .eq('id', workshopId)

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for workshop',
      workshop
    })
  } catch (error) {
    console.error('Error in workshop registration:', error)
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
}
