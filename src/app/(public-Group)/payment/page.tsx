"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, ArrowLeft, ShieldCheck, Loader2, CheckCircle2, Lock } from "lucide-react";
import { createPaymentIntentAction } from "@/app/(dashboard-Group)/_actions/payment";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51P7qGvFhadYR9ZUf7X0iXyL2O94aBsmDq6Q4J5q1d1p5N9s0"
);

function StripeCheckoutForm({
    bookingId,
    clientSecret,
    amount,
    serviceName
}: {
    bookingId: string;
    clientSecret: string;
    amount: number;
    serviceName: string;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setIsProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setErrorMessage(error.message || "Payment failed. Please try again.");
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/customer-dashboard");
                }, 2500);
            }
        } catch (err) {
            console.error("Payment confirmation error:", err);
            setErrorMessage("Unexpected error during transaction.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
                <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
                <p className="text-sm text-zinc-400">
                    Your booking is now confirmed. Redirecting to your dashboard...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Selected Service</span>
                    <span className="font-medium text-white">{serviceName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Gateway</span>
                    <span className="font-medium text-cyan-400 flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" /> Stripe Secure Pay
                    </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-cyan-400">৳ {amount}</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-400" /> Card Details
                </label>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 focus-within:border-cyan-500 transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "14px",
                                    color: "#ffffff",
                                    "::placeholder": {
                                        color: "#71717a",
                                    },
                                },
                                invalid: {
                                    color: "#f43f5e",
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20 transition-all"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying Transaction...
                    </>
                ) : (
                    <>
                        <CreditCard className="h-4 w-4" /> Pay ৳ {amount}
                    </>
                )}
            </button>
        </form>
    );
}

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("bookingId");

    const [loadingSecret, setLoadingSecret] = useState(true);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [serviceName, setServiceName] = useState("Home Repair Service");
    const [amount, setAmount] = useState(1800);
    const [intentError, setIntentError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            setIntentError("No booking ID found in URL.");
            setLoadingSecret(false);
            return;
        }

        if (typeof window !== "undefined") {
            try {
                const serviceMap = JSON.parse(localStorage.getItem("service_names_map") || "{}");
                if (serviceMap[bookingId]) {
                    setServiceName(serviceMap[bookingId]);
                }
            } catch (e) {
                console.error(e);
            }
        }

        const fetchPaymentIntent = async () => {
            setLoadingSecret(true);
            setIntentError(null);
            try {
                const res = await createPaymentIntentAction(bookingId);
                if (res?.success && res?.clientSecret) {
                    setClientSecret(res.clientSecret);
                    if (res?.amount) setAmount(res.amount);
                } else {
                    setIntentError(res?.message || "Failed to initialize Stripe PaymentIntent.");
                }
            } catch (err) {
                console.error("Payment setup error:", err);
                setIntentError("Could not reach backend payment server.");
            } finally {
                setLoadingSecret(false);
            }
        };

        fetchPaymentIntent();
    }, [bookingId]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-8 space-y-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
                </button>

                <div>
                    <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Secure Checkout</span>
                    <h1 className="text-2xl font-bold mt-1">Payment Details</h1>
                    <p className="text-xs text-zinc-400 mt-1">Enter your card credentials to complete the booking payment.</p>
                </div>

                {loadingSecret ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
                        <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
                        <span className="text-xs">Preparing secure payment channel...</span>
                    </div>
                ) : intentError ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
                        <p className="text-xs text-rose-400 break-all">{intentError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripeCheckoutForm
                            bookingId={bookingId!}
                            clientSecret={clientSecret}
                            amount={amount}
                            serviceName={serviceName}
                        />
                    </Elements>
                ) : null}

                <p className="text-[11px] text-center text-zinc-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> End-to-end encrypted 256-bit SSL transaction.
                </p>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center text-sm text-zinc-400">Loading checkout...</div>}>
            <PaymentContent />
        </Suspense>
    );
}   