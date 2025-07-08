import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // First verify the user is authenticated and is an admin
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin using admin client
    const adminSupabase = await createAdminClient()
    console.log('Admin client created, checking user role...')
    
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 })
    }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('User verified as admin, creating workshop...')

    // Get workshop data from request
    const workshopData = await request.json()

    // Create workshop using admin client (bypasses RLS)
    const { data: workshop, error } = await adminSupabase
      .from('workshops')
      .insert([
        {
          ...workshopData,
          instructor_id: user.id,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Workshop created successfully:', workshop)
    return NextResponse.json({ workshop }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
