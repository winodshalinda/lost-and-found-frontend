import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {ReactNode} from "react";

interface AlertModalProps {
    children?: ReactNode;
    isOpen: boolean;
    close: () => void;
}

export const AlertModal = ({isOpen, close, children}: AlertModalProps) => {
    return (
        <Dialog open={isOpen} as="div" className="relative z-20 focus:outline-none" onClose={close}>
            <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogBackdrop className="fixed inset-0 bg-black/75 backdrop-blur-sm"/>
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/85 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export const AlertModalTitle = ({children}: { children?: ReactNode }) => {
    return (
        <h3 className="text-base font-semibold">{children}</h3>
    );
}

export const AlertModalBody = ({children}: { children?: ReactNode }) => {
    return (
        <p className={"mt-2 text-sm/6 text-black/50"}>
            {children}
        </p>
    )
}