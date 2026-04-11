import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/config';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID é obrigatório' }, { status: 400 });
    }

    // Criar Sessão de Checkout do Stripe
    // Nota: subscription_data.status = 'trialing' por causa do trial_period_days
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 45, // Atualizado para 45 dias conforme nova definição
        metadata: {
          user_id: user.id,
        },
      },
      client_reference_id: user.id,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/precos`,
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
