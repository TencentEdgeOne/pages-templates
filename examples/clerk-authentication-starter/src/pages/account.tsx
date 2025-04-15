import { useUser } from '@clerk/nextjs';

export default function AccountPage() {
  const { user } = useUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            <div className="mt-2">
              <p className="text-gray-600">Name: {user?.firstName} {user?.lastName}</p>
              <p className="text-gray-600">Email: {user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
            <div className="mt-2">
              <p className="text-gray-600">Last sign in: {user?.lastSignInAt?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 