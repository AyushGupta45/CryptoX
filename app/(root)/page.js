"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex flex-row justify-center items-center w-full gap-4 h-full">
      <div className="flex flex-col gap-8">
        <motion.h1
          className="pb-6 text-[100px] leading-[1.05] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="text-black">🚀{" "}</span>
          Navigate the Future of Crypto Trading with CryptoX
          <span className="text-black">{" "}🌐</span>
        </motion.h1>

        <motion.p
          className="text-base text-gray-600 font-semibold w-4/5 text-center md:text-start"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 1 }}
        >
          Unlock the power of real-time crypto insights with CryptoX. Explore
          dynamic charts, manage virtual portfolios, and experience automated
          trading like never before. Dive in to revolutionize your trading
          journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 1,
            type: "spring",
            stiffness: 400,
            damping: 10,
          }}
        >
          <Link href="/markets">
            <Button size="lg">Explore Now</Button>
          </Link>
        </motion.div>
      </div>

      <div className="flex justify-center items-center w-full">
        <motion.img
          src="/btc.jpg"
          alt="Bitcoin"
          loading="lazy"
          className="w-full mix-blend-difference filter brightness-100 saturate-150 hue-rotate-180"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            y: {
              type: "smooth",
              repeatType: "mirror",
              duration: 3,
              repeat: Infinity,
              delay: 1,
            },
            x: { duration: 1, delay: 1 },
          }}
        />
      </div>
    </div>
  );
};

export default Home;
