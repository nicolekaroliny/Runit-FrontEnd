"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import React from "react";

interface Props {
  imgSrc: string;
  name: string;
  role: string;
  linkedin?: string;
}

export default function Equipe({ imgSrc, name, role, linkedin }: Props) {
  return (
    <motion.article
      whileHover={{ scale: 1.03, translateY: -6 }}
      transition={{ type: "spring", stiffness: 160, damping: 12 }}
      className="w-full max-w-sm bg-navbar-primary border border-white/10 rounded-xl p-4 flex gap-4 items-center shadow-md"
    >
      {/* Foto */}
      <div className="flex-shrink-0">
        <Image
          src={imgSrc}
          alt={name}
          width={120}
          height={120}
          className="rounded-full object-cover border-2 border-white/10"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1">
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <span className="text-sm text-white/75">{role}</span>

        {/* LinkedIn */}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-[#68a7ff] hover:text-[#89bbff] transition-colors"
          >
            <Linkedin size={20} />
            <span className="text-sm">LinkedIn</span>
          </a>
        )}
      </div>
    </motion.article>
  );
}
