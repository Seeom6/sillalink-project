"use client"
import React from 'react'
import Title from '../Title'
import EmailBoard from './EmailBoard'

const ContactSection = () => {
  return (
    <section id='contact' className="py-16">
         <div className="container mx-auto px-4">
        <Title title1='Cont' title2='act us'  />
      </div>
        <div className='w-full flex justify-center items-center md:px-16'>
            <EmailBoard/>
        </div>
    </section>
  )
}

export default ContactSection
