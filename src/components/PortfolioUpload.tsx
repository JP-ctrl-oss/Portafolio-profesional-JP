import { useState, useRef } from 'react';
import { Upload, File, X, Download, Eye, FileText } from 'lucide-react';

interface PortfolioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  file: File;
}

export function PortfolioUpload() {
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        const newFile: PortfolioFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          file: file,
        };
        setFiles((prev) => [...prev, newFile]);
      } else {
        alert(`El archivo "${file.name}" no está permitido. Usa PDF, Word, Excel, imágenes, etc.`);
      }
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const downloadFile = (file: PortfolioFile) => {
    const url = URL.createObjectURL(file.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const viewFile = (file: PortfolioFile) => {
    const url = URL.createObjectURL(file.file);
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('document')) return 'DOC';
    if (type.includes('sheet') || type.includes('excel')) return 'XLS';
    if (type.includes('image')) return 'IMG';
    return 'FILE';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50/50'
            : 'border-apple-gray-200 bg-apple-gray-50/50 hover:border-apple-gray-300'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-3 rounded-lg ${isDragging ? 'bg-blue-100' : 'bg-apple-gray-100'}`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-apple-gray-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Arrastra tus archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-apple-gray-400 mt-1">
              PDF, Word, Excel, imágenes (máximo 50MB cada uno)
            </p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-2 px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Seleccionar Archivo
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Archivos Cargados ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-white border border-apple-gray-100 rounded-xl hover:border-apple-gray-200 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {getFileIcon(file.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-apple-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.type.includes('pdf') || file.type.includes('image') ? (
                    <button
                      onClick={() => viewFile(file)}
                      className="p-2 text-apple-gray-500 hover:text-foreground hover:bg-apple-gray-100 rounded-lg transition-colors"
                      title="Ver archivo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  ) : null}
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-2 text-apple-gray-500 hover:text-foreground hover:bg-apple-gray-100 rounded-lg transition-colors"
                    title="Descargar archivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-apple-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar archivo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="mt-8 text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-apple-gray-100 mb-3">
            <FileText className="w-6 h-6 text-apple-gray-400" />
          </div>
          <p className="text-sm text-apple-gray-400">
            Ningún archivo cargado aún. Carga tus documentos para empezar.
          </p>
        </div>
      )}
    </div>
  );
}
