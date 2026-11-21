import React from "react";
import ParticlesOverlay from "../particles";

export default function WelcomeHeader() {
  return (
    <div className="relative overflow-hidden text-center p-12 bg-gradient-to-r from-custom-pink-300 via-red-600 to-rose-500 rounded-xl shadow-2xl">
      {/* Animated background overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/0 to-pink-500/10" />
        <div className="absolute inset-0 opacity-20" />
      </div>

      {/* Content with hover effects */}
      <div className="relative z-10 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-5xl font-bold text-white mb-4 transition-all">
          Welcome to Academic Excellence
        </h1>
        <p className="text-xl text-white/90 transition-all">
          Your comprehensive school management dashboard
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 animate-pulse" />
     
      <ParticlesOverlay />

    </div>
  );
}
