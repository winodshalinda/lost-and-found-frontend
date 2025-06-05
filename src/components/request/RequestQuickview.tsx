import {RequestIF, RequestStatus} from "../../types/RequestIF";
import {useEffect, useState} from "react";
import {getItemById} from "../../services/ItemService";
import {ItemIF} from "../../types/ItemIF";
import {updateRequest} from "../../services/RequestService";
import {AlertModal, AlertModalBody, AlertModalTitle} from "../common/Modal";
import {CloseButton} from "@headlessui/react";
import {Loading} from "../common/Loading";
import {useAuth} from "../../features/auth";
import {Role} from "../../types/SignUpIF";

const BaseUrl = "http://localhost:4444/laf";

interface RequestQuickViewProps {
    request: RequestIF;
    onClose: () => void;
    onApprove?: (requestId: string) => void;
    onReject?: (requestId: string) => void;
    onEdit: (updateRequest: RequestIF) => void;
}

interface Error {
    isOpen: boolean;
    title: string;
    message: string;
}

export const RequestQuickView = ({request, onClose, onApprove, onReject, onEdit}: RequestQuickViewProps) => {
    const [receivedRequest, setReceivedRequest] = useState<RequestIF>({
        item: '',
        requestMessage: ''
    });

    const [item, setItem] = useState<ItemIF | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<Error>({
        isOpen: false,
        title: '',
        message: ''
    });

    const {userRole} = useAuth();

    useEffect(() => {
        setReceivedRequest(request);
        const getSelectedRequestItem = async () => {
            setIsLoading(true);
            try {
                const fetchItem: ItemIF = await getItemById(request.item);
                setItem(fetchItem);
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false);
            }
        }
        getSelectedRequestItem();
    }, [request]);

    const handleOnEditSave = async () => {
        setIsLoading(true);
        try {
            const updatedRequest = await updateRequest(receivedRequest);
            if (onEdit) {
                onEdit(updatedRequest);
            }
            setIsEditing(false);
        } catch (e) {
            setError({
                isOpen: true,
                title: 'Error',
                message: e instanceof Error ? e.message : 'Something went wrong'
            })
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative z-20" role="dialog" aria-modal="true">

            <Loading loading={isLoading} fullScreen={true}/>

            <AlertModal isOpen={error.isOpen} close={() => setError({...error, isOpen: false})}>
                <AlertModalTitle>{error.title}</AlertModalTitle>
                <AlertModalBody>{error.message}</AlertModalBody>
                <div className={'mt-4'}>
                    <CloseButton
                        className={'px-2 py-1 rounded-md bg-white text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto'}
                        onClick={() => setError({...error, isOpen: false})}
                    >
                        Close
                    </CloseButton>
                </div>
            </AlertModal>

            <div className="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" aria-hidden="true"></div>
            <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                <div
                    className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                    <div
                        className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                        <div
                            className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                            <button
                                onClick={onClose}
                                type="button"
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-2 sm:right-2">
                                <span className="sr-only">Close</span>
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                                </svg>
                            </button>

                            <div
                                className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">

                                <img
                                    src={`${BaseUrl}${item?.itemImageUrl}`}
                                    alt={`${request.requestId}${item?.itemName}`}
                                    className="aspect-2/3 w-full rounded-lg bg-gray-300 object-center object-contain h-full sm:col-span-4 lg:col-span-5"/>

                                <div className="sm:col-span-8 lg:col-span-7">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm sm:text-base text-ellipsis overflow-x-hidden text-nowrap font-bold font-mono text-gray-900">{request.requestId}</h2>
                                        {(isEditing && request.requestStatus === RequestStatus.REJECTED && userRole !== Role.USER) ? (
                                            <select
                                                name="requestStatus"
                                                value={receivedRequest.requestStatus}
                                                onChange={(e) => setReceivedRequest({
                                                    ...receivedRequest,
                                                    [e.target.name]: e.target.value!
                                                })}
                                                className="ml-2 rounded-md px-2 py-1 text-xs font-medium border"
                                            >

                                                <option value={RequestStatus.PENDING}>PENDING</option>
                                                {request.requestStatus === RequestStatus.REJECTED && (
                                                    <option value={RequestStatus.REJECTED}>REJECTED</option>
                                                )}

                                            </select>
                                        ) : (
                                            <span className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                                ${request.requestStatus === 'APPROVED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                request.requestStatus === 'REJECTED' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                    'bg-yellow-50 text-yellow-700 ring-yellow-600/20'}`}>
                                                {request.requestStatus}
                                            </span>
                                        )}
                                    </div>

                                    <section aria-labelledby="information-heading" className="mt-2">
                                        <h3 id="information-heading" className="sr-only">Request information</h3>
                                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 w-full">

                                            <h4 className={'col-span-1 sm:col-span-1 text-gray-900 text-xs'}>
                                                Requested User Id :
                                            </h4>
                                            <h5 className={'col-span-3 sm:col-span-2 font-mono text-gray-700 text-xs mb-2 ml-6 sm:ml-0'}>
                                                {request.user}
                                            </h5>

                                            <h4 className={'col-span-1 sm:col-span-1 text-gray-900 text-xs'}>
                                                Requested Item Id :
                                            </h4>
                                            <h5 className={'col-span-3 sm:col-span-2 font-mono text-gray-700 text-xs mb-2 ml-6 sm:ml-0'}>
                                                {request.item}
                                            </h5>

                                            <h4 className={'col-span-1 sm:col-span-1 text-gray-900 text-xs'}>
                                                Requested Item Name :
                                            </h4>
                                            <h5 className={'col-span-3 sm:col-span-2 font-mono text-gray-700 text-xs mb-2 ml-6 sm:ml-0'}>
                                                {item?.itemName}
                                            </h5>

                                            <h4 className={'col-span-1 sm:col-span-1 text-gray-900 text-xs'}>
                                                Request Message :
                                            </h4>
                                            {(isEditing && userRole === Role.USER) ? (
                                                <textarea
                                                    name="requestMessage"
                                                    rows={3}
                                                    value={receivedRequest.requestMessage}
                                                    onChange={(e) => setReceivedRequest({
                                                        ...receivedRequest,
                                                        [e.target.name]: e.target.value!
                                                    })}
                                                    className={'col-span-3 sm:col-span-2 font-mono text-gray-700 text-xs mb-2 ml-6 sm:ml-0 border rounded-md p-2'}
                                                />
                                            ) : (
                                                <p className={'col-span-3 sm:col-span-2 font-mono text-gray-700 text-xs mb-2 ml-6 sm:ml-0'}>
                                                    {request.requestMessage}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    <section aria-labelledby="options-heading" className="mt-6">
                                        <h3 id="options-heading" className="sr-only">Request details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="text-xs text-gray-900">Request Date</h4>
                                                <p className="text-xs text-gray-700">{request.requestDate} {request.requestTime}</p>
                                            </div>
                                            {request.reviewDate && (
                                                <div>
                                                    <h4 className="text-xs text-gray-900">Review Date</h4>
                                                    <p className="text-xs text-gray-700">{request.reviewDate} {request.reviewTime}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            {item?.itemDescription && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs text-gray-900">Item Description</h4>
                                                    <p className="text-xs text-gray-700">{item.itemDescription}</p>
                                                </div>
                                            )}
                                            {item?.location && (
                                                <div>
                                                    <h4 className="text-xs text-gray-900">Location</h4>
                                                    <p className="text-xs text-gray-700">{item.location}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                    <section className="mt-6 flex gap-2">
                                        {(request.requestStatus !== 'APPROVED' && userRole !== Role.USER) && (
                                            <button
                                                onClick={() => onApprove && onApprove(request.requestId!)}
                                                className="flex-1 bg-secondary text-white px-4 py-2 text-sm font-semibold rounded-md hover:opacity-90"
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {(request.requestStatus !== 'REJECTED' && userRole !== Role.USER) && (
                                            <button
                                                onClick={() => onReject && onReject(request.requestId!)}
                                                className="flex-1 bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {((request.requestStatus === RequestStatus.PENDING && userRole === Role.USER) || (userRole !== Role.USER && request.requestStatus === RequestStatus.REJECTED)) && (
                                            <button
                                                onClick={() => {
                                                    if (isEditing) {
                                                        handleOnEditSave();
                                                    } else {
                                                        setIsEditing(true);
                                                    }
                                                }}
                                                className="flex-1 bg-white text-gray-700 px-4 py-2 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-50"
                                            >
                                                {isEditing ? 'Save' : 'Edit'}
                                            </button>
                                        )}
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}