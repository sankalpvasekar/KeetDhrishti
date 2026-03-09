import React from 'react';
import { Leaf, RotateCcw, Microscope, Bug, Home, BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result || {};

    const handleNewAnalysis = () => {
        navigate('/');
    };

    // Helper to extract data from the backend's "details" string
    const parseDetails = (details) => {
        if (!details) return {};

        const lines = details.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const parsed = {};

        // More robust parsing - handle blocks of text after the title
        let currentSection = null;

        lines.forEach(line => {
            if (line.includes('1. Scientific name:')) {
                currentSection = 'scientificName';
                const parts = line.split('1. Scientific name:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (line.includes('2. Family:')) {
                currentSection = 'family';
                const parts = line.split('2. Family:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (line.includes('3. Physical description:')) {
                currentSection = 'description';
                const parts = line.split('3. Physical description:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (line.includes('4. Habitat and food:')) {
                currentSection = 'habitat';
                const parts = line.split('4. Habitat and food:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (line.includes('5. Harmful or beneficial:')) {
                currentSection = 'harmfulBeneficial';
                const parts = line.split('5. Harmful or beneficial:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (line.includes('6. Management or control measures:')) {
                currentSection = 'management';
                const parts = line.split('6. Management or control measures:');
                parsed[currentSection] = parts.length > 1 ? parts[1].trim() : "";
            } else if (currentSection && !line.match(/^\d\./)) {
                // If the line is continuing the current section and doesn't start with a number
                parsed[currentSection] = (parsed[currentSection] ? parsed[currentSection] + " " : "") + line;
            }
        });

        return parsed;
    };

    const parsedDetails = parseDetails(result.details);

    return (
        <div
            className="min-h-screen w-full flex flex-col relative font-sans overflow-x-hidden"
            style={{
                backgroundImage: `url('/bg/result_bg.jpg.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* OVERLAY FOR BETTER READABILITY */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>

            {/* TOP NAVIGATION BAR (SYNCED WITH LANDING PAGE) */}
            <header className="w-full bg-emerald-50/90 backdrop-blur-md px-6 py-6 flex items-center justify-center z-30 shadow-md">
                <div
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleNewAnalysis}
                >
                    <div className="bg-red-100 p-2.5 rounded-full flex items-center justify-center shadow-sm">
                        <Bug size={38} className="text-red-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-orange-500">
                        KeetDrishti
                    </h1>
                </div>
            </header>

            {/* RESULT DISPLAY SECTION */}
            <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 my-8">
                <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/20">

                    {/* Header section with gradient background */}
                    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Microscope size={120} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-emerald-50 font-bold tracking-widest uppercase text-sm mb-2 drop-shadow-sm">
                                Prediction Result Card
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">
                                🐛 {result.insect_name || "Unknown Species"}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                                {result.confidence && (
                                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                        Confidence: {result.confidence}%
                                    </div>
                                )}
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full font-bold text-sm italic">
                                    {parsedDetails.scientificName || "Species Identified"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        <h3 className="text-2xl font-black text-gray-800 mb-8 border-b-2 border-emerald-500 pb-2 inline-block">
                            📋 Detailed Insect Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Scientific Name - Blue */}
                            <div className="group bg-blue-50/50 hover:bg-blue-50 transition-all rounded-3xl p-5 border border-blue-100/50 hover:border-blue-300 shadow-sm hover:shadow-md">
                                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-blue-600">
                                    <BookOpen size={20} /> Scientific name
                                </h3>
                                <p className="text-blue-900 font-bold italic text-lg leading-tight">
                                    {parsedDetails.scientificName || "Information not available"}
                                </p>
                            </div>

                            {/* Family - Purple */}
                            <div className="group bg-purple-50/50 hover:bg-purple-50 transition-all rounded-3xl p-5 border border-purple-100/50 hover:border-purple-300 shadow-sm hover:shadow-md">
                                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-purple-600">
                                    <ShieldCheck size={20} /> Family
                                </h3>
                                <p className="text-purple-900 font-bold text-lg leading-tight">
                                    {parsedDetails.family || "Information not available"}
                                </p>
                            </div>

                            {/* Description - Teal */}
                            <div className="md:col-span-2 group bg-teal-50/50 hover:bg-teal-50 transition-all rounded-3xl p-5 border border-teal-100/50 hover:border-teal-300 shadow-sm hover:shadow-md">
                                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-teal-600">
                                    <Microscope size={20} /> Physical description
                                </h3>
                                <p className="text-teal-900 font-medium text-base leading-relaxed">
                                    {parsedDetails.description || "Information not available"}
                                </p>
                            </div>

                            {/* Habitat & Food - Sky Blue */}
                            <div className="group bg-sky-50/50 hover:bg-sky-50 transition-all rounded-3xl p-5 border border-sky-100/50 hover:border-sky-300 shadow-sm hover:shadow-md">
                                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-sky-600">
                                    <Leaf size={20} /> Habitat and food
                                </h3>
                                <p className="text-sky-900 font-medium text-base leading-relaxed">
                                    {parsedDetails.habitat || "Information not available"}
                                </p>
                            </div>

                            {/* Harm/Benefit - Red/Green Mixed */}
                            <div className={`group transition-all rounded-3xl p-5 border shadow-sm hover:shadow-md ${parsedDetails.harmfulBeneficial?.toLowerCase().includes('beneficial')
                                ? 'bg-emerald-50/50 border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-300'
                                : 'bg-red-50/50 border-red-100/50 hover:bg-red-50 hover:border-red-300'
                                }`}>
                                <h3 className={`text-lg font-black mb-3 flex items-center gap-2 ${parsedDetails.harmfulBeneficial?.toLowerCase().includes('beneficial') ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                    <AlertTriangle size={20} /> Harmful or beneficial
                                </h3>
                                <p className={`font-bold text-base leading-relaxed ${parsedDetails.harmfulBeneficial?.toLowerCase().includes('beneficial') ? 'text-emerald-900' : 'text-red-900'
                                    }`}>
                                    {parsedDetails.harmfulBeneficial || "Information not available"}
                                </p>
                            </div>

                            {/* Management - Orange */}
                            <div className="md:col-span-2 group bg-orange-50/50 hover:bg-orange-50 transition-all rounded-3xl p-5 border border-orange-100/50 hover:border-orange-300 shadow-sm hover:shadow-md">
                                <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-orange-600">
                                    <ShieldCheck size={20} /> Management or control measures
                                </h3>
                                <p className="text-orange-900 font-medium text-base leading-relaxed">
                                    {parsedDetails.management || "Information not available"}
                                </p>
                            </div>
                        </div>

                        {/* Action Box */}
                        <div className="mt-12 flex flex-col items-center gap-4">
                            <button
                                onClick={handleNewAnalysis}
                                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span className="relative z-10">Analyze Another Insect</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
