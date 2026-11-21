'use client';

import { motion,  } from 'framer-motion';
import Image from 'next/image';
import { useCallback } from 'react';
import Particles from 'react-particles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

import { GraduationCap, Award, Trophy } from 'lucide-react';
import { Sparkles } from '@/components/ui/sparkles';
import { Badge } from '@/components/ui/badge';

interface StudentCardProps {
  name: string;
  class: string;
  section: string;
  rollNo: string;
  imageUrl: string;
}

export default function StudentCard({ name, class: className, section, rollNo,  }: StudentCardProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="relative h-64 bg-gradient-to-r from-red-300 via-red-400 to-red-500">
        <Particles
          className="absolute inset-0"
          init={particlesInit}
          options={{
            particles: {
              color: { value: "#ffffff" },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 2,
                straight: false
              },
              number: { density: { enable: true, area: 800 }, value: 80 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } }
            }
          }}
        />
        <div className="absolute inset-0 bg-[url('/school-pattern.svg')] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white" />
      </div>
      
      <div className="relative px-8 pb-8 -mt-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Image
              src="/assets/img/empGirl.jpg"
              alt={name}
              width={140}
              height={140}
              className="rounded-xl shadow-lg border-4 border-white"
            />
            <Sparkles
              className="absolute -top-2 -right-2"
              color="rose"
            />
          </motion.div>
          
          <div className="text-center md:text-left">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome, {name}!
              </h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <GraduationCap className="w-5 h-5 text-red-500" />
                  <span className="text-gray-600">Class {className} - Section {section}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Trophy className="w-5 h-5 text-red-500" />
                  <span className="text-gray-600">Roll Number: {rollNo}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap justify-center md:justify-start gap-2"
            >
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <Award className="w-4 h-4 mr-1" /> Top Performer
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                100% Attendance
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                Science Club
              </Badge>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}