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
        () => {
          fetchHeroSection();
        }
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

    if (error) {
      console.error('Erro ao buscar hero final:', error);
    } else {
      setData(data);
    }
  };

  if (!data) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-16 pt-24 pb-12 md:pt-36 md:pb-20"
      style={{ backgroundImage: `url(${data.image_url})` }}
    >
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="max-w-3xl w-full mx-auto px-6 flex flex-col 
                     items-center text-center 
                     md:items-start md:text-left mt-30"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-snug whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: data.title.replace(/\n/g, '<br />')
            }}
          />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
            {data.subtitle}
          </h2>
          <p className="text-base sm:text-lg text-white mb-6">
            {data.description}
          </p>
          <button
            onClick={onOrcamentoClick}
            className="bg-white text-black font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:bg-gray-200 transition duration-300"
          >
            {data.button_text}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
