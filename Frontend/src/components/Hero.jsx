import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase-client';

const Hero = ({ onOrcamentoClick }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchHeroSection();

    const subscription = supabase
      .channel('public:hero_section')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_section' },
        fetchHeroSection
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchHeroSection = async () => {
    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .eq('is_final', true)
      .single();

    if (!error) setData(data);
    else console.error('Erro ao buscar hero final:', error);
  };

  if (!data) return null;

  const lines = data.title.split('\n');

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-16 pt-32 pb-12 md:pt-44 md:pb-28 flex items-center justify-center"
      style={{
        backgroundImage: `url(${data.image_url})`,
      }}
    >
      <div className="max-w-3xl w-full mx-auto px-6 flex flex-col items-center text-center md:items-start md:text-left mt-24">
        <div className="space-y-2 mb-6">
          {lines.map((line, index) => (
            <motion.h1
              key={index}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-snug"
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -80 : 80,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.4,
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <motion.h2
          className="text-lg sm:text-xl font-semibold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + lines.length * 0.3 }}
        >
          {data.subtitle}
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + lines.length * 0.3 }}
        >
          {data.description}
        </motion.p>

        <motion.button
          onClick={onOrcamentoClick}
          className="bg-white text-black font-medium py-2.5 px-5 rounded-lg text-sm shadow hover:bg-gray-200 transition"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + lines.length * 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {data.button_text}
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
