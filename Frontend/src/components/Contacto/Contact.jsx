import React from "react";
import { MapPin, Clock, Phone } from "lucide-react";

const Contacto = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-40 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Morada */}
          <div className="flex flex-col items-center">
            <MapPin className="w-12 h-12 text-[#002F4B] mb-4" />
            <h3 className="text-xl font-bold text-[#002F4B] dark:text-white mb-2">Morada</h3>
            <p className="text-gray-800 dark:text-gray-300">
              KENTACENTRO,  UNIPESSOAL, LDA
              <br />
              Rua do Gonçalinho, Nº. 66 - Viseu
            </p>
          </div>

          {/* Horário */}
          <div className="flex flex-col items-center">
            <Clock className="w-12 h-12 text-[#002F4B] mb-4" />
            <h3 className="text-xl font-bold text-[#002F4B] dark:text-white mb-2">Horário</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Seg. a Sex.: 9:00h – 18:00h
            </p>
          </div>

          {/* Contactos */}
          <div className="flex flex-col items-center">
            <Phone className="w-12 h-12 text-[#002F4B] mb-4" />
            <h3 className="text-xl font-bold text-[#002F4B] dark:text-white mb-2">Contactos</h3>
            <p className="text-gray-800 dark:text-gray-300">Telefone: +351 917 573 574</p>
            <p className="text-gray-800 dark:text-gray-300 mt-2">Email: kentacentro@kentacentro.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
