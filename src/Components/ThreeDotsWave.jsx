import { motion } from "framer-motion";
import React from "react";
import '../App.scss';

const LoadingDot = {
  display: "block",
  width: "0.3rem",
  height: "0.3rem",
  background:'var(--color-background)',
  borderRadius: "50%"
};

const LoadingContainer = {
  display: "flex",
  justifyContent: "space-around",
  gap:'10px',
  margin:'10px'
};

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2
    }
  },
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const DotVariants = {
  initial: {
    y: "0%"
  },
  animate: {
    y: "100%"
  }
};

const DotTransition = {
  duration: 0.5,
  ease: "easeInOut",
  repeatType: 'reverse',
  repeat: Infinity,
};

export default function ThreeDotsWave() {
  return (
    <div
      style={{
        paddingTop: "5px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <motion.div
        style={LoadingContainer}
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
      </motion.div>
    </div>
  );
}
