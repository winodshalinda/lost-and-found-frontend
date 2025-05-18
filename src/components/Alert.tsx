interface AlertProps {
    title?: string | null;
    message: string | null;
    visibility: boolean;
    type: 'success' | 'error';
    onClose?: () => void;
}

export const Alert = ({title, message, visibility = false, type, onClose}: AlertProps) => {
    switch (type) {
        case 'success':
            return (
                <div hidden={!visibility} role="alert" className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            {title && <strong className="font-medium text-green-900"> {title} </strong>}
                            <p className="mt-0.5 text-sm text-green-700">{message}</p>
                        </div>

                        <button
                            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            type="button"
                            aria-label="Dismiss alert"
                            onClick={onClose}
                        >
                            <span className="sr-only">Dismiss popup</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            );

        case 'error':
            return (
                <div hidden={!visibility} role="alert" className="w-full rounded-md border border-gray-300 bg-red-100 px-4 py-1.5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            {title && <strong className="font-medium text-red-900"> {title} </strong>}
                            <p className="mt-0.5 text-sm text-red-700">{message}</p>
                        </div>

                        <button
                            className="rounded-full text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            type="button"
                            aria-label="Dismiss alert"
                            onClick={onClose}
                        >
                            <span className="sr-only">Dismiss popup</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            );
    }

}