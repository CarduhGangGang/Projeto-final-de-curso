import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { supabase } from '../../supabase-client.js';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = "6LdxD3crAAAAALiTdpaRdhFLBj9DJAltDRxAtgvB";

const Title = ({ title, subTitle }) => (
  <motion.div
    className="text-center mb-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-4xl font-bold text-black">{title}</h2>
    <p className="text-gray-400 mt-2">{subTitle}</p>
  </motion.div>
);

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [info, setInfo] = useState({
    titulo: '',
    subtitulo: '',
    placeholder: '',
    botao_texto: '',
    mensagem_sucesso: '',
    mensagem_erro: '',
    rodape: '',
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from('newsletter_info')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        setInfo({
          titulo: data.titulo || 'Adere já sem compromisso',
          subtitulo: data.subtitulo || 'Mantém-te a par das mais recentes novidades!',
          placeholder: data.placeholder || 'O teu email',
          botao_texto: data.botao_texto || 'SUBSCREVER',
          mensagem_sucesso: data.mensagem_sucesso || 'Email subscrito com sucesso!',
          mensagem_erro: data.mensagem_erro || 'Erro ao subscrever o email. Tente novamente.',
          rodape: data.rodape || 'Ao subscrever, estás a concordar com a nossa Política de Privacidade e a receber novidades por email.',
        });
      }
    };

    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido.');
      setStatus(null);
      return;
    }

    if (!recaptchaToken) {
      alert('Por favor confirme que não é um robô.');
      setStatus(null);
      return;
    }

    try {
      // Verifica se já existe
      const { data: existing, error: fetchError } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', email);

      if (fetchError) throw fetchError;

      if (existing.length > 0) {
        setStatus('success');
        setEmail('');
        setRecaptchaToken(null);
        return;
      }

      // Insere novo
      const { error: insertError } = await supabase
        .from('newsletter')
        .insert([{ email }]);

      if (insertError) throw insertError;

      setStatus('success');
      setEmail('');
      setRecaptchaToken(null);
    } catch (error) {
      console.error('Erro ao subscrever:', error);
      setStatus('error');
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center w-full max-w-5xl rounded-2xl bg-gray bg-opacity-90 px-6 py-12 md:py-16 text-black">
        <Title title={info.titulo} subTitle={info.subtitulo} />

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/10 px-4 py-2.5 border border-white/20 rounded outline-none flex-grow max-w-full"
            placeholder={info.placeholder}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 group bg-gray-600 text-white px-6 py-2.5 rounded active:scale-95 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : info.botao_texto}
            <img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="w-3.5 filter brightness-0 invert group-hover:translate-x-1 transition-all"
            />
          </button>
        </motion.form>

        <div className="mt-4">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        {status === 'success' && (
          <p className="text-green-500 mt-4 text-sm">{info.mensagem_sucesso}</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 mt-4 text-sm">{info.mensagem_erro}</p>
        )}

        <motion.p
          className="text-gray-400 mt-6 text-xs text-center max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {info.rodape}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NewsLetter;
