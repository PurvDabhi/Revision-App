import React, { useState, useEffect } from 'react';
import { Upload, FileText, Plus } from 'lucide-react';
import { apiService } from '../api';

interface SourceSelectorProps {
  selectedPDF: string;
  onPDFSelect: (pdf: string) => void;
}

export default function SourceSelector({ selectedPDF, onPDFSelect }: SourceSelectorProps) {
  const [pdfs, setPDFs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const response = await apiService.getPDFs();
      setPDFs(response.data);
    } catch (error) {
      console.error('Failed to load PDFs:', error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await apiService.uploadPDF(file);
      await loadPDFs();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Source Selection
      </h2>
      
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="source"
              value="all"
              checked={selectedPDF === 'all'}
              onChange={(e) => onPDFSelect(e.target.value)}
              className="text-blue-600"
            />
            <span>All uploaded PDFs</span>
          </label>
        </div>

        {pdfs.map((pdf) => (
          <div key={pdf}>
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="source"
                value={pdf}
                checked={selectedPDF === pdf}
                onChange={(e) => onPDFSelect(e.target.value)}
                className="text-blue-600"
              />
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="truncate">{pdf}</span>
            </label>
          </div>
        ))}

        <div className="border-t pt-4">
          <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            ) : (
              <Plus className="w-4 h-4 text-blue-600" />
            )}
            <span className="text-blue-600">
              {uploading ? 'Uploading...' : 'Upload new PDF'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}