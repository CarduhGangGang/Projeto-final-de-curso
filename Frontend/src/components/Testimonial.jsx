import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'João Ferreira',
    title: 'Proprietário de moradia em construção',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100',
    message:
      'Comprei o aquecimento da minha obra pela Kentacentro e o atendimento foi impecável. Entregaram tudo no prazo e com ótima qualidade.',
    rating: 5,
  },
  {
    name: 'Paulo Portas',
    title: 'Proprietário de uma empresa',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
    message:
      'Quando precisei de assistência, bastou uma chamada e os técnicos apareceram no próprio dia — resolveram tudo num estalar de dedos!',
    rating: 5,
  },
];

const StarRating = ({ count }) => (
  <div className="flex mt-3 gap-1 justify-center">
    {[...Array(count)].map((_, i) => (
      <svg
        key={i}
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
          fill="#FF532E"
        />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ name, title, image, message, rating, index }) => {
  return (
    <motion.div
      className="w-80 flex flex-col items-start border border-gray-300 p-5 rounded-lg bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 * index, duration: 0.6, ease: 'easeOut' }}
    >
      <svg
        width="44"
        height="40"
        viewBox="0 0 44 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="..." fill="#2563EB" />
      </svg>
      <StarRating count={rating} />
      <p className="text-sm mt-3 text-gray-500">{message}</p>
      <div className="flex items-center gap-3 mt-4">
        <img className="h-12 w-12 rounded-full" src={image} alt={name} />
        <div>
          <h2 className="text-lg text-gray-900 font-medium">{name}</h2>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonial = () => {
  return (
    <motion.div
      className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30 text-center"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Opinião dos nossos clientes
      </motion.h2>

      <motion.p
        className="text-gray-600 mt-2 max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Conheça as razões pelas quais a KentaCentro é a escolha de confiança de clientes em todo o país.
      </motion.p>

      <motion.div
        className="flex flex-wrap justify-center gap-5 mt-10 text-left"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          hidden: { opacity: 0 },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} index={index} {...testimonial} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Testimonial;
