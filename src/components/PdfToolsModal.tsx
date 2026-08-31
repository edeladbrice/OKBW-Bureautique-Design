import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PRIMARY_WHATSAPP_NUMBER } from '../utils/pricing';

interface PdfToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfToolsModal: React.FC<PdfToolsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'imgToPdf' | 'pageCounter'>('imgToPdf');
  
  // Image to PDF states
  const [selectedImages, setSelectedImages] = useState<Array<{ name: string; url: string; file: File }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  // Page counter states
  const [pageCount, setPageCount] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const mapped = files.map((file: File) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));
      setSelectedImages((prev) => [...prev, ...mapped]);
      setPdfReady(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateMergedPdf = async () => {
    if (selectedImages.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < selectedImages.length; i++) {
        if (i > 0) {
          doc.addPage();
        }

        const img = selectedImages[i];
        const imgElement = new Image();
        imgElement.src = img.url;

        await new Promise((resolve) => {
          imgElement.onload = () => resolve(true);
        });

        // Fit to A4
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);

        let imgWidth = imgElement.width;
        let imgHeight = imgElement.height;

        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        const renderWidth = imgWidth * ratio;
        const renderHeight = imgHeight * ratio;

        const posX = (pageWidth - renderWidth) / 2;
        const posY = (pageHeight - renderHeight) / 2;

        doc.addImage(imgElement, 'JPEG', posX, posY, renderWidth, renderHeight);
      }

      doc.save('OKBW-Dossier-Assemble.pdf');
      setPdfReady(true);
    } catch (err) {
      console.error('Error generating PDF', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentAnalyze = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // Simulate estimated page count by size or standard estimate
      const estimatedPages = Math.max(1, Math.ceil(file.size / (150 * 1024)));
      setPageCount(estimatedPages);
      setEstimatedPrice(estimatedPages * 250);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">100% Gratuit & Sécurisé</span>
                <span className="text-xs text-blue-200">• Traitement dans votre navigateur</span>
              </div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Boîte à Outils Document & PDF Express
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('imgToPdf')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === 'imgToPdf'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Assembler Photos / Scans en PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('pageCounter')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === 'pageCounter'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Estimateur de Saisie & Pagination</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {activeTab === 'imgToPdf' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200">
                <p className="font-bold">
                  🎓 Idéal pour les dossiers de concours (ENA, CAFOP, Police, Concours Directs) :
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Sélectionnez vos scans ou photos de diplômes, CNI, extraits, et téléchargez un unique fichier PDF prêt à être envoyé.
                </p>
              </div>

              {/* Upload Input */}
              <label className="block p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Cliquez ou déposez vos photos / scans ici
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Format JPG, PNG, WebP acceptés (Multi-fichiers)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Selected Images List */}
              {selectedImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Pages sélectionnées ({selectedImages.length}) :</span>
                    <button
                      onClick={() => setSelectedImages([])}
                      className="text-red-500 hover:underline text-[11px]"
                    >
                      Tout effacer
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                          P.{idx + 1}
                        </div>
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {selectedImages.length > 0 && (
                <button
                  onClick={generateMergedPdf}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Génération du PDF en cours...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Télécharger le PDF Assemblé ({selectedImages.length} pages)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {activeTab === 'pageCounter' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">
                  📝 Estimez le coût de saisie ou de mise en page de vos documents :
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Déposez un fichier texte ou scan pour obtenir l'estimation tarifaire immédiate et le barème dégressif OKBW.
                </p>
              </div>

              <label className="block p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40">
                <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Déposez votre document (Word, PDF, Texte)
                </span>
                <input
                  type="file"
                  onChange={handleDocumentAnalyze}
                  className="hidden"
                />
              </label>

              {fileName && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Document :</span>
                    <strong className="text-slate-900 dark:text-white truncate max-w-xs">{fileName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Volume estimé :</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold">~ {pageCount} Pages</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 font-bold">Tarif estimé Saisie OKBW :</span>
                    <strong className="text-base font-black text-emerald-600 font-['Outfit']">
                      {estimatedPrice.toLocaleString('fr-FR')} FCFA
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
