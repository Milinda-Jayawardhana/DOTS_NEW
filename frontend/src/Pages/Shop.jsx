import React from 'react'

export default function Shop() {
  return (
    <div>
      <div className='flex-col hidden xl:flex'>
        <h1>Milinda Shehan <span className='text-red-500'>Jayawardhana</span></h1>
        <h1>Milinda Jayawardhana</h1>
      </div>

      <div className='flex-col hidden md:block xl:hidden'>
        <h1>Milinda Shehan </h1>
        <span className='text-red-500'>Jayawardhana</span>
        <h1>Milinda Jayawardhana</h1>
      </div>
    </div>
  )
}
