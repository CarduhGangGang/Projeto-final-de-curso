import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { supabase } from '../../supabase-client.js'

const Title = ({ title, subTitle }) => (
  <div className="text-center mb-6">
    <h2 className="text-4xl font-bold text-black">{title}</h2>
    <p className="text-gray-400 mt-2">{subTitle}</p>
  </div>
)

const NewsLetter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido.')
      return
    }

    setStatus('loading')

    try {
      // Verifica se o email já existe na base de dados
      const { data: existing, error: fetchError } = await supabase
        .from('newsletter')
        .select('id')
        .eq('email', email)

      if (fetchError) throw fetchError

      if (existing.length > 0) {
        setStatus('success') // Já está inscrito
        setEmail('')
        return
      }

      // Insere novo email
      const { error: insertError } = await supabase
        .from('newsletter')
        .insert([{ email }])

      if (insertError) throw insertError

      setStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Erro ao subscrever:', error)
      setStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="bg-transparent bg-opacity-80 flex items-center justify-center px-4 py-12"
    >
      <div className="flex flex-col items-center w-full max-w-5xl rounded-2xl bg-gray bg-opacity-90 px-6 py-12 md:py-16 text-black">
        <Title
          title="Adere já sem compromisso"
          subTitle="Mantém-te a par das mais recentes novidades!"
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 w-full max-w-3xl"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/10 px-4 py-2.5 border border-white/20 rounded outline-none flex-grow max-w-full"
            placeholder="O teu email"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 group bg-gray- px-6 py-2.5 rounded active:scale-95 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : 'SUBSCREVER'}
            <img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="w-3.5 group-hover:translate-x-1 transition-all"
            />
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-500 mt-4 text-sm">Email subscrito com sucesso!</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 mt-4 text-sm">Erro ao subscrever o email. Tente novamente.</p>
        )}

        <p className="text-gray-400 mt-6 text-xs text-center max-w-md">
          Ao subscrever, estás a concordar com a nossa Política de Privacidade e a receber novidades por email.
        </p>
      </div>
    </motion.div>
  )
}

export default NewsLetter
