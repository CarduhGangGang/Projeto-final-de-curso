import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Connects = () => {
  return (
    <section className="bg-white py-20 px-0 flex items-center justify-center">
      <motion.div
        className="text-center cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <Link to="/contacto" className="group">
          <motion.div
            className="text-4xl sm:text-5xl font-light text-gray-400 group-hover:text-gray-600 transition"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            CONTACTO
          </motion.div>
          <motion.div
            className="text-5xl sm:text-6xl font-bold text-gray-800 group-hover:text-black transition"
            whileHover={{ y: 2 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            Informação
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Connects;
