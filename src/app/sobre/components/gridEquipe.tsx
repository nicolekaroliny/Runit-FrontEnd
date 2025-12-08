"use client";

import React from "react";
import TeamMember from "./equipe";

const team = [
  { 
    file: "/images/equipe/artur.png",
    name: "Artur Beltrão",
    role: "Líder — responsável pela documentação",
    linkedin: "https://www.linkedin.com/in/artur-cavalcanti10011?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
  },
  { 
    file: "/images/equipe/caiogomes.png",
    name: "Caio Gomes",
    role: "Desenvolvedor Full-stack",
    linkedin: "https://www.linkedin.com/in/caiogomesbrayner/"
  },
  { 
    file: "/images/equipe/caiostuart.png",
    name: "Caio Stuart",
    role: "Desenvolvedor Front-end",
    linkedin: "https://www.linkedin.com/in/caiostuart-rt/"
  },
  { 
    file: "/images/equipe/francisco.png",
    name: "Francisco de Assis",
    role: "Cybersecurity Analyst Desenvolvedor Full-stack",
    linkedin: "https://www.linkedin.com/in/franciscoprimo/"
  },
  { 
    file: "/images/equipe/italo.png",
    name: "Italo Maciel",
    role: "Responsável pela documentação"
  },
  { 
    file: "/images/equipe/lucas.png",
    name: "Lucas Tadeu",
    role: "Desenvolvedor Back-end",
    linkedin: "https://www.linkedin.com/in/lucas-tadeu-8783b8205/"
  },
  { 
    file: "/images/equipe/marcel.png",
    name: "Marcel de Abreu",
    role: "Desenvolvedor Back-end"
  },
  { 
    file: "/images/equipe/nicole.png",
    name: "Nicole Karoliny",
    role: "Desenvolvedora Front-end",
    linkedin: "https://www.linkedin.com/in/nicole-karoliny-0bbb41238/"
  },
  { 
    file: "/images/equipe/rodrigo.png",
    name: "Rodrigo Borges",
    role: "Desenvolvedor Front-end",
    linkedin: "https://www.linkedin.com/in/rodrigoborgesfreitas/"
  },
];

export default function grideEquipe() {
  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">Nossa Equipe</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => (
          <TeamMember
            key={m.name}
            imgSrc={m.file}
            name={m.name}
            role={m.role}
            linkedin={m.linkedin}
          />
        ))}
      </div>
    </section>
  );
}
