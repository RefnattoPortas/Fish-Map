import { stripe } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// Inicializar cliente Supabase com Service Role para bypass de RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Erro na assinatura do webhook:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  // 1. Sincronização de Status (Webhook)
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any;
    
    // Tentar pegar o user_id do metadata que enviamos no checkout
    const userId = subscription.metadata?.user_id || subscription.client_reference_id;

    if (userId) {
      const status = subscription.status === 'trailing' || subscription.status === 'active' ? 'active' : subscription.status;
      
      // Identificar o Plano baseado no ID do Preço vindo do Stripe
      const priceId = subscription.items.data[0].price.id;
      let planType = 'pro'; // Default

      if (priceId === process.env.STRIPE_PRICE_ID_PARTNER) {
        planType = 'partner';
      } else if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
        planType = 'pro';
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: status,
          plan_type: planType,
          stripe_customer_id: subscription.customer,
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar perfil via webhook:', error);
      } else {
        console.log(`Perfil ${userId} atualizado para status ${status} (${planType})`);
        
        // Também inserir na tabela de assinaturas para histórico
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          plan: planType,
          status: status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
      }
    }
  }

  // Cancelamento
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    const userId = subscription.metadata?.user_id;

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          plan_type: 'free',
        })
        .eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
