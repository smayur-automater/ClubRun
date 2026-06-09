import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6">
          <span className="text-6xl">🏃</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ClubRun</h1>
        <p className="text-xl text-gray-600 mb-8">
          Running club management made simple. Organise runs, manage pace groups, and keep your members in the loop.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Create Your Club
          </Link>
          <Link
            href="/auth/login"
            className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Member joining a club? Use the invite link your organiser sent you.
        </p>
      </div>
    </main>
  )
}
