import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RequestOrc from '../RequestOrc';
import { supabase } from '../../../supabase-client';

const fadeLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Services = () => {
  const [showOrcamentoModal, setShowOrcamentoModal] = useState(false);
  const [services, setServices] = useState([]);
  const [header, setHeader] = useState({ title: '', subtitle: '' });

  useEffect(() => {
    fetchHeader();
    fetchServices();
  }, []);

  const fetchHeader = async () => {
    const { data, error } = await supabase
      .from('services_header')
      .select('*')
      .eq('is_final', true)
      .single();

    if (!error && data) {
      setHeader({ title: data.title, subtitle: data.subtitle });
    }
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services_works')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      setServices(data || []);
    }
  };

  const handleOpenOrcamento = () => setShowOrcamentoModal(true);
  const handleCloseOrcamento = () => setShowOrcamentoModal(false);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700">
      {/* Header */}
      <header className="text-center py-12 border-b px-4 sm:px-6 md:px-10 lg:px-32">
        <p className="uppercase text-xs tracking-widest text-gray-400">
          {header.title || 'Serviços'}
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-1">
          {header.subtitle || 'KENTACENTRO, UNIPESSOAL, LDA'}
        </h1>
      </header>

      {/* Services */}
      <main className="px-4 sm:px-6 md:px-10 lg:px-32 py-16 space-y-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={service.id}
              className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''} items-center gap-8 md:gap-20`}
            >
              {/* Image with animation */}
              <motion.div
                className="w-full md:w-1/2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={isEven ? fadeLeft : fadeRight}
              >
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="rounded-lg w-full max-h-[350px] object-cover shadow-md"
                />
              </motion.div>

              {/* Text with animation */}
              <motion.div
                className="w-full md:w-1/2 text-justify"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={isEven ? fadeRight : fadeLeft}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
                  {service.title}
                </h2>
                <p className="mb-6 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
                <button
                  onClick={handleOpenOrcamento}
                  className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Pedir Orçamento →
                </button>
              </motion.div>
            </div>
          );
        })}
      </main>

      {/* Modal do orçamento */}
      {showOrcamentoModal && <RequestOrc onClose={handleCloseOrcamento} />}
    </div>
  );
};

export default Services;
