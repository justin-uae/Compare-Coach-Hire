import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export function PartnerButton() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-24 left-6 z-50 group">
            <button
                onClick={() => navigate('/partner')}
                className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
                aria-label="Become a transport partner"
            >
                <Building2 className="w-6 h-6" />

                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-blue-400 opacity-60 animate-ping"></span>
            </button>

            {/* Tooltip on hover */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                <span className="font-bold">List your company</span>
                <span className="block text-gray-400 text-xs font-medium">Join as a transport partner</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
            </div>
        </div>
    );
}