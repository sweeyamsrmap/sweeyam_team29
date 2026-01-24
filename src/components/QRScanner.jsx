import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

function QRScanner({ onScan, onClose }) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState(null)
    const [manualInput, setManualInput] = useState('')
    const scannerRef = useRef(null)
    const html5QrCodeRef = useRef(null)

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => { })
            }
        }
    }, [])

    const startScanning = async () => {
        setError(null)
        setIsScanning(true)

        try {
            const html5QrCode = new Html5Qrcode('qr-reader')
            html5QrCodeRef.current = html5QrCode

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    // Success callback
                    html5QrCode.stop().then(() => {
                        setIsScanning(false)
                        onScan(decodedText)
                    })
                },
                (errorMessage) => {
                    // Error callback (ignore, it fires constantly when no QR found)
                }
            )
        } catch (err) {
            setError('Camera access denied or not available. Try manual input.')
            setIsScanning(false)
        }
    }

    const stopScanning = async () => {
        if (html5QrCodeRef.current) {
            await html5QrCodeRef.current.stop().catch(() => { })
        }
        setIsScanning(false)
    }

    const handleManualSubmit = () => {
        if (manualInput.trim()) {
            onScan(manualInput.trim())
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">qr_code_scanner</span>
                        Scan QR Code
                    </h3>
                    <button
                        onClick={() => {
                            stopScanning()
                            onClose()
                        }}
                        className="text-blue-300 hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative mb-6">
                    <div
                        id="qr-reader"
                        ref={scannerRef}
                        className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center"
                    >
                        {!isScanning && (
                            <div className="text-center p-6">
                                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-blue-400 text-4xl">qr_code_scanner</span>
                                </div>
                                <p className="text-blue-200 mb-4">Scan QR code to verify ESG record</p>
                                <button
                                    onClick={startScanning}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto"
                                >
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    Start Camera
                                </button>
                            </div>
                        )}
                    </div>

                    {isScanning && (
                        <button
                            onClick={stopScanning}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                            Stop Scanning
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg mb-4">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="text-blue-300 text-sm">OR</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Manual Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Enter Transaction Hash Manually
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            placeholder="0x..."
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleManualSubmit}
                            disabled={!manualInput.trim()}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-blue-300">
                    Scan the QR code on an ESG certificate to verify its authenticity
                </p>
            </div>
        </div>
    )
}

export default QRScanner
