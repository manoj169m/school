"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ParticlesOverlay from "../overall/particles";

const quotes = [
  {
    text: "Time management is the key to efficient learning.",
    author: "Anonymous",
  },
];

export default function QuotesSection() {
  const [quote, setQuote] = useState(quotes[0]);

   useEffect(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
   }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg p-6 mb-8"
    >
      <div className="flex items-Center justify-center gap-4">
        <ParticlesOverlay />
        <div>
          <h1 className="text-5xl font-bold text-center mb-2">
            Period Allocation Dashboard
          </h1>

          <p className="text-xl font-medium ">{quote.text}</p>
          {/* <p className="text-sm  text-red-100">- {quote.author}</p> */}
        </div>
      </div>
    </motion.div>
  );
}
