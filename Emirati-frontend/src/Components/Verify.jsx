import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Verify() {
    const [loading, setLoading] = useState(true);
    const [resendLoading, setResendLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');

    const [searchParams] = useSearchParams();
    const user = searchParams.get('user');
    const ts = searchParams.get('ts');
    const sig = searchParams.get('sig');

    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !ts || !sig) {
            setLoading(false);
            setError("Missing verification parameters.");
            return;
        }

        // Verify account on component mount
        const verifyUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user, ts, sig }),
                });
                const data = await res.json();
                if (res.ok) {
                    setVerified(true);
                    setMessage(data.message || "Account verified successfully.");
                } else {
                    setError(data.error || "Verification failed.");
                }
            } catch (err) {
                console.log("🚀 ~ verifyUser ~ err:", err)
                setError("Server error occurred during verification.");
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [user, ts, sig]);

    // Handle resend verification email
    const handleResendEmail = async () => {
        setResendLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/send-verify-mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user }),
            });
            const data = await res.json();
            if (res.ok) {
                setResendMessage(data.message || "Verification email resent successfully.");
            } else {
                setResendMessage(data.message || "Error resending verification email.");
            }
        } catch (err) {
            console.log("🚀 ~ handleResendEmail ~ err:", err)
            setResendMessage("Server error occurred while resending email.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 ">
            <div className="w-full max-w-md p-8   rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-105">
                <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                    Account Verification
                </h1>
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="loader-ring mb-4"></div>
                        <p className="text-gray-600 animate-pulse">Verifying your account...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        {error && (
                            <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg animate-fadeIn">
                                {error}
                            </p>
                        )}
                        {message && (
                            <p className="text-green-500 mb-4 p-3 bg-green-50 rounded-lg animate-fadeIn">
                                {message}
                            </p>
                        )}
                        {!verified && (
                            <div className="space-y-4 animate-slideUp">
                                <button
                                    onClick={handleResendEmail}
                                    disabled={resendLoading}
                                    className="w-full px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg
                                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
                                >
                                    {resendLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="loader-dots mr-2"></div>
                                            Resending...
                                        </span>
                                    ) : "Resend Verification Email"}
                                </button>
                                {resendMessage && (
                                    <p className="mt-2 text-blue-500 animate-fadeIn">{resendMessage}</p>
                                )}
                            </div>
                        )}
                        {verified && (
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full px-6 py-3 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg
                                transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounceIn"
                            >
                                Login Now
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }

                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-slideUp { animation: slideUp 0.5s ease-out; }
                .animate-bounceIn { animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

                .loader-ring {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loader-dots {
                    width: 20px;
                    height: 20px;
                    position: relative;
                    animation: dots 1s infinite linear;
                }

                .loader-dots:before {
                    content: '';
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    background: white;
                    border-radius: 50%;
                    animation: dotsBefore 1s infinite linear;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes dots {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes dotsBefore {
                    0% { box-shadow: -10px 0 0 white, 10px 0 0 white; }
                    50% { box-shadow: -10px 0 0 rgba(255,255,255,0.2), 10px 0 0 rgba(255,255,255,0.2); }
                    100% { box-shadow: -10px 0 0 white, 10px 0 0 white; }
                }
            `}</style>
        </div>
    );
}

export default Verify;
