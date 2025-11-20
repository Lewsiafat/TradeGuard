import React, { ReactNode } from 'react';

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max max-w-lg">
                <div className="bg-gray-900 text-white text-sm rounded-lg py-3 px-4 whitespace-pre-wrap border border-gray-700 shadow-2xl">
                    {content}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>
        </div>
    );
};
