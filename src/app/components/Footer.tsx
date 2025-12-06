'use client';

import React from "react";
import Link from "next/link";
import { Instagram, Linkedin, ArrowUp, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import LogoNav from "./navBar/LogoNav";

export default function Footer() {
  return (
    <footer className="bg-navbar-primary text-navbar-foreground border-t border-border rounded-t-2xl shadow-2xl overflow-hidden">
      {/* back to top */}
      <div className="flex justify-end px-6 pt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 rounded-full bg-secondary text-navbar-foreground shadow-lg hover:bg-secondary/80 transition"
        >
          <ArrowUp size={20} />
        </motion.button>
      </div>

      {/* Grid content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12">
        
        {/* Logo */}
        <div className="space-y-0 pr-16">
          <LogoNav></LogoNav>
        </div>

        {/* Navegação */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navegação</h3>
          <ul className="space-y-3">
            {[
              { name: "Home", href: "/" },
              { name: "Corridas", href: "/corridas" },
              { name: "Notícias", href: "/blog" },
              { name: "Sobre nós", href: "/sobre-nos" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-navbar-muted-foreground hover:text-secondary transition text-base"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-4 text-navbar-muted-foreground">
            <li className="flex items-center gap-3">
              <Mail size={18}/> runit@suporte.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18}/> Recife - PE
            </li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
          <div className="flex items-center gap-4">
            {[Instagram, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-3 rounded-xl bg-navbar-hover/20 text-navbar-foreground hover:text-secondary hover:bg-secondary/20 transition shadow-md"
              >
                <Icon size={22} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-6 text-center text-navbar-muted-foreground text-sm">
        © {new Date().getFullYear()} SeuSite — Todos os direitos reservados.
      </div>
    </footer>
  );
}
