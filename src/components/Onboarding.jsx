import { useState, useEffect } from 'react'

const onboardingSteps = [
    {
        icon: 'eco',
        title: 'Welcome to ESGChain',
        description: 'Your blockchain-powered platform for transparent ESG data verification and reporting.',
        color: 'from-blue-500 to-emerald-500'
    },
    {
        icon: 'verified',
        title: 'Immutable Records',
        description: 'All ESG data is stored on the Sepolia blockchain, ensuring transparency and preventing tampering.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: 'qr_code_scanner',
        title: 'Easy Verification',
        description: 'Scan QR codes on certificates to instantly verify ESG data authenticity on the blockchain.',
        color: 'from-orange-500 to-amber-500'
    },
    {
        icon: 'rocket_launch',
        title: 'Ready to Start!',
        description: 'Choose your role and begin exploring verified ESG data or submit reports for your organization.',
        color: 'from-purple-500 to-pink-500'
    }
]

function Onboarding({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(true) // Start as visible for debug
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Fade in on mount
        setTimeout(() => setIsVisible(true), 100)
    }, [])

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(prev => prev + 1)
                setIsAnimating(false)
            }, 300)
        } else {
            handleComplete()
        }
    }

    const handleSkip = () => {
        handleComplete()
    }

    const handleComplete = () => {
        setIsVisible(false)
        setTimeout(() => {
            localStorage.setItem('onboarding_complete', 'true')
            onComplete()
        }, 300)
    }

    const step = onboardingSteps[currentStep]

    return (
        <div
            className={`fixed inset-0 z-[10000] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Content */}
            <div className="relative max-w-lg w-full text-center">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {onboardingSteps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                        />
                    ))}
                </div>

                {/* Animated Card */}
                <div
                    className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
                >
                    {/* Icon */}
                    <div className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl animate-bounce`} style={{ animationDuration: '2s' }}>
                        <span className="material-symbols-outlined text-white text-5xl sm:text-6xl">{step.icon}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{step.title}</h1>

                    {/* Description */}
                    <p className="text-lg text-blue-200 mb-12 leading-relaxed px-4">{step.description}</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleNext}
                        className={`px-8 py-4 bg-gradient-to-r ${step.color} text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 min-w-[200px] justify-center`}
                    >
                        {currentStep === onboardingSteps.length - 1 ? (
                            <>
                                Get Started
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        ) : (
                            <>
                                Next
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        )}
                    </button>

                    {currentStep < onboardingSteps.length - 1 && (
                        <button
                            onClick={handleSkip}
                            className="text-blue-300 hover:text-white text-sm transition-colors"
                        >
                            Skip Tutorial
                        </button>
                    )}
                </div>

                {/* Blockchain Animation */}
                <div className="mt-12 flex items-center justify-center gap-4 text-blue-400/50">
                    <div className="w-3 h-3 bg-blue-400/50 rounded-full animate-ping"></div>
                    <div className="text-xs">Powered by Ethereum Blockchain</div>
                    <div className="w-3 h-3 bg-emerald-400/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
