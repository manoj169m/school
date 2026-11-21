"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ParticlesOverlay from "../../overall/particles";

const quotes = [
  {
    text: "Safety and comfort in every journey, excellence in every mile.",
    author: "Transport Department",
  },
  {
    text: "Connecting paths to knowledge, one route at a time.",
    author: "School Transport Division",
  },
];

export function QuoteBanner() {
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
          <h1 className="text-4xl font-bold mb-2   text-center">
            Transport Dashboard
          </h1>

          <p className="text-xl font-medium mb-2">{quote.text}</p>
          {/* <p className="text-sm  text-red-100">- {quote.author}</p> */}
        </div>
      </div>
    </motion.div>
  );
}
