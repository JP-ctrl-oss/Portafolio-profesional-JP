import { useState } from 'react';
import { X } from 'lucide-react';

export interface VernierCalibratorProps {
  onClose: () => void;
}

export function PortfolioVernierCalibrator({ onClose }: VernierCalibratorProps) {
  const [mainScaleReading, setMainScaleReading] = useState(0);
  const [vernierPosition, setVernierPosition] = useState(0);
  
  // Precisión: 1/128 de pulgada = 0.0078125 pulgadas = 0.198mm
  const VERNIER_PRECISION = 1 / 128; // en pulgadas
  const VERNIER_PRECISION_MM = VERNIER_PRECISION * 25.4; // convertir a mm
  
  // Cada división del Vernier es 1/128 pulgadas
  const MAX_VERNIER_DIVISIONS = 128;
  
  // Cálculo exacto de la medida
  const mainScaleInches = mainScaleReading * 0.1;
  const vernierReading = (vernierPosition / MAX_VERNIER_DIVISIONS) * VERNIER_PRECISION;
  const totalReadingInches = mainScaleInches + vernierReading;
  const totalReadingMM = totalReadingInches * 25.4;
  
  // Generar marcas de la escala principal
  const mainScaleMarks = Array.from({ length: 51 }, (_, i) => i * 0.1);
  
  // Generar marcas de la escala Vernier (128 divisiones)
  const vernierMarks = Array.from({ length: MAX_VERNIER_DIVISIONS + 1 }, (_, i) => i);
  
  const handleMainScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainScaleReading(Number(e.target.value));
  };
  
  const handleVernierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVernierPosition(Number(e.target.value));
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calibrador Vernier Digital</h2>
            <p className="text-sm text-gray-600 mt-1">Precisión: 1/128 pulgada (0.198mm)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Simulador Visual */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Simulador Visual</h3>
            
            {/* Escala Principal (Superior) */}
            <div className="mb-12">
              <label className="text-sm font-medium text-gray-700 block mb-3">Escala Principal (pulgadas)</label>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300 overflow-x-auto">
                <div className="relative h-24 flex items-center" style={{ width: '800px' }}>
                  {/* Línea base */}
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-800"></div>
                  
                  {/* Marcas de la escala principal */}
                  {mainScaleMarks.map((mark, i) => {
                    const position = (mark / 5) * 100;
                    const isMajor = i % 10 === 0;
                    return (
                      <div
                        key={i}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${position}%` }}
                      >
                        <div
                          className={`bg-gray-800 ${isMajor ? 'h-4 w-1' : 'h-2.5 w-0.5'}`}
                        ></div>
                        {isMajor && (
                          <span className="text-xs font-semibold text-gray-700 mt-2">{mark.toFixed(1)}</span>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Indicador del cursor principal */}
                  <div
                    className="absolute top-0 w-0.5 h-full bg-red-500 transition-all duration-100"
                    style={{ left: `${(mainScaleReading / 5) * 100}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.1"
                value={mainScaleReading}
                onChange={handleMainScaleChange}
                className="w-full mt-4 cursor-pointer h-2 bg-gray-300 rounded-lg appearance-none"
              />
              <p className="text-sm text-gray-600 mt-2">Lectura: {mainScaleReading.toFixed(2)} pulgadas</p>
            </div>

            {/* Escala Vernier (Inferior) */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-700 block mb-3">Escala Vernier (1/128 pulgada)</label>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300 overflow-x-auto">
                <div className="relative h-24 flex items-center" style={{ width: '1024px' }}>
                  {/* Línea base */}
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-blue-800"></div>
                  
                  {/* Marcas de la escala Vernier */}
                  {vernierMarks.map((mark, i) => {
                    const position = (mark / MAX_VERNIER_DIVISIONS) * 100;
                    const isMajor = i % 8 === 0;
                    return (
                      <div
                        key={i}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${position}%` }}
                      >
                        <div
                          className={`bg-blue-800 ${isMajor ? 'h-4 w-0.5' : 'h-2 w-0.5'}`}
                        ></div>
                        {isMajor && (
                          <span className="text-xs font-semibold text-blue-700 mt-2">{mark}</span>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Indicador del cursor Vernier */}
                  <div
                    className="absolute top-0 w-0.5 h-full bg-green-500 transition-all duration-100"
                    style={{ left: `${(vernierPosition / MAX_VERNIER_DIVISIONS) * 100}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={MAX_VERNIER_DIVISIONS}
                step="1"
                value={vernierPosition}
                onChange={handleVernierChange}
                className="w-full mt-4 cursor-pointer h-2 bg-gray-300 rounded-lg appearance-none"
              />
              <p className="text-sm text-gray-600 mt-2">
                Posición: {vernierPosition} / {MAX_VERNIER_DIVISIONS} divisiones
              </p>
            </div>
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lectura Detallada */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">Lectura Detallada</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Escala Principal:</span>
                  <span className="font-mono font-bold text-blue-700">{mainScaleInches.toFixed(4)}"</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Escala Vernier:</span>
                  <span className="font-mono font-bold text-green-700">+{vernierReading.toFixed(6)}"</span>
                </div>
                <div className="h-px bg-blue-300"></div>
                <div className="flex justify-between items-center bg-white rounded p-2">
                  <span className="text-gray-900 font-semibold">Medida Total:</span>
                  <span className="font-mono font-bold text-blue-900 text-lg">{totalReadingInches.toFixed(6)}"</span>
                </div>
              </div>
            </div>

            {/* Conversiones */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Conversiones</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Milímetros (mm):</span>
                  <span className="font-mono font-bold text-green-700">{totalReadingMM.toFixed(4)} mm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Centímetros (cm):</span>
                  <span className="font-mono font-bold text-green-700">{(totalReadingMM / 10).toFixed(5)} cm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Micrómetros (µm):</span>
                  <span className="font-mono font-bold text-green-700">{(totalReadingMM * 1000).toFixed(1)} µm</span>
                </div>
                <div className="h-px bg-green-300"></div>
                <div className="text-xs text-gray-600 bg-white rounded p-2">
                  <strong>Precisión:</strong> 0.0078125" (0.198 mm)
                </div>
              </div>
            </div>
          </div>

          {/* Información técnica */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-900 mb-3">Información Técnica</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 font-medium">Rango de Medición:</p>
                <p className="text-amber-700 font-mono">0" - 5"</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Precisión del Vernier:</p>
                <p className="text-amber-700 font-mono">1/128" (0.198mm)</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Divisiones del Vernier:</p>
                <p className="text-amber-700 font-mono">128 divisiones</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Tipo de Medición:</p>
                <p className="text-amber-700 font-mono">Exteriores</p>
              </div>
            </div>
          </div>

          {/* Fórmula de Cálculo */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">Fórmula de Cálculo</h4>
            <div className="font-mono text-sm text-purple-800 space-y-2">
              <p><span className="font-bold">Lectura Total =</span> (Escala Principal) + (Posición Vernier × 1/128)</p>
              <p className="text-xs text-gray-600 mt-2">Ejemplo: Si Principal = 1.2" y Vernier = 64, entonces:</p>
              <p className="text-xs text-purple-700">Lectura = 1.2 + (64 × 1/128) = 1.2 + 0.5 = 1.7"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
