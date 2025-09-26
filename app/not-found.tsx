import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    // REVAMPED: Using the same background with the subtle gradient as the login page.
    <main className="flex items-center justify-center min-h-screen w-full p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-500/5 rounded-full blur-3xl"></div>
      
      {/* REVAMPED: Card now uses the frosted glass effect to match the login page. */}
      <div className="relative w-full max-w-md mx-auto text-center p-10 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50">
          
          {/* REVAMPED: Icon is more prominent and uses the theme's accent color. */}
          <div className='flex justify-center mb-6'>
            <div className='p-4 bg-indigo-100 rounded-full'>
                <Compass className="w-12 h-12 text-indigo-600" />
            </div>
          </div>

          {/* REVAMPED: Typography updated to the new 'slate' color palette. */}
          <h1 className="text-3xl font-bold text-slate-900">404 - Page Not Found</h1>
          <p className="text-slate-600 mt-2 max-w-xs mx-auto">
            It seems you've taken a wrong turn. Let's get you back on track.
          </p>

          <Link href="/dashboard">
            {/* REVAMPED: Button style is now consistent with the primary action button. */}
            <span className="mt-8 inline-block bg-slate-800 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
              Go to Dashboard
            </span>
          </Link>
      </div>
    </main>
  );
}