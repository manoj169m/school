'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center space-y-6">
      <span className="bg-gradient-to-r from-red-500 via-rose-400 to-rose-600 bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        404
      </span>
      <h2 className="font-heading text-3xl font-bold text-gray-800">
        Oops! Something&apos;s missing
      </h2>
      <p className="text-gray-600 text-lg">
        The page you&apos;re looking for doesn&apos;t exist or might have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg bg-custom-pink-300 text-white text-lg font-medium hover:bg-custom-pink-200 focus:ring focus:ring-blue-400"
        >
          Go Back
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 text-lg font-medium hover:bg-gray-200 focus:ring focus:ring-gray-300"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
