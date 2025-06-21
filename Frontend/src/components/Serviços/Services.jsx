import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RequestOrc from '../RequestOrc';

const services = [
  {
    title: 'Ar condicionado',
    description:
      'O ar condicionado oferece inúmeras vantagens, tornando-se uma peça essencial para o conforto de muitos ambientes. Ele proporciona conforto térmico para o calor, o quente ou frio, mantendo a qualidade do ar. Combinado à instalação versátil, alta eficiência energética e economia de energia, aumenta o padrão de conforto e qualidade do ar nos ambientes residenciais e comerciais. O seu funcionamento silencioso também é um diferencial importante.',
    image: '/images/ar-condicionado.jpg',
  },
  {
    title: 'Radiadores elétricos',
    description:
      'Os radiadores elétricos são uma escolha eficiente e prática para o aquecimento dos ambientes. Oferecem controle preciso de temperatura, instalação simples e aquecimento apenas onde necessário. Ideais para escritórios e quartos, geram pouco ruído e oferecem opções modernas e elegantes para ambientes confortáveis.',
    image: '/images/radiadores.jpg',
  },
  {
    title: 'Bombas de calor',
    description:
      'As bombas de calor para águas quentes sanitárias e aquecimento central são uma solução eficiente e sustentável, utilizando calor do ar ou do solo para reduzir em até 80% os custos face a sistemas convencionais. Com instalação versátil, impacto ambiental reduzido e possibilidade de benefícios fiscais, representam uma escolha inteligente para residências e espaços comerciais.',
    image: '/images/bomba de calor.jpg',
  },
    {
    title: 'Sistemas Solares',
    description:
      'O sistema solar oferece energia gratuita, silenciosa e sustentável para casas e empresas. Garante economia, autonomia energética e valorização do imóvel, além de reduzir o impacto ambiental. Um investimento seguro e inteligente para o futuro.',
    image: '/images/solares.jpg',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Services = () => {
  const [showOrcamentoModal, setShowOrcamentoModal] = useState(false);

  const handleOpenOrcamento = () => setShowOrcamentoModal(true);
  const handleCloseOrcamento = () => setShowOrcamentoModal(false);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700">
      {/* Header */}
      <header className="text-center py-12 border-b px-4 sm:px-6 md:px-10 lg:px-32">
        <p className="uppercase text-xs tracking-widest text-gray-400">Serviços</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-1">
          KENTACENTRO, UNIPESSOAL, LDA
        </h1>
      </header>

      {/* Services */}
      <main className="px-4 sm:px-6 md:px-10 lg:px-32 py-16 space-y-20 md:space-y-32">
        {services.map((service, index) => (
          <motion.section
            key={service.title}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            } items-center gap-8 md:gap-20`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            {/* Image */}
<div className="w-full md:w-1/2">
  <img
    src={service.image}
    alt={service.title}
    className="rounded-lg w-full max-h-[320px] object-cover shadow-md"
  />
</div>

            {/* Text Content */}
            <div className="w-full md:w-1/2 text-justify">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
                {service.title}
              </h2>
              <p className="mb-6 text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
              <motion.button
                onClick={handleOpenOrcamento}
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded"
                whileHover={{ scale: 1.05, }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Pedir Orçamento <span className="text-lg">→</span>
              </motion.button>
            </div>
          </motion.section>
        ))}
      </main>

      {/* Modal do orçamento */}
      {showOrcamentoModal && <RequestOrc onClose={handleCloseOrcamento} />}
    </div>
  );
};

export default Services;
