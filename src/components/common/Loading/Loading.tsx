interface LoadingProps {
    loading: boolean;
    color?: string;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Loading = ({loading, color = '#10b981', fullScreen = false, size = 'md'}: LoadingProps) => {
    if (!loading) return null;

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-24 h-24'
    };

    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-700/75"
        : "absolute inset-0 w-full h-full flex items-center justify-center";

    return (
        <div className={containerClasses}>
            <svg
                className={sizeClasses[size]}
                stroke={color}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <style>
                    {`
                        .spinner_V8m1 {
                            transform-origin: center;
                            animation: spinner_zKoa 2s linear infinite;
                        }
                        .spinner_V8m1 circle {
                            stroke-linecap: round;
                            animation: spinner_YpZS 1.5s ease-in-out infinite;
                        }
                        @keyframes spinner_zKoa {
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes spinner_YpZS {
                            0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
                            47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
                            95%, 100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
                        }
                    `}
                </style>
                <g className="spinner_V8m1">
                    <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"/>
                </g>
            </svg>
        </div>
    );
}

interface LoadingIconProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingIcon = ({color = '#10b981', size = 'md', className = ''}: LoadingIconProps) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-24 h-24'
    };

    return (
        <svg
            className={`${sizeClasses[size]} ${className}`}
            stroke={color}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                        .spinner_V8m1 {
                            transform-origin: center;
                            animation: spinner_zKoa 2s linear infinite;
                        }
                        .spinner_V8m1 circle {
                            stroke-linecap: round;
                            animation: spinner_YpZS 1.5s ease-in-out infinite;
                        }
                        @keyframes spinner_zKoa {
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes spinner_YpZS {
                            0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
                            47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
                            95%, 100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
                        }
                    `}
            </style>
            <g className="spinner_V8m1">
                <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"/>
            </g>
        </svg>
    )
}