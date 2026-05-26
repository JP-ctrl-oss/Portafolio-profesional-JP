import { X } from 'lucide-react';

export interface VernierSimulatorProps {
  onClose: () => void;
}

export function VernierSimulator({ onClose }: VernierSimulatorProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Calibrador Vernier Digital</h2>
            <p className="text-sm text-gray-500 mt-1">Simulador interactivo - Precisión: 1/128 pulgada (0.198mm)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content - Iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://maheshkurmi.github.io/experiments/vernier_calliper.html"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
            className="w-full h-full"
            title="Vernier Caliper Simulator"
          />
        </div>
      </div>
    </div>
  );
}
