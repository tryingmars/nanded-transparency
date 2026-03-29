import { Phone, AlertTriangle, CheckCircle, Camera, Share2, Activity, Calendar, Hash } from 'lucide-react';
import { formatCurrency, ProjectStatus } from '@/lib/civic-engine';

interface ProjectCardProps {
    id: string; // Add ID prop
    title: string;
    marathiTitle: string;
    cost: number;
    status: ProjectStatus;
    wardInfo?: {
        ward_no: number;
        nagarsevak_name: string;
        mobile: string;
    };
    isCentralFund?: boolean;
    citizenPhotosCount?: number;
    publishDate?: string; // Add Date prop
}

export function ProjectCard({
    id,
    title,
    marathiTitle,
    cost,
    status,
    wardInfo,
    isCentralFund = true, // Defaulting to true for demo as per prompt emphasis
    citizenPhotosCount = 0,
    publishDate
}: ProjectCardProps) {

    const handleShare = () => {
        const text = `Check out this project: ${title} (${marathiTitle}) - Cost: ${formatCurrency(cost)}. Status: ${status.statusLabel}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group">
            {/* Live Badge */}
            <div className="absolute top-0 right-0 m-4 z-10">
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">
                    <Activity className="w-3 h-3" />
                    LIVE / सुरू आहे
                </span>
            </div>

            <div className="p-5">
                {/* Header: ID + Titles */}
                <div className="flex justify-between items-start mb-1 pr-24">
                    <div>
                        <div className="flex items-center space-x-1 text-xs text-slate-400 dark:text-slate-400 font-mono mb-1">
                            <Hash className="w-3 h-3" />
                            <span>ID: {id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif mt-1">{marathiTitle}</p>
                    </div>
                </div>

                {/* Publish Date if available */}
                {publishDate && (
                    <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>Date / दिनांक: {publishDate}</span>
                    </div>
                )}

                <div className="mt-4 flex items-end justify-between border-b pb-4 border-slate-100 dark:border-slate-700">
                    <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Estimated Budget / अंदाजपत्रक</p>
                        <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 font-mono tracking-tight mt-1">
                            {formatCurrency(cost)}
                        </div>
                    </div>

                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.isDelayed
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                        }`}>
                        {status.isDelayed ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                        {status.statusLabel}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        <span>Progress / प्रगती</span>
                        <span>{status.isDelayed ? 'Delayed / विलंबित' : 'On Track / वेळेवर'}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${status.isDelayed ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: status.isDelayed ? '40%' : '75%' }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex flex-col gap-3">

                {/* Metadata Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Camera className="w-4 h-4" />
                        <span className="text-xs font-medium">{citizenPhotosCount} Reports / फोटो</span>
                    </div>
                    {isCentralFund && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20">
                            MP Oversight
                        </span>
                    )}
                </div>

                {/* Buttons Row */}
                <div className="flex items-center gap-2 mt-1">
                    {wardInfo && (
                        <a href={`tel:${wardInfo.mobile}`} className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-bold transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>Call Nagarsevak</span>
                        </a>
                    )}

                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </button>
                </div>

                {wardInfo && (
                    <div className="text-xs text-center text-slate-400 dark:text-slate-500">
                        Ward {wardInfo.ward_no}: {wardInfo.nagarsevak_name}
                    </div>
                )}

            </div>
        </div>
    );
}
