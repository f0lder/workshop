import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  let error = null

  if (user) {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = result.data
    error = result.error
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>

          {error && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
              <pre className="bg-red-100 p-4 rounded text-sm overflow-x-auto text-red-800">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Fixes</h2>
            <div className="space-y-2 text-sm">
              <p><strong>If no profile exists:</strong> The trigger should create one automatically on signup.</p>
              <p><strong>If role is not &apos;admin&apos;:</strong> Run this SQL in Supabase:</p>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                UPDATE profiles SET role = &apos;admin&apos; WHERE id = &apos;{user?.id}&apos;;
              </code>
              <p><strong>If profile exists but role is still &apos;user&apos;:</strong> Check if the UPDATE command worked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
