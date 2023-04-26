import { motion, AnimatePresence } from 'framer-motion';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import

export default function Trade({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="pt-8 text-sm w-screen flex justify-center mr-56 xl:mr-64 2xl:mr-72 3xl:mr-80">
      <div className="mx-auto rounded-xl bg-light-dark p-4 pt-3 xl:p-5 xl:pt-4 3xl:p-6 3xl:pt-5 shadow-card">
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
