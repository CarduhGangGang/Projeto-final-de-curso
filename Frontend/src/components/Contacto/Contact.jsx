import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as lucideIcons from "lucide-react";
import { supabase } from "../../../supabase-client";

const Contacto = () => {
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    const fetchContactInfos = async () => {
      const { data } = await supabase
        .from("contact_infos")
        .select("*")
        .eq("is_final", true)
        .order("created_at", { ascending: true });

      setInfos(data || []);
    };

    fetchContactInfos();
  }, []);

  return (
    <section className="bg-white py-40 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {infos.map((info, index) => {
            const Icon = lucideIcons[info.icone] || lucideIcons.Info;

            return (
              <motion.div
                key={info.id}
                className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl"
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.2 }}
              >
                <Icon className="w-12 h-12 text-black mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">{info.titulo}</h3>
                <p className="text-gray-800">{info.linha1}</p>
                {info.linha2 && <p className="text-gray-800 mt-2">{info.linha2}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contacto;
