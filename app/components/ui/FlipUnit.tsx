"use client";
import { motion, AnimatePresence } from "framer-motion";

interface FlipDigitProps {
  digit: string | number;
}

export const FlipDigit = ({ digit }: FlipDigitProps) => {
  return (
    <div className="relative w-[50px] h-[65px] md:w-[75px] md:h-[100px] bg-red-600 overflow-hidden font-black text-white text-[50px] md:text-[80px] leading-none flex items-center justify-center p-4">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative z-0"
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};