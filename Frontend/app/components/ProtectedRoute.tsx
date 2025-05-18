'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_PATHS = ['/login', '/register'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!token && !isPublicPath) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  if (loading && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  return <>{children}</>;
}
