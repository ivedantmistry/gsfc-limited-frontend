import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="bg-white p-12 rounded-2xl border border-gray-200/80 shadow-sm">
          <Compass className="w-12 h-12 text-gray-400 mb-6 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/dashboard">
            <span className="mt-8 inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-colors hover:bg-gray-800">
              Go to Dashboard
            </span>
          </Link>
      </div>
    </div>
  );
}