import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../supabase-client';

const Nossahistoria = () => {
  const [historia, setHistoria] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('nossahistoria')
        .select('*')
        .order('created_at')
        .eq('is_final', true)
        .single();

      if (!error && data) {
        setHistoria(data);
      }
    };

    fetchData();
  }, []);

  if (!historia) return null;

  return (
    <section className="bg-white px-6 py-16 md:py-24 text-center">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-sm text-gray-500 mb-2">{historia.subtitulo}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          {historia.titulo}
        </h1>
        <p className="text-gray-700 text-base mb-4">{historia.paragrafo1}</p>
        <p className="text-gray-700 text-base mb-4">{historia.paragrafo2}</p>
        <p className="text-gray-700 text-base">{historia.paragrafo3}</p>
      </motion.div>
    </section>
  );
};

export default Nossahistoria;
