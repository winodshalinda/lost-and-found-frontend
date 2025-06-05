import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {ItemIF, ItemStatus} from "../../types/ItemIF";
import {useAuth} from "../../features/auth";
import {Role} from "../../types/SignUpIF";
import {useNavigate} from "react-router-dom";
import {deleteItem} from "../../services/ItemService";
import {useState} from "react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import {Loading} from "../common/Loading";
import {TextArea} from "../common/Input";
import {requestItem} from "../../services/RequestService";

const BaseURL = 'http://localhost:4444/laf';

interface ItemModalProps {
    item: ItemIF;
    onClose: () => void;
    onDelete: () => void;
    isOpen: boolean;
}

export const ItemModal = ({isOpen, item, onClose, onDelete}: ItemModalProps) => {
    const {userId, userRole} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRequest, setIsRequest] = useState<boolean>(false);
    const [requestMessage, setRequestMessage] = useState<string>("");

    const handleOnRequest = async () => {
        setIsLoading(true)
        try {
            await requestItem({
                item: item.itemId!,
                requestMessage: requestMessage
            });
            setIsRequest(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An error occurred while deleting the item.");
        } finally {
            setIsLoading(false)
        }
    }

    const handleOnEdit = () => {
        navigate(`/items/edit-item/${item?.itemId}`);
        sessionStorage.setItem(`${item.itemId}`, JSON.stringify(item));
    }

    const handleOnDelete = async () => {
        setIsLoading(true);
        try {
            await deleteItem(item);
            setIsLoading(false);
            onDelete();
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "An error occurred while deleting the item.");
            setIsLoading(false);
        }
    }

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} className="relative z-20">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-700/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />
                <div className="fixed inset-0 z-20 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:opacity-0 data-closed:scale-95 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        >
                            {item &&
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex w-full">
                                        <div className="mt-3 sm:mt-0 sm:ml-4 w-full">
                                            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                {item.itemName}
                                            </DialogTitle>
                                            <div className="flex justify-center items-center mt-2">
                                                <img src={`${BaseURL}${item.itemImageUrl}`} alt={item.itemName}
                                                     className="h-auto w-auto max-h-96 max-w-full justify-center"
                                                />
                                            </div>

                                            <div className={'mt-4 gap-y-4'}>
                                                <label className="text-sm/6 font-medium text-gray-900 block">Item
                                                    Id:</label>
                                                <label
                                                    className="text-sm/6 text-gray-900 ml-10 mb-2 block">{item.itemId}</label>

                                                <label
                                                    className="text-sm/6 font-medium text-gray-900 block">Location:</label>
                                                <label
                                                    className="text-sm/6 text-gray-900 ml-10 mb-2 block">{item.location}</label>

                                                <label
                                                    className="text-sm/6 font-medium text-gray-900 block">Status:</label>
                                                <label
                                                    className="text-sm/6 text-gray-900 ml-10 mb-2 block">{item.itemStatus}</label>

                                                <label
                                                    className="text-sm/6 font-medium text-gray-900 block">Description:</label>
                                                <label
                                                    className="text-sm/6 text-gray-900 mb-2 ml-10 block">{item.itemDescription}</label>
                                                {(userRole === Role.STAFF || userRole === Role.ADMIN) && (
                                                    <div>
                                                        <label className="text-sm/6 font-medium text-gray-900 block">Found
                                                            Date:</label>
                                                        <label
                                                            className="text-sm/6 text-gray-900 mb-2 ml-10 block">{item.foundOrLostDate}</label>

                                                        <label className="text-sm/6 font-medium text-gray-900 block">Created
                                                            Date:</label>
                                                        <label
                                                            className="text-sm/6 text-gray-900 mb-2 ml-10 block">{item.createAtDate}</label>

                                                        <label className="text-sm/6 font-medium text-gray-900 block">Created
                                                            Time:</label>
                                                        <label
                                                            className="text-sm/6 text-gray-900 mb-2 ml-10 block">{item.createAtTime}</label>

                                                        {item.claimedBy && (
                                                            <>
                                                                <label
                                                                    className="text-sm/6 font-medium text-gray-900 block">Created
                                                                    Time:</label>
                                                                <label
                                                                    className="text-sm/6 text-gray-900 ml-10 block">{item.createAtTime}</label>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                {item.itemStatus === ItemStatus.FOUND && (
                                    <button
                                        type="button"
                                        onClick={() => setIsRequest(true)}
                                        className="inline-flex w-full mb-2 sm:mb-0 justify-center rounded-md bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary sm:ml-3 sm:w-auto"
                                    >
                                        Request Item
                                    </button>
                                )}
                                {(userId === item.user || userRole === Role.ADMIN || (item.itemStatus !== ItemStatus.LOST && userRole === Role.STAFF)) && (
                                    <>
                                        <button
                                            type={'button'}
                                            onClick={handleOnEdit}
                                            className={'inline-flex w-full mb-2 sm:mb-0 justify-center rounded-md bg-secondary-dark px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-secondary sm:ml-3 sm:w-auto'}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type={'button'}
                                            onClick={handleOnDelete}
                                            className={'inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto'}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    data-autofocus=""
                                    onClick={onClose}
                                    className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Loading loading={isLoading} fullScreen={true}/>

            <Dialog open={!!error} onClose={() => {
                setError(null)
            }} className="relative z-20">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                            Error
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => setError(null)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Ok
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={isRequest} as="div" className="relative z-20 focus:outline-none"
                    onClose={() => setIsRequest(false)}>
                <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-primary-dark p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 mb-2 font-medium text-white">
                                Request Message
                            </DialogTitle>
                            <TextArea rows={4} onChange={(e) => setRequestMessage(e.target.value)}/>
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={handleOnRequest}
                                >
                                    Request
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
        ;
}