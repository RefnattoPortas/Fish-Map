'use client';

import React from 'react';
import { CheckCircle, Crown, ArrowRight, Fish } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900 to-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-8 rounded-3xl text-center shadow-2xl"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-6 border border-green-500/30">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Assinatura Ativada!</h1>
        <p className="text-slate-400 mb-8">
          Bem-vindo ao Clube Fishgada Pro! Suas vantagens já estão liberadas e seu trial de 3 meses começou.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-left">
            <Crown className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <p className="font-semibold text-blue-300">Status: Pescador Pro</p>
              <p className="text-xs text-blue-400/60">Acesso total desbloqueado</p>
            </div>
          </div>
        </div>

        <Link 
          href="/radar"
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 transition-all font-bold rounded-xl flex items-center justify-center gap-2 group"
        >
          Ir para o Radar
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="mt-8 flex justify-center gap-2 text-slate-500">
          <Fish className="w-4 h-4" />
          <span className="text-xs">Boa pescaria!</span>
        </div>
      </motion.div>
    </div>
  );
}
