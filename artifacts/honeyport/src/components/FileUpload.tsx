import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseUploadedLog } from '@/lib/export';
import { LogEntry } from '@/lib/simulation';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onUploadSuccess: (logs: LogEntry[]) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Simulate processing delay for effect
      setTimeout(() => {
        const logs = parseUploadedLog(text, file.name);
        setIsProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          onUploadSuccess(logs);
          setSuccess(false);
        }, 1000);
      }, 1500);
    };
    
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel rounded-lg p-6 flex flex-col items-center justify-center text-center font-mono relative overflow-hidden">
      
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <div className="text-primary font-bold animate-pulse">PARSING LOG DATA...</div>
            <div className="text-xs text-muted-foreground mt-2">Extracting IOCs and threat signatures</div>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/20 z-10 flex flex-col items-center justify-center backdrop-blur-sm border border-primary"
          >
            <CheckCircle className="text-primary w-16 h-16 mb-4" />
            <div className="text-primary font-bold text-xl">INGESTION COMPLETE</div>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer relative
          ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
        `}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".csv,.json,.log,.txt"
          onChange={handleChange}
        />
        
        <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        
        <p className="text-sm text-foreground mb-1 font-bold">
          Drag & Drop telemetry file here
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supports .log, .txt, .csv, .json
        </p>
        
        <label htmlFor="file-upload">
          <span className="bg-background border border-border hover:bg-muted text-foreground font-mono text-xs px-4 py-2 rounded pointer-events-auto cursor-pointer inline-flex items-center gap-2">
            <FileType size={14} /> BROWSE LOCAL FILES
          </span>
        </label>
      </form>
    </div>
  );
}
