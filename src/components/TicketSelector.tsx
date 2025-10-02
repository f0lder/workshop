'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { TICKET_PRICES, TicketType } from '@/lib/pricing';
import { FaCheck, FaSpinner } from 'react-icons/fa';

interface TicketSelectorProps {
  currentAccessLevel?: string;
}

export default function TicketSelector({ currentAccessLevel }: TicketSelectorProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState<TicketType | null>(null);
  const [error, setError] = useState<string>('');

  const handlePurchase = async (accessLevel: TicketType) => {
    if (!user) {
      setError('Trebuie să fiți conectat pentru a cumpăra bilete');
      return;
    }

    setLoading(accessLevel);
    setError('');

    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessLevel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare');
    } finally {
      setLoading(null);
    }
  };

  const isPurchased = (accessLevel: TicketType) => {
    return currentAccessLevel === accessLevel;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Alegeți tipul de bilet
        </h2>
        <p className="text-muted-foreground">
          Selectați nivelul de participare la MIMESISS 2025
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(TICKET_PRICES).map(([key, ticket]) => {
          const accessLevel = key as TicketType;
          const isLoading = loading === accessLevel;
          const purchased = isPurchased(accessLevel);

          return (
            <div
              key={accessLevel}
              className={`relative rounded-lg border p-6 transition-all ${
                purchased
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {purchased && (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2">
                  <FaCheck className="h-4 w-4" />
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {ticket.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {ticket.description}
                </p>
                <div className="text-3xl font-bold text-primary">
                  {ticket.displayPrice}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {ticket.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <FaCheck className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(accessLevel)}
                disabled={isLoading || purchased}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  purchased
                    ? 'bg-primary/20 text-primary cursor-not-allowed'
                    : isLoading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isLoading && <FaSpinner className="h-4 w-4 animate-spin" />}
                {purchased ? 'Deja cumpărat' : isLoading ? 'Procesare...' : 'Cumpără acum'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Plățile sunt procesate securizat prin Stripe. <br />
          Veți primi o confirmare pe email după finalizarea plății.
        </p>
      </div>
    </div>
  );
}