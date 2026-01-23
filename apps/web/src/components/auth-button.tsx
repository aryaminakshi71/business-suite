import { useSession, signOut } from "@suite/auth";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          {session.user.email || session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/sign-in"
      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign In
    </a>
  );
}
