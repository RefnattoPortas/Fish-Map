'use client';

import React from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import StripePricingTable from '@/components/billing/StripePricingTable';

export default function UpgradePage() {

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-2xl mb-4 border border-blue-500/30">
            <Crown className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Torne-se um Pescador Pro
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Desbloqueie o poder total do Fishgada e eleve sua pescaria para o próximo nível com ferramentas exclusivas.
          </p>
        </div>

        <div className="mt-8">
          <StripePricingTable />
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 flex items-center justify-center gap-2">
            Seguro com Stripe <span className="inline-block w-4 h-4 bg-slate-500 rounded-full text-[10px] text-slate-800 font-bold">✓</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
