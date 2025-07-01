import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase-client';

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

const TestimonialCard = ({ name, title, image, message, rating, index }) => (
  <motion.div
    className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-xl bg-white shadow-md"
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <StarRating count={rating} />
    <p className="text-sm mt-3 text-gray-500 leading-relaxed">{message}</p>
    <div className="flex items-center gap-3 mt-5">
      <img className="h-12 w-12 rounded-full" src={image} alt={name} />
      <div>
        <h2 className="text-lg text-gray-900 font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  </motion.div>
);

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [intro, setIntro] = useState({ titulo: '', subtitulo: '' });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonial')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setTestimonials(data);
    };

    const fetchIntro = async () => {
      const { data } = await supabase
        .from('testimonial_intro')
        .select('titulo, subtitulo')
        .limit(1)
        .single();
      if (data) setIntro(data);
    };

    fetchTestimonials();
    fetchIntro();
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-28 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        {intro.titulo}
      </motion.h2>

      <motion.p
        className="text-gray-600 mt-2 max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
      >
        {intro.subtitulo}
      </motion.p>

      <div className="flex flex-wrap justify-center gap-6 mt-12 text-left">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} index={index} {...testimonial} />
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonial;
