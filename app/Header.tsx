import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className="p-5 bg-pink-500 text-sm uppercase">
      <div className='flex space-x-4'>
        <Link href='/2' className='p-2 bg-pink-800 text-white rounded-lg'>Day</Link>
        <Link href='/week-to-date' className='p-2  bg-pink-800 text-white rounded-lg'>Week to date</Link>
        <Link href='/monoth-to-date' className='p-2  bg-pink-800 text-white rounded-lg'>Month to date</Link>
      </div>
    </header>
  )
}

export default Header
