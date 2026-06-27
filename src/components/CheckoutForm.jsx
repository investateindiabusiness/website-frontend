import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { confirmPayment } from '@/api';

export default function CheckoutForm({ onSuccess, onCancel, amount, currency = 'usd', paymentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is required, though we use redirect: "if_required" 
        // to avoid full page reloads if the payment succeeds without 3D Secure
        return_url: window.location.href,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({ 
        title: "Payment Failed", 
        description: error.message || "An unexpected error occurred.", 
        variant: "destructive" 
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        if (paymentId) {
          await confirmPayment({ paymentId, stripePaymentIntentId: paymentIntent.id });
        }
        toast({ 
          title: "Payment Successful", 
          description: "Your campaign slot has been successfully booked and paid for." 
        });
      } catch (err) {
        console.error("Payment Confirmation Error:", err);
        toast({ 
          title: "Verification Warning", 
          description: "Payment succeeded but backend confirmation failed. An admin will verify manually.", 
          variant: "destructive" 
        });
      } finally {
        setIsProcessing(false);
        onSuccess();
      }
    } else {
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isProcessing} 
          className="rounded-xl"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isProcessing || !stripe || !elements} 
          className="bg-[#0b264f] hover:bg-blue-900 text-white rounded-xl shadow-md min-w-[120px]"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
          {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
        </Button>
      </div>
    </form>
  );
}
