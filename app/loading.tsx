import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-custom-pink-300/30 animate-ping"></div>
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-custom-pink-200 border-t-transparent"></div>
          <div className="h-12 w-12 rounded-full bg-custom-pink-200"></div>
        </div>
      </div>
    </div>
  );
}    