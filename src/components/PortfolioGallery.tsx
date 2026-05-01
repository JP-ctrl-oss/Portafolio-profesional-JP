import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioFile {
  id: string;
  name: string;
  type: string;
  preview?: string;
}

interface PortfolioGalleryProps {
  files: PortfolioFile[];
}

export function PortfolioGallery({ files }: PortfolioGalleryProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const imageFiles = files.filter((f) => f.type.includes('image'));

  if (imageFiles.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % imageFiles.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Galería de Trabajos
      </h3>
      <div className="relative group">
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
          {imageFiles[carouselIndex].preview && (
            <img
              src={imageFiles[carouselIndex].preview}
              alt={imageFiles[carouselIndex].name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigation Buttons */}
          {imageFiles.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {imageFiles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imageFiles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === carouselIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image Info */}
        <p className="mt-2 text-sm text-apple-gray-600">
          {carouselIndex + 1} de {imageFiles.length} • {imageFiles[carouselIndex].name}
        </p>
      </div>

      {/* Thumbnail Grid */}
      {imageFiles.length > 1 && (
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {imageFiles.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setCarouselIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === carouselIndex
                  ? 'border-blue-500 ring-2 ring-blue-400'
                  : 'border-apple-gray-200 hover:border-apple-gray-300'
              }`}
            >
              {img.preview && (
                <img
                  src={img.preview}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
