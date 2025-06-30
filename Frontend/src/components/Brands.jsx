import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client"; 

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [initialAnimationPlayed, setInitialAnimationPlayed] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setBrands([...data, ...data]); // duplicar para loop de animação
      } else {
        console.error("Erro ao buscar marcas:", error);
      }
    };

    fetchBrands();
    setInitialAnimationPlayed(true);
  }, []);

  return (
    <div className="relative overflow-hidden py-12 bg-white">
      <div className="absolute inset-0 z-10 bg-white/50 pointer-events-none" />

      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {brands.map((brand, index) => {
          const name = brand.name.toLowerCase();
          let imageClass = "object-contain";

          if (name === "lg") {
            imageClass += " w-[80px] h-[32px] sm:w-[120px] sm:h-[48px]";
          } else if (name === "daikin") {
            imageClass += " w-[140px] h-[64px] sm:w-[210px] sm:h-[96px]";
          } else {
            imageClass += " w-[100px] h-[40px] sm:w-[160px] sm:h-[64px]";
          }

          return (
            <motion.div
              key={brand.id || index}
              className="flex-shrink-0 w-36 h-20 sm:w-60 sm:h-24 flex items-center justify-center"
              initial={!initialAnimationPlayed ? { scale: 0.8, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={brand.image_url} alt={brand.name} className={imageClass} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Brands;
