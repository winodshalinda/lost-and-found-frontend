import {Header} from "../layout/Header/Header";
import {Table, TableButton, TBody, Td, Th, THead} from "../common/Table";
import {useCallback, useEffect, useState} from "react";
import {RequestIF, RequestStatus} from "../../types/RequestIF";
import {Loading} from "../common/Loading";
import {AlertModal, AlertModalBody, AlertModalTitle} from "../common/Modal";
import {Button} from "@headlessui/react";
import {RequestQuickView} from "./RequestQuickview";
import {TextField} from "../common/Input";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {debounceWithCancel} from "../../utils/debounce";
import {useAuth} from "../../features/auth";
import {useNavigate, useParams} from "react-router-dom";
import {Role} from "../../types/SignUpIF";
import {
    approveRequest,
    getAllRequests,
    getRequestBySearchTerm,
    getRequestByUser,
    rejectRequest
} from "../../services/RequestService";

interface Alert {
    isOpen: boolean;
    message: string;
    title: string
}

export const RequestTable = () => {

    const [tableData, setTableData] = useState<RequestIF[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<RequestIF[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<Alert>({isOpen: false, message: '', title: ''});
    const [selectedRequest, setSelectedRequest] = useState<RequestIF>();

    const {userRole, userId} = useAuth();
    const {requestTableState} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsTableLoading(true)
            try {
                if (requestTableState === "all" && (userRole === Role.ADMIN || userRole === Role.STAFF)) {
                    const response = await getAllRequests();
                    setTableData(response);
                } else if (userId !== null && requestTableState === "my-requests") {
                    const response = await getRequestByUser(userId);
                    setTableData(response);
                } else {
                    navigate('/forbidden')
                }
            } catch (e) {
                setAlert({
                    isOpen: true,
                    message: 'We are experiencing some technical issues. Please try again later',
                    title: 'Error'
                })
            } finally {
                setIsTableLoading(false);
            }
        }
        fetchData();
    }, [navigate, requestTableState, userId, userRole]);


    const getStatusBadgeClasses = (status?: RequestStatus) => {
        switch (status) {
            case RequestStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case RequestStatus.APPROVED:
                return 'bg-green-100 text-green-800';
            case RequestStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            default:
                return '';
        }
    };

    const handleOnApprove = async (requestId: string) => {
        setIsLoading(true);
        try {
            await approveRequest(requestId);
            const updatedTableData = await getAllRequests();
            setTableData(updatedTableData);
        } catch (e) {
            setAlert({
                isOpen: true,
                message: e instanceof Error ? `${e.message}` : 'please try again later',
                title: 'Error'
            });

        } finally {
            setIsLoading(false);
            setSelectedRequest(undefined);
        }
    }

    const handleOnReject = async (requestId: string) => {
        setIsLoading(true);
        try {
            await rejectRequest(requestId);
            const updatedTableData = await getAllRequests();
            setTableData(updatedTableData);
        } catch (e) {
            setAlert({
                isOpen: true,
                message: e instanceof Error ? `${e.message}` : 'please try again later',
                title: 'Error'
            })
        } finally {
            setIsLoading(false);
            setSelectedRequest(undefined);
        }
    }

    const handleOnEdit = (uR: RequestIF) => {
        const updatedTableData = tableData!.map((r) =>
            r.requestId === uR.requestId ? uR : r
        );
        setTableData(updatedTableData);
        setSelectedRequest(uR);
    }

    const performSearchAPI = useCallback(async (currentSearchTerm: string) => {
        if (!currentSearchTerm.trim()) {
            setSearchResults([]);
            setAlert({isOpen: false, message: '', title: ''});
            return;
        }
        try {
            setIsLoading(true);
            setAlert({isOpen: false, message: '', title: ''});
            const results = await getRequestBySearchTerm(currentSearchTerm);
            setSearchResults(results);
        } catch (e) {
            console.error("Error searching items:", e);
            setAlert({
                isOpen: true,
                message: e instanceof Error ? `${e.message}` : "An error occurred while searching.",
                title: 'Error'
            });
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const debouncedSearch = useCallback(debounceWithCancel(performSearchAPI, 1000), [performSearchAPI]);

    useEffect(() => {
        if (searchTerm.trim()) {
            debouncedSearch(searchTerm);
        } else {
            setSearchResults([]);
            debouncedSearch.cancel();
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const requestsToDisplay = searchTerm.trim() ? searchResults : tableData;

    return (
        <>
            {selectedRequest && (
                <RequestQuickView
                    request={selectedRequest!}
                    onClose={() => setSelectedRequest(undefined)}
                    onApprove={handleOnApprove}
                    onReject={handleOnReject}
                    onEdit={handleOnEdit}
                />
            )}
            <Loading fullScreen={true} loading={isLoading}/>
            <AlertModal isOpen={alert.isOpen} close={() => setAlert(alert => ({...alert, isOpen: false}))}>
                <AlertModalTitle>{alert.title}</AlertModalTitle>
                <AlertModalBody>{alert.message}</AlertModalBody>
                <div className={'mt-4'}>
                    <Button
                        className={'bg-secondary text-white outline-1 rounded outline-secondary-dark hover:opacity-90 px-2 py-1'}
                        onClick={() => setAlert(alert => ({...alert, isOpen: false}))}
                    >
                        Ok
                    </Button>
                </div>
            </AlertModal>
            <Header>
                <div className="flex w-full gap-2">
                    <div className={"text-nowrap"}>All Requests</div>
                    {(userRole === Role.STAFF || userRole === Role.ADMIN) && (
                        <label htmlFor={'search'} className={'relative flex items-center ml-auto shrink'}>
                            <TextField
                                id={'search'}
                                type={'text'}
                                placeholder={'Search'}
                                value={searchTerm} // Controlled input
                                className={'px-3 py-2 font-normal text-gray-700 tracking-wide'}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MagnifyingGlassIcon className={'absolute right-0 h-5 w-5 mx-2 text-gray-500'}/>
                        </label>
                    )}
                </div>
            </Header>
            {isTableLoading ? (
                <Loading loading={isTableLoading}/>
            ) : (
                <Table>
                    <THead>
                        <tr>
                            <Th className={'w-32 overflow-hidden sm:overflow-visible sm:whitespace-nowrap'}>Request
                                Id</Th>
                            <Th className={'w-72 md:w-1/2 min-w-56 whitespace-nowrap'}>Message</Th>
                            <Th className={'w-32 overflow-hidden whitespace-nowrap'}>Requested Item Id</Th>
                            <Th className={'w-24'}>Status</Th>
                            <Th className={'w-24'}>Action</Th>
                        </tr>
                    </THead>
                    <TBody>
                        {requestsToDisplay?.map((row) => (
                            <tr key={row.requestId}
                                className={'hover:cursor-default hover:bg-gray-50 transition-colors duration-150 ease-in-out'}
                            >
                                <Td className={'font-mono text-xs'}>{row.requestId}</Td>
                                <Td className={"text-gray-700 max-w-full break-words whitespace-normal"}>{row.requestMessage}</Td>
                                <Td className={'font-mono text-xs'}>{row.item}</Td>
                                <Td className={'whitespace-nowrap'}>
                                    <span
                                        className={`px-2 inline-flex text-xs text-center leading-5 font-semibold rounded-full ${getStatusBadgeClasses(row.requestStatus)}`}>
                                        {row.requestStatus}
                                    </span>
                                </Td>
                                <Td>
                                    <div className={'flex flex-col sm:flex-none items-center gap-2'}>
                                        {(row.requestStatus !== RequestStatus.APPROVED && (userRole === Role.ADMIN || userRole === Role.STAFF)) && (
                                            <TableButton
                                                className={'bg-secondary text-white outline-1 rounded outline-secondary-dark hover:opacity-90'}
                                                onClick={() => handleOnApprove(row.requestId!)}
                                            >
                                                Approve
                                            </TableButton>
                                        )}
                                        {(row.requestStatus !== RequestStatus.REJECTED && (userRole === Role.ADMIN || userRole === Role.STAFF)) && (
                                            <TableButton
                                                className={'bg-red-500 text-white outline-1 rounded outline-red-700 hover:bg-red-600'}
                                                onClick={() => handleOnReject(row.requestId!)}
                                            >
                                                Reject
                                            </TableButton>
                                        )}
                                        <TableButton
                                            className={'bg-white text-gray-700 outline-1 rounded outline-gray-300 hover:bg-gray-50'}
                                            onClick={() => setSelectedRequest(row)}
                                        >
                                            Details
                                        </TableButton>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {requestsToDisplay.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-10 text-center text-sm text-gray-500">
                                    No requests found.
                                </td>
                            </tr>
                        )}
                    </TBody>
                </Table>
            )}
        </>
    )
}