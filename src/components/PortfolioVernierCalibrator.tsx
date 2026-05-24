import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export interface VernierCalibratorProps {
  onClose: () => void;
}

export function PortfolioVernierCalibrator({ onClose }: VernierCalibratorProps) {
  // ============ ESTADO ============
  const [cursorPosition, setCursorPosition] = useState(0); // 0-8 en escala Vernier
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'practice' | 'challenge'>('practice');
  const [challenge, setChallenge] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============ CONSTANTES ============
  const MAIN_SCALE_DIVISIONS_PER_INCH = 16; // 16 lÃ­neas por pulgada
  const VERNIER_DIVISIONS = 8; // Nonio de 8 divisiones
  const MAX_MAIN_SCALE = 6; // 0-6 pulgadas
  const PRECISION = 1 / 128; // PrecisiÃ³n: 1/128"

  // ============ CÃLCULOS MATEMÃTICOS ============
  
  // Convertir posiciÃ³n del Vernier (0-8) a pulgadas
  const getMainScaleReading = () => {
    return Math.floor(cursorPosition / MAIN_SCALE_DIVISIONS_PER_INCH) / 16;
  };

  const getVernierReading = () => {
    const remainder = cursorPosition % MAIN_SCALE_DIVISIONS_PER_INCH;
    return (remainder / MAIN_SCALE_DIVISIONS_PER_INCH) * (1 / 16);
  };

  const getTotalInches = () => {
    return getMainScaleReading() + getVernierReading();
  };

  // Simplificar fracciones
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const decimalToFraction = (decimal: number): { numerator: number; denominator: number } => {
    const tolerance = 1 / 10000;
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = decimal;

    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > tolerance);

    return { numerator: h1, denominator: k1 };
  };

  // Obtener lectura en fracciÃ³n simplificada
  const getReadingAsFraction = (): string => {
    const total = getTotalInches();
    const inches = Math.floor(total);
    const fractional = total - inches;

    if (fractional < 0.001) {
      return inches === 0 ? '0"' : `${inches}"`;
    }

    // Convertir a 128avos (la unidad mÃ¡s pequeÃ±a)
    const partsOf128 = Math.round(fractional * 128);
    
    if (partsOf128 === 0) {
      return inches === 0 ? '0"' : `${inches}"`;
    }

    // Simplificar la fracciÃ³n
    const divisor = gcd(partsOf128, 128);
    const numerator = partsOf128 / divisor;
    const denominator = 128 / divisor;

    let result = '';
    if (inches > 0) {
      result = `${inches} ${numerator}/${denominator}"`;
    } else {
      result = `${numerator}/${denominator}"`;
    }

    return result;
  };

  // ============ FUNCIONES DE INTERACCIÃ“N ============

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    
    // Convertir porcentaje a posiciÃ³n de Vernier (0-8)
    const newPosition = (percentage / 100) * (MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH);
    setCursorPosition(Math.round(newPosition * 10) / 10); // Redondear a 1 decimal
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    const newPosition = (percentage / 100) * (MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH);
    setCursorPosition(Math.round(newPosition * 10) / 10);
  };

  const incrementCursor = () => {
    const maxPosition = MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH;
    setCursorPosition(Math.min(maxPosition, cursorPosition + 1));
  };

  const decrementCursor = () => {
    setCursorPosition(Math.max(0, cursorPosition - 1));
  };

  // ============ MODO DESAFÃO ============

  const generateChallenge = () => {
    const randomNumerator = Math.floor(Math.random() * 128) + 1;
    const tempFraction = decimalToFraction(randomNumerator / 128);
    const num = tempFraction.numerator;
    const denom = tempFraction.denominator;
    
    setChallenge(`${num}/${denom}"`);
    setChallengeResult(null);
    setCursorPosition(0);
  };

  const validateChallenge = () => {
    if (!challenge) return;

    const currentReading = getReadingAsFraction();
    const isCorrect = currentReading.trim() === challenge.trim();

    setChallengeResult(isCorrect ? 'âœ… Â¡Correcto!' : `âŒ Incorrecto. Tu lectura: ${currentReading}`);
  };

  // ============ COMPONENTES AUXILIARES ============

  // Renderizar marcas de escala principal
  const renderMainScaleMarks = () => {
    const marks = [];
    const scaleFactor = 100 / (MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH);

    for (let i = 0; i <= MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH; i++) {
      const inch = Math.floor(i / MAIN_SCALE_DIVISIONS_PER_INCH);
      const divisionInInch = i % MAIN_SCALE_DIVISIONS_PER_INCH;
      
      const isInch = divisionInInch === 0;
      const isHalf = divisionInInch === 8;
      const isQuarter = divisionInInch === 4 || divisionInInch === 12;

      let height = '8px';
      if (isInch) height = '20px';
      else if (isHalf) height = '16px';
      else if (isQuarter) height = '12px';

      const position = i * scaleFactor;

      marks.push(
        <div
          key={`main-${i}`}
          className="absolute bottom-0 bg-gray-900"
          style={{
            left: `${position}%`,
            width: '2px',
            height: height,
            transform: 'translateX(-50%)',
          }}
        >
          {isInch && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">
              {inch}"
            </div>
          )}
        </div>
      );
    }

    return marks;
  };

  // Renderizar escala Vernier (Nonio)
  const renderVernierScale = () => {
    const marks = [];
    const scaleFactor = 100 / VERNIER_DIVISIONS;

    for (let i = 0; i <= VERNIER_DIVISIONS; i++) {
      const height = i % 2 === 0 ? '12px' : '6px';
      const position = i * scaleFactor;

      marks.push(
        <div
          key={`vernier-${i}`}
          className="absolute bottom-0 bg-blue-700"
          style={{
            left: `${position}%`,
            width: '1px',
            height: height,
            transform: 'translateX(-50%)',
          }}
        >
          {i % 2 === 0 && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-800">
              {i}
            </div>
          )}
        </div>
      );
    }

    return marks;
  };

  // Calcular posiciÃ³n del cursor en porcentaje
  const cursorPercentage = (cursorPosition / (MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        
        {/* ============ HEADER ============ */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-4 border-b-4 border-blue-600 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">ðŸ“ Calibrador Vernier Mitutoyo Premium</h2>
            <p className="text-sm text-gray-300 mt-1">Simulador MetrolÃ³gico Avanzado | PrecisiÃ³n: 1/128" (0.198mm)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={28} className="text-white" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* ============ SELECTOR DE MODO ============ */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setMode('practice');
                setChallengeResult(null);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                mode === 'practice'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              ðŸ“š Modo PrÃ¡ctica
            </button>
            <button
              onClick={() => {
                setMode('challenge');
                generateChallenge();
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                mode === 'challenge'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              ðŸŽ¯ Modo DesafÃ­o
            </button>
          </div>

          {/* ============ SIMULADOR VISUAL ============ */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 border-4 border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Calibrador Vernier Realista</h3>

            {/* Contenedor principal del calibrador */}
            <div className="bg-white rounded-lg p-12 shadow-xl border-4 border-gray-400">
              
              {/* CUERPO PRINCIPAL - REGLA FIJA */}
              <div className="relative mb-12">
                <div
                  ref={containerRef}
                  className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 rounded-lg p-6 border-4 border-gray-600 h-32 cursor-move"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    background: 'linear-gradient(135deg, #e5e5e5 0%, #d0d0d0 50%, #c0c0c0 100%)',
                    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* LÃ­nea grabada superior */}
                  <div className="absolute top-2 left-4 right-4 h-px bg-gray-900 opacity-40"></div>

                  {/* Escala Principal */}
                  <div className="relative h-16 flex items-end justify-start overflow-hidden mb-4">
                    {renderMainScaleMarks()}
                  </div>

                  {/* LÃ­nea de referencia central */}
                  <div className="relative h-1 bg-gray-900 my-4"></div>

                  {/* CURSOR MÃ“VIL - Nonio */}
                  <div
                    ref={dragRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-blue-300 to-blue-400 border-4 border-blue-700 rounded-md cursor-grab active:cursor-grabbing transition-all"
                    style={{
                      left: `${cursorPercentage}%`,
                      transform: 'translateX(-50%)',
                      boxShadow: '0 4px 12px rgba(0, 0, 255, 0.4)',
                    }}
                  >
                    {/* Escala Vernier dentro del cursor */}
                    <div className="relative w-full h-12 flex items-end justify-start mt-6 pl-2">
                      {renderVernierScale()}
                    </div>

                    {/* Indicador visual del nonio */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-600 opacity-70"></div>

                    {/* Asa para el pulgar */}
                    <div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-xl border-2 border-gray-900"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    ></div>
                  </div>

                  {/* Escala Vernier debajo */}
                  <div className="relative h-12 flex items-start justify-start overflow-hidden mt-4">
                    {renderVernierScale()}
                  </div>

                  {/* LÃ­nea grabada inferior */}
                  <div className="absolute bottom-2 left-4 right-4 h-px bg-gray-900 opacity-40"></div>
                </div>

                {/* VARILLA DE PROFUNDIDAD */}
                <div
                  className="absolute right-0 top-12 w-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r-lg border-2 border-gray-900"
                  style={{
                    height: `${(cursorPosition / (MAX_MAIN_SCALE * MAIN_SCALE_DIVISIONS_PER_INCH)) * 80}px`,
                    minHeight: '20px',
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
                  }}
                ></div>
              </div>

              {/* CONTROLES DE MICRO-DESPLAZAMIENTO */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={decrementCursor}
                  className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-lg text-xl"
                >
                  âž– -1/128"
                </button>
                <div className="text-center px-6 py-3 bg-gray-200 rounded-lg border-2 border-gray-400">
                  <p className="text-xs text-gray-600 font-semibold">POSICIÃ“N ACTUAL</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{cursorPosition.toFixed(1)} / 96</p>
                </div>
                <button
                  onClick={incrementCursor}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 active:scale-95 transition-all shadow-lg text-xl"
                >
                  âž• +1/128"
                </button>
              </div>
            </div>
          </div>

          {/* ============ PANEL DE RESULTADOS ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lectura Principal */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-4 border-blue-400 shadow-lg">
              <h4 className="text-xs font-bold text-blue-900 mb-2 uppercase">Lectura Fraccionaria</h4>
              <div
                className="font-mono text-4xl font-bold text-blue-700 text-center p-4 bg-white rounded-lg border-2 border-blue-300"
                style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {getReadingAsFraction()}
              </div>
              <p className="text-sm text-blue-600 mt-3 text-center">
                Decimal: {getTotalInches().toFixed(6)}"
              </p>
            </div>

            {/* Conversiones */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border-4 border-purple-400 shadow-lg">
              <h4 className="text-xs font-bold text-purple-900 mb-2 uppercase">Conversiones MÃ©tricas</h4>
              <div className="space-y-2 text-center">
                <div className="bg-white p-3 rounded-lg border-2 border-purple-300">
                  <p className="text-xs text-gray-600">MilÃ­metros (mm)</p>
                  <p className="font-mono text-2xl font-bold text-purple-700">{(getTotalInches() * 25.4).toFixed(3)} mm</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-purple-300">
                  <p className="text-xs text-gray-600">CentÃ­metros (cm)</p>
                  <p className="font-mono text-2xl font-bold text-purple-700">{(getTotalInches() * 2.54).toFixed(4)} cm</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============ MODO DESAFÃO ============ */}
          {mode === 'challenge' && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-4 border-yellow-400 shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-900 mb-6 text-center">ðŸŽ¯ Modo DesafÃ­o</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DesafÃ­o actual */}
                <div className="bg-white p-6 rounded-lg border-3 border-yellow-400 shadow-md">
                  <p className="text-sm text-gray-600 font-semibold mb-2">BUSCA LA MEDIDA:</p>
                  <div
                    className="font-mono text-4xl font-bold text-yellow-700 text-center p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300"
                    style={{ minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {challenge}
                  </div>
                </div>

                {/* Resultado */}
                <div className="flex flex-col justify-between">
                  <div className="bg-white p-6 rounded-lg border-3 border-purple-400 shadow-md mb-4">
                    <p className="text-sm text-gray-600 font-semibold mb-2">TU LECTURA ACTUAL:</p>
                    <div className="font-mono text-3xl font-bold text-purple-700 text-center p-3 bg-purple-100 rounded border-2 border-purple-300">
                      {getReadingAsFraction()}
                    </div>
                  </div>

                  <button
                    onClick={validateChallenge}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all shadow-lg"
                  >
                    âœ… Verificar
                  </button>
                </div>
              </div>

              {/* Resultado de verificaciÃ³n */}
              {challengeResult && (
                <div className={`mt-6 p-6 rounded-lg text-center font-bold text-lg border-3 ${
                  challengeResult.startsWith('âœ…')
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-red-100 border-red-400 text-red-700'
                }`}>
                  {challengeResult}
                </div>
              )}

              <button
                onClick={generateChallenge}
                className="w-full mt-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 active:scale-95 transition-all shadow-lg"
              >
                ðŸ”„ Nuevo DesafÃ­o
              </button>
            </div>
          )}

          {/* ============ INFORMACIÃ“N TÃ‰CNICA ============ */}
          <div className="bg-gray-50 rounded-xl p-8 border-4 border-gray-400 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-6">ðŸ“‹ Especificaciones TÃ©cnicas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <p className="text-xs text-gray-600 font-semibold">Rango</p>
                <p className="font-mono font-bold text-gray-900 text-lg">0" - 6"</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <p className="text-xs text-gray-600 font-semibold">LÃ­neas por Pulgada</p>
                <p className="font-mono font-bold text-gray-900 text-lg">16 lÃ­neas</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <p className="text-xs text-gray-600 font-semibold">Divisiones Nonio</p>
                <p className="font-mono font-bold text-gray-900 text-lg">8 divisiones</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <p className="text-xs text-gray-600 font-semibold">PrecisiÃ³n</p>
                <p className="font-mono font-bold text-gray-900 text-lg">1/128"</p>
              </div>
            </div>
          </div>

          {/* ============ INSTRUCCIONES ============ */}
          <div className="bg-blue-50 rounded-xl p-8 border-4 border-blue-400 shadow-lg">
            <h4 className="text-xl font-bold text-blue-900 mb-4">ðŸ“– CÃ³mo Usar</h4>
            <ol className="space-y-3 text-blue-900 list-decimal list-inside font-medium">
              <li><strong>Arrastra el cursor azul</strong> con el ratÃ³n para desplazar la escala Vernier.</li>
              <li><strong>Usa +/- botones</strong> para ajustes de precisiÃ³n (1/128" por clic).</li>
              <li><strong>Lee la escala principal</strong> donde termina el cero del Nonio.</li>
              <li><strong>Lee la lÃ­nea Vernier</strong> que se alinea exactamente con la escala fija.</li>
              <li><strong>En Modo DesafÃ­o</strong>, encuentra la medida indicada y verifica tu lectura.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
