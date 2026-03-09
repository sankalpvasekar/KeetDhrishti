import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Bug, RefreshCw, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { predictInsect } from './api';

export default function App() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const fileInputRef = useRef(null);

  const handleAnalysis = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    setShowResult(false);

    try {
      const apiResult = await predictInsect(file);
      setResult(apiResult);
      setIsAnalyzing(false);
      navigate('/result', { state: { result: apiResult } });
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
      alert("Failed to analyze image. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      handleAnalysis(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      handleAnalysis(file);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setResult(null);
    setShowResult(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative font-sans bg-emerald-50 overflow-hidden">

      {/* 1. NAVIGATION BAR (ABOVE THE IMAGE) */}
      <header className="w-full bg-emerald-50 px-6 py-6 flex items-center justify-center z-30">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-2.5 rounded-full flex items-center justify-center shadow-sm">
            <Bug size={38} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-orange-500">
            KeetDrishti
          </h1>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA (IMAGE FULL FIT) */}
      <main className="flex-1 w-full relative overflow-hidden bg-emerald-50 flex items-center justify-center">

        {/* Full Image Container - Calculated to fit below header */}
        <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">

          {/* Nature Illustration - Aspect Ratio Protected, filling available space */}
          <img
            src="/bg/landing_page_background.png"
            alt="Nature illustration"
            className="w-full h-auto max-h-full object-contain pointer-events-none"
          />

          {/* 3. CENTERED FORM (TRANSPARENT FORM WITH SEMI-GREEN BORDER) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">

            <div className="relative flex flex-col items-center mb-10 translate-x-10 translate-y-10">
              {/* Semi-transparent form container */}
              <div
                className={`w-full max-w-[340px] sm:w-[380px] rounded-[2.5rem] border-4 border-dashed border-emerald-400 p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md`}
                style={{
                  minHeight: '240px',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)', // highly transparent
                }}
                onClick={() => !isAnalyzing && fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!imagePreview ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full mb-5 flex items-center justify-center text-emerald-600">
                      <Upload size={36} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Click or drag image here</h3>
                    <p className="text-sm font-bold text-emerald-900">Supports JPG, PNG, WEBP</p>
                  </>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Uploaded bug"
                      className="max-w-full max-h-[160px] object-contain rounded-2xl shadow-xl mb-2"
                      style={{ opacity: isAnalyzing ? 0.3 : 1 }}
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <Loader2 size={32} className="text-emerald-500 animate-spin mb-2" />
                        <span className="text-emerald-700 font-black text-xs uppercase tracking-widest animate-pulse">Analyzing...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION BUTTON: solid emerald green, overlapping bottom edge */}
              <div className="absolute -bottom-7">
                {!imagePreview ? (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
                  >
                    <ImageIcon size={24} className="group-hover:rotate-12 transition-transform" />
                    Select Photo
                  </button>
                ) : (
                  <button
                    onClick={resetForm}
                    disabled={isAnalyzing}
                    className="px-8 py-3 bg-emerald-600 text-white text-base font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw size={20} className={isAnalyzing ? 'animate-spin' : ''} />
                    Try Another
                  </button>
                )}
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
