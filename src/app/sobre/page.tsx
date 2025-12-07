"use client";

import { motion } from "framer-motion";
import { Users, Target, HeartHandshake } from "lucide-react";
import React from "react";

export default function SobreNosPage() {
  return (
    <div className="min-h-screen w-full py-20 px-6 bg-background text-foreground">
      {/* Título principal */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-center mb-12"
      >
        Sobre Nós
      </motion.h1>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-3xl text-lg md:text-xl text-center mx-auto text-muted-foreground"
      >
        Somos apaixonados por corrida, tecnologia e comunidade. A Runit nasceu
        para conectar corredores em Pernambuco, promovendo saúde, desafios e
        oportunidades para quem ama estar sempre em movimento.
      </motion.p>

      {/* Grid de seções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        
        {/* Quem somos */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="p-8 rounded-2xl bg-navbar-primary shadow-xl border border-border flex flex-col items-center text-center"
        >
          <Users size={48} className="mb-4 text-secondary" />
          <h3 className="text-2xl font-semibold mb-3">Quem Somos</h3>

          <p className="text-white/70">
            Uma plataforma feita por pessoas que vivem a corrida no dia a dia,
            trazendo praticidade e informação para corredores iniciantes e
            experientes.
          </p>
        </motion.div>

        {/* Missão */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="p-8 rounded-2xl bg-navbar-primary shadow-xl border border-border flex flex-col items-center text-center"
        >
          <Target size={48} className="mb-4 text-secondary" />
          <h3 className="text-2xl font-semibold mb-3">Nossa Missão</h3>

          <p className="text-white/70">
            Facilitar o acesso às corridas, conectar pessoas e incentivar um
            estilo de vida mais ativo e saudável.
          </p>
        </motion.div>

        {/* Valores */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="p-8 rounded-2xl bg-navbar-primary shadow-xl border border-border flex flex-col items-center text-center"
        >
          <HeartHandshake size={48} className="mb-4 text-secondary" />
          <h3 className="text-2xl font-semibold mb-3">Nossos Valores</h3>

          <p className="text-white/70">
            Respeito, inclusão, transparência e paixão por ajudar pessoas a
            evoluírem em suas jornadas.
          </p>
        </motion.div>

      </div>

      {/* Convite */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold mb-4">Vem correr com a gente! 🏃‍♀️🔥</h2>
        <p className="text-muted-foreground text-lg mb-6">
          Participe das corridas, conecte-se com outros atletas e acompanhe tudo
          diretamente pela nossa plataforma.
        </p>

        <a
          href="/corridas"
          className="px-8 py-3 rounded-xl bg-secondary text-primary-foreground font-semibold shadow-md hover:bg-secondary/80 transition"
        >
          Ver Corridas
        </a>
      </motion.div>
    </div>
  );
}
