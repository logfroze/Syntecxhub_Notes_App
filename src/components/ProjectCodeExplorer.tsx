import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ANDROID_FILES } from '../data/androidFilesData';
import { ProjectFile } from '../types';
import { downloadAndroidProjectZip } from '../utils/exportZip';

export const ProjectCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_FILES[6]); // Note.kt by default
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  // Group files into logical sections
  const gradleFiles = ANDROID_FILES.filter(f => f.path.includes('.gradle') || f.path.includes('.properties') || f.path.includes('.toml'));
  const kotlinFiles = ANDROID_FILES.filter(f => f.path.endsWith('.kt') && !f.path.includes('Test'));
  const testFiles = ANDROID_FILES.filter(f => f.path.includes('Test'));
  const xmlFiles = ANDROID_FILES.filter(f => f.path.endsWith('.xml'));
  const docFiles = ANDROID_FILES.filter(f => f.path.endsWith('.md'));

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-[#DCE2EB] overflow-hidden shadow-xs">
      {/* Top Action Header */}
      <div className="bg-[#1E3152] text-white px-5 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-base font-bold tracking-tight">Android Studio Project Source</h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Complete production-ready Android files ready to open in Android Studio
          </p>
        </div>

        <button
          id="btn-download-android-zip"
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="px-4 py-2 text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md transition-all shadow-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating ZIP...' : 'Download Android Studio (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left File Tree Sidebar */}
        <div className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col overflow-y-auto p-3 text-xs">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
            Kotlin Source (MVVM)
          </div>
          <div className="space-y-0.5 mb-4">
            {kotlinFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-[#29436E] text-white font-semibold'
                    : 'text-[#334155] hover:bg-[#E2E8F0]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
            XML Layouts & Resources
          </div>
          <div className="space-y-0.5 mb-4">
            {xmlFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-[#29436E] text-white font-semibold'
                    : 'text-[#334155] hover:bg-[#E2E8F0]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
            Testing & Room Verification
          </div>
          <div className="space-y-0.5 mb-4">
            {testFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-[#29436E] text-white font-semibold'
                    : 'text-[#334155] hover:bg-[#E2E8F0]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
            Gradle & Documentation
          </div>
          <div className="space-y-0.5">
            {[...gradleFiles, ...docFiles].map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  selectedFile.path === file.path
                    ? 'bg-[#29436E] text-white font-semibold'
                    : 'text-[#334155] hover:bg-[#E2E8F0]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="flex-1 flex flex-col bg-[#0F172A] text-white overflow-hidden">
          {/* File Tab Bar */}
          <div className="bg-[#1E293B] border-b border-[#334155] px-4 py-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[#93C5FD] truncate">{selectedFile.path}</span>

            <button
              id="btn-copy-code-file"
              onClick={handleCopy}
              className="px-2.5 py-1 bg-[#334155] hover:bg-[#475569] text-[#E2E8F0] rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed select-text">
            <pre className="text-[#E2E8F0] whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
