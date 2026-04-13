"use client";
import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { CustomCursor, useFinePointer } from "./components/CustomCursor";
import { EmailBeamBorderInput } from "./components/EmailBeamBorderInput";
import { FlipDigit } from "./components/ui/FlipUnit";

/** Same duration as previous initial display: 46d 17h 15m 29s */
const INITIAL_REMAINING_SECONDS =
  46 * 86400 + 17 * 3600 + 15 * 60 + 29;

function splitCountdown(totalSec: number) {
  const s = Math.max(0, totalSec);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function ComingSoonPage() {
  const finePointer = useFinePointer();
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_REMAINING_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeLeft = useMemo(
    () => splitCountdown(remainingSeconds),
    [remainingSeconds],
  );

  const secondsStr = timeLeft.seconds.toString().padStart(2, "0");

  return (
    <main
      className={`relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center p-6 font-sans ${finePointer ? "cursor-none custom-cursor-root" : ""}`}
    >
      {finePointer ? <CustomCursor /> : null}
      <div className="absolute inset-0 bg-[url('/images/cable-background.png')] bg-cover bg-center" />
      
      {/* HEADER */}
      <header className="absolute top-0 w-full p-8 flex justify-between items-center max-w-7xl">
        <img src="/images/logo.png" alt="DARTECH" className="h-8" />
        <a href="#" className="hover:text-red-500 duration-300 flex items-center gap-1.5 text-sm">
          Contact Us
          <ArrowUpRight className="size-[1em] shrink-0" strokeWidth={2} aria-hidden />
        </a>
      </header>

      {/* CENTER GLASS CARD */}
      <section className="relative z-10 w-full flex flex-col items-center justify-center px-4 mt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center">
          COMING SOON<span className="text-red-500">!</span>
        </h1>
        
        <div className="bg-white/5 backdrop-blur-sm p-6 md:p-12 text-center max-w-lg w-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 font-normal">Join our waitlist!</h2>
          <p className="text-md md:text-md mb-8 mx-auto max-w-[400px] font-light">
            Sign up for our newsletter to receive the latest updates and insights straight to your inbox
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <EmailBeamBorderInput />
            <button
              type="button"
              className="min-h-[2.75rem] w-full shrink-0 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-colors hover:bg-gray-200 sm:w-auto sm:self-stretch sm:py-0"
            >
              Join
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN SECTION */}
      <section className="z-20 mt-8 flex flex-wrap justify-center items-center gap-2 font-light">
        <div className="flex justify-center">
        {/* DAY Group */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[20px] md:text-[40px] leading-none">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase">
              DAYS
            </div>
          </div>

          {/* Separator */}
          <div className="text-[20px] md:text-[30px] mx-2">:</div>

          {/* HOUR Group */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[20px] md:text-[40px] leading-none">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase">
              HOUR
            </div>
          </div>

          {/* Separator */}
          <div className="text-[20px] md:text-[30px] mx-2">:</div>

          {/* MIN Group */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[20px] md:text-[40px] leading-none">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-[12px] tracking-[0.2em] uppercase">
              MIN
            </div>
          </div>
        </div>

        {/* الثواني (تأثير الفلب) */}
        <div className="flex flex-col items-center gap-1 md:ml-4">
          <div className="flex gap-2">
            <FlipDigit digit={secondsStr[0]} />
            <FlipDigit digit={secondsStr[1]} />
          </div>
          <div className="text-[10px] md:text-[14px] tracking-[1em] uppercase mt-3 ml-[1em]">
            SECONDS
          </div>
        </div>
      </section>
    </main>
  );
}