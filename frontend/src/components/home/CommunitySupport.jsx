"use client"

import { useState } from "react"
import { User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TestimonialSection() {
  const stats = [
    { value: '5.8M', label: 'Weekly downloads on npm' },
    { value: '93.9k', label: 'Stars on GitHub' },
    { value: '3.0k', label: 'Open-source contributors' },
    { value: '1.2M', label: 'Community members' }
  ];

  return (
    <div className="bg-[#121212] text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-blue-400 mb-2 tracking-wider font-medium">
            JOIN THE COMMUNITY
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Supported by thousands of
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            developers and designers
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                <motion.p 
                  className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-400 text-sm tracking-wide">
                  {stat.label}
                </p>
                
                {/* Decorative Elements */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}