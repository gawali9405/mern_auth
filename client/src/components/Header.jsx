import React from 'react'

const Header = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold text-blue-500'>Hey Developer</h1>
        <p className='text-xl text-gray-500'>Are you ready to build a MERN stack authentication application?</p>
        <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out mt-4'>
            Get Started
        </button>
    </div>
  )
}

export default Header