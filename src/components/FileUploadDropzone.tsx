import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Paperclip,
  CheckCircle2, 
  FileSpreadsheet, 
  File, 
  Sparkles, 
  Info,
  Check
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
  label = "Fichiers exemplaires & Pièces jointes",
  helperText = "Glissez-déposez vos documents ici ou cliquez pour parcourir (PDF, Word, Images, Scan...)"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Prevent browser default behavior for drag & drop globally without stopping propagation to dropzone
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleGlobalDragOver, false);
    window.addEventListener('drop', handleGlobalDrop, false);

    return () => {
      window.removeEventListener('dragover', handleGlobalDragOver, false);
      window.removeEventListener('drop', handleGlobalDrop, false);
    };
  }, []);

  const processFileList = useCallback((fileList: FileList | null | File[]) => {
    if (!fileList) return;
    const listArray = Array.from(fileList);
    if (listArray.length === 0) return;

    const remainingSlots = Math.max(0, maxFiles - files.length);
    if (remainingSlots === 0) return;

    const countToAdd = Math.min(listArray.length, remainingSlots);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < countToAdd; i++) {
      const file = listArray[i];
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          // ignore preview error
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
      }, 4000);
    }
  }, [files, maxFiles, onFilesChange]);

  // Direct DOM listeners on the drop container to guarantee 100% reliability in all browser contexts & iframes
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current += 1;
      setIsDragging(true);
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragging(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFileList(e.dataTransfer.files);
      }
    };

    dropArea.addEventListener('dragenter', onDragEnter);
    dropArea.addEventListener('dragover', onDragOver);
    dropArea.addEventListener('dragleave', onDragLeave);
    dropArea.addEventListener('drop', onDrop);

    return () => {
      dropArea.removeEventListener('dragenter', onDragEnter);
      dropArea.removeEventListener('dragover', onDragOver);
      dropArea.removeEventListener('dragleave', onDragLeave);
      dropArea.removeEventListener('drop', onDrop);
    };
  }, [processFileList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
      return <ImageIcon className="w-4 h-4 text-[#FF8800]" />;
    }
    if (['doc', 'docx', 'txt', 'rtf', 'odt', 'pdf'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-[#0F52BA]" />;
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
          <Paperclip className="w-3.5 h-3.5 text-[#0F52BA] dark:text-blue-400" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {files.length} / {maxFiles} fichier(s)
        </span>
      </div>

      {/* Drop Zone Area with explicit event suppression & active borders */}
      {files.length < maxFiles && (
        <div
          id="file-dropzone-container"
          ref={dropAreaRef}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? 'border-[#0F52BA] bg-blue-100/95 dark:bg-blue-950/90 ring-4 ring-blue-500/30 scale-[1.02] shadow-xl'
              : 'border-slate-300 dark:border-slate-700 hover:border-[#0F52BA] dark:hover:border-blue-400 bg-slate-50/90 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800'
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
                ? 'bg-[#0F52BA] text-white scale-125 shadow-lg shadow-blue-500/50 ring-4 ring-white/50 animate-bounce' 
                : 'bg-blue-50 dark:bg-blue-900/50 text-[#0F52BA] dark:text-blue-400'
            }`}>
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className={`text-xs sm:text-sm font-extrabold ${isDragging ? 'text-[#0F52BA] dark:text-blue-300' : 'text-slate-800 dark:text-white'}`}>
                {isDragging ? '📂 Déposez vos fichiers maintenant !' : 'Glissez-déposez vos fichiers exemplaires ou pièces jointes ici'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                {helperText}
              </p>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-[#0F52BA] dark:text-blue-300 shadow-xs hover:bg-blue-50">
                <Plus className="w-3.5 h-3.5 text-[#FF8800]" />
                <span>Ou cliquez pour parcourir vos fichiers</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation notification after file added */}
      {lastAddedName && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">
              Fichier <span className="underline font-mono">[{lastAddedName}]</span> ajouté avec succès !
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Il sera inclus dans votre récapitulatif de commande WhatsApp.
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

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-[11px] text-[#0F52BA] dark:text-blue-300 flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-[#0F52BA] dark:text-blue-400 flex-shrink-0" />
            <span>
              Vos fichiers seront joints et transmis avec votre message de commande WhatsApp.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
