import { motion, AnimatePresence } from 'framer-motion';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import

export default function Trade({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="pt-8 text-sm xl:pt-10">
      <div className="mx-auto w-full max-w-lg rounded-xl bg-light-dark p-5 pt-4 shadow-card xs:p-6 xs:pt-5">
        <AnimatePresence mode={'wait'}>
          <motion.div
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25)}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
