import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  FileCheck, 
  Trash2, 
  Plus, 
  Paperclip,
  CheckCircle2,
  FileCode,
  FileSpreadsheet,
  File,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { UploadedFile } from '../types';
import { formatFileSize } from '../utils/pricing';

interface FileUploadDropzoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  label?: string;
  helperText?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  label = "Fichiers exemplaires du client (modèles, brouillons, visuels)",
  helperText = "Glissez-déposez vos fichiers ici ou cliquez pour parcourir (Word, PDF, Images, Excel, ZIP...)"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // 1. Bloquer strictement les comportements par défaut du navigateur sur window et document.body
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const events: (keyof WindowEventMap)[] = ['dragenter', 'dragover', 'dragleave', 'drop'];

    events.forEach((eventName) => {
      window.addEventListener(eventName, preventDefaults as EventListener, false);
      document.body.addEventListener(eventName, preventDefaults as EventListener, false);
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, preventDefaults as EventListener, false);
        document.body.removeEventListener(eventName, preventDefaults as EventListener, false);
      });
    };
  }, []);

  const processFileList = useCallback((fileList: FileList | null | File[]) => {
    if (!fileList || (fileList instanceof FileList && fileList.length === 0) || (Array.isArray(fileList) && fileList.length === 0)) return;

    const listArray = Array.from(fileList);
    const newFiles: UploadedFile[] = [];
    const remainingSlots = maxFiles - files.length;
    const countToAdd = Math.min(listArray.length, remainingSlots);

    for (let i = 0; i < countToAdd; i++) {
      const file = listArray[i];
      // Create preview for images
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          // ignore
        }
      }

      newFiles.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl
      });
    }

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
      setLastAddedName(newFiles[0].name);
      setTimeout(() => {
        setLastAddedName(null);
      }, 5000);
    }
  }, [files, maxFiles, onFilesChange]);

  // Handlers pour la zone de dépôt
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFileList(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const getFileIcon = (file: UploadedFile) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4 text-amber-500" />;
    }
    if (['doc', 'docx', 'txt', 'rtf', 'odt', 'pdf'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    }
    return <File className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-2.5">
      {/* Label and counter */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
          <Paperclip className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
          {files.length} / {maxFiles} fichier(s)
        </span>
      </div>

      {/* Drop Zone Area with explicit event suppression & active borders */}
      {files.length < maxFiles && (
        <div
          id="file-dropzone-container"
          ref={dropAreaRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? 'border-blue-600 bg-blue-100/95 dark:bg-blue-950/90 ring-4 ring-blue-500/30 scale-[1.02] shadow-xl'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <input
            id="file-dropzone-input"
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.svg,.zip,.rar"
          />

          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isDragging 
                ? 'bg-blue-600 text-white scale-125 shadow-lg shadow-blue-500/50 ring-4 ring-white/50' 
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            }`}>
              <UploadCloud className={`w-6 h-6 ${isDragging ? 'animate-bounce' : ''}`} />
            </div>

            <div>
              <p className={`text-xs sm:text-sm font-extrabold ${isDragging ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-white'}`}>
                {isDragging ? '📂 Déposez vos fichiers maintenant !' : 'Glissez-déposez vos fichiers exemplaires ici'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                {helperText}
              </p>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-blue-600 dark:text-blue-300 shadow-xs hover:bg-blue-50">
                <Plus className="w-3.5 h-3.5" />
                <span>Parcourir mes documents sur mon appareil</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation & Assistant message for WhatsApp dispatch */}
      {lastAddedName && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              Fichier <span className="underline font-mono">[{lastAddedName}]</span> sélectionné !
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Cliquez sur le bouton de commande pour nous l'envoyer directement avec votre commande via WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Fichiers prêts pour votre commande ({files.length})</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs group"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {file.previewUrl ? (
                      <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatFileSize(file.size)} • Prêt pour WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center space-x-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Prêt</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Retirer ce fichier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300 flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>
              Vos fichiers seront automatiquement référencés dans le message WhatsApp et prêts pour l'envoi en 1 clic.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

