import { Phone, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { formatCurrency, ProjectStatus } from '@/lib/civic-engine';

interface ProjectCardProps {
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
}

export function ProjectCard({
    title,
    marathiTitle,
    cost,
    status,
    wardInfo,
    isCentralFund = true, // Defaulting to true for demo as per prompt emphasis
    citizenPhotosCount = 0
}: ProjectCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{marathiTitle}</p>
                    </div>
                    {isCentralFund && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                            MP Oversight
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-slate-900">
                        {formatCurrency(cost)}
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${status.isDelayed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {status.isDelayed ? <AlertTriangle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                        {status.statusLabel}
                    </div>
                </div>

                {/* Status Bar Mockup */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{status.isDelayed ? 'Delayed' : 'On Track'}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${status.isDelayed ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: status.isDelayed ? '40%' : '75%' }}
                        ></div>
                    </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-200 flex items-center justify-between px-4 py-3">
                    {/* Citizen Photos Stats */}
                    <div className="flex items-center space-x-2 text-slate-600">
                        <Camera className="w-5 h-5" />
                        <span className="text-sm font-medium">{citizenPhotosCount} Citizen Reports</span>
                    </div>
                </div>
            </div>

            {wardInfo && (
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Nagarsevak (Ward {wardInfo.ward_no})</p>
                        <p className="font-medium text-slate-900">{wardInfo.nagarsevak_name}</p>
                    </div>
                    <a href={`tel:${wardInfo.mobile}`} className="flex items-center space-x-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                    </a>
                </div>
            )}
        </div>
    );
}
