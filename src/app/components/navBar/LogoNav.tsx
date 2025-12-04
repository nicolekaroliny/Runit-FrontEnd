import Link from 'next/link'
import React from 'react'

const LogoNav = () => {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        <img className='hover:shadow-lg hover:scale-105 transition-all duration-200' alt="Logo do Projeto" src="/images/Logo.png/"/>
      </div>
    </Link>
  )
}

export default LogoNav