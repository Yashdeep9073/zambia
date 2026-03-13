import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const GlobalScrollIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const capTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      className="fixed right-2 top-0 bottom-0 w-1 bg-slate-200/30 z-[9999] rounded-full pointer-events-none"
      style={{ originY: 0 }}
    >
      <motion.div 
        className="absolute top-0 left-0 right-0 bg-red-600 rounded-full"
        style={{ height: "100%", scaleY }}
      />
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: capTop }}
      >
        <div className="bg-white p-1 rounded-full shadow-lg border border-red-500">
          <GraduationCap className="w-5 h-5 text-red-600" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlobalScrollIndicator;
