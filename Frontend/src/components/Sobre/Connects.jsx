import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Connects = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from('connects_links')
        .select('*')
        .eq('is_active', true)
        .order('ordem', { ascending: true });

      if (!error && data) {
        setLinks(data);
      }
    };

    fetchLinks();
  }, []);

  return (
    <section className="bg-white py-20 px-0 flex items-center justify-center">
      <div className="flex flex-col gap-10 items-center">
        {links.map((item) => (
          <motion.div
            key={item.id}
            className="text-center cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={item.link_url || '#'} className="group">
              <motion.div
                className="text-4xl sm:text-5xl font-light text-gray-400 group-hover:text-gray-600 transition"
                whileHover={{ y: -4 }}
              >
                {item.subtitulo}
              </motion.div>
              <motion.div
                className="text-5xl sm:text-6xl font-bold text-gray-800 group-hover:text-black transition"
                whileHover={{ y: 2 }}
              >
                {item.titulo}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Connects;
