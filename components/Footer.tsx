"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-b from-[#48179d] to-[#00013F] text-white font-sans"
      id="footer"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
 
        <motion.div 
          className="mt-16 pt-8 border-t border-white/20 text-center pb-10"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} Dream Professor. All rights reserved.</p>
        </motion.div>

    </motion.footer>
  );
};

export default Footer;