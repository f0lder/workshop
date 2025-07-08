import CreateWorkshopForm from '@/components/CreateWorkshopForm'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

export default function NewWorkshopPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/workshops"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="h-4 w-4 mr-1" />
          Back to Workshops
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Workshop</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new workshop.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <CreateWorkshopForm />
        </div>
      </div>
    </div>
  )
}
