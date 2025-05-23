"use client";
import { staggerContainer, textVariant2 } from "@/src/utils/motion";
import { motion } from "framer-motion";

type TitleTextProps = {
  children: React.ReactNode;
  textStyles: React.CSSProperties | string;
};

export const TitleText = ({ children, textStyles }: TitleTextProps) => (
  <motion.div
    variants={staggerContainer(0.1, 0.1)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: false, amount: 0.25 }}
  >
    <motion.div
      variants={textVariant2}
      initial="hidden"
      whileInView="show"
      className={` ${textStyles}`}
    >
      {children}
    </motion.div>
  </motion.div>
);
