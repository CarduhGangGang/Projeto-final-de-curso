import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';
import { motion } from 'framer-motion';

const Oquefazemos = () => {
  const [cards, setCards] = useState([]);
  const [tituloSecao, setTituloSecao] = useState("O que fazemos?");
  const [subtitulo, setSubtitulo] = useState("");

  useEffect(() => {
    fetchTitulo();
    fetchCards();
  }, []);

  const fetchTitulo = async () => {
    const { data } = await supabase
      .from('titulo_oque')
      .select('*')
      .eq('is_active', true)
      .single();

    if (data) {
      setTituloSecao(data.titulo);
      setSubtitulo(data.subtitulo || ""); // Fallback para evitar crash se for null
    }
  };

  const fetchCards = async () => {
    const { data } = await supabase
      .from('oquefazemos')
      .select('*')
      .eq('is_active', true)
      .order('ordem');

    if (data) setCards(data);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  return (
    <div className="px-4 py-16 max-w-7xl mx-auto text-center">
      {subtitulo && (
        <p className="text-sm text-gray-600 mb-4">
          {subtitulo}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">{tituloSecao}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img
              src={card.img_url}
              alt={card.title}
              className="rounded-lg mb-5 w-full h-56 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 text-sm flex-grow">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Oquefazemos;
