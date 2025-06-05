import {Table, TBody, Td, Th, THead} from "../common/Table";
import {Header} from "../layout/Header/Header";
import {useCallback, useEffect, useState} from "react";
import {getAllUsers, getUsersBySearchTerm, updateUser} from "../../services/UserService";
import {UserIF} from "../../types/User";
import {Loading, LoadingIcon} from "../common/Loading";
import {Button} from "../common/Button";
import {Role} from "../../types/SignUpIF";
import {TextField} from "../common/Input";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Alert} from "../common/Alert";
import {debounceWithCancel} from "../../utils/debounce";

export const UserTable = () => {

    const [userTableData, setUserTableData] = useState<UserIF[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<UserIF[]>([]);
    const [isSavingId, setIsSavingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<UserIF | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (user: UserIF) => {
        setEditedUser(user);
    };

    const handleSave = async () => {
        if (editedUser) {
            setIsSavingId(editedUser.id);
            try {
                const response = await updateUser(editedUser);
                setUserTableData(prev => prev?.map(user => user.id === response.id ? response : user));
                setEditedUser(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : "An error occurred while saving the user.");
            } finally {
                setIsSavingId(null);
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await getAllUsers();
                setUserTableData(response);
            } catch (e) {
                setError(e instanceof Error ? e.message : "An error occurred while loading users.");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const performSearchAPI = useCallback(async (currentSearchTerm: string) => {
        if (!currentSearchTerm.trim()) {
            setSearchResults([]);
            setError(null);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const results = await getUsersBySearchTerm(currentSearchTerm);
            setSearchResults(results);
        } catch (e) {
            console.error("Error searching items:", e);
            setError(e instanceof Error ? `${e.message}` : "An error occurred while searching.");
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

    const requestsToDisplay = searchTerm.trim() ? searchResults : userTableData;

    return (
        <>
            <Alert message={error} visibility={!!error} type={"error"} onClose={() => setError(null)}/>
            <Header>
                <div className="flex w-full gap-2 items-center">
                    <div className={"text-nowrap text-lg"}>Users Management</div>
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
                </div>
            </Header>

            {isLoading ? (
                <Loading loading={true}/>
            ) : (
                <Table>
                    <THead>
                        <tr>
                            <Th className={'hidden lg:table-cell'}>ID</Th>
                            <Th className={'whitespace-nowrap'}>Name</Th>
                            <Th className={'hidden md:table-cell'}>Email</Th>
                            <Th className={'w-16 sm:w-20 md:w-24'}>Role</Th>
                            <Th className={'hidden lg:table-cell w-24'}>Joined Date</Th>
                            <Th className={'w-12'}></Th>
                        </tr>
                    </THead>
                    <TBody>
                        {requestsToDisplay?.map((user) => (
                            <tr key={user.id}>
                                {isSavingId !== user.id ? (
                                    <>
                                        <Td className={'hidden lg:table-cell font-mono text-xs'}>{user.id}</Td>
                                        <Td className={'text-gray-700 whitespace-nowrap'}>
                                            <dl>
                                                <dd className={'text-[14px] font-bold'}>
                                                    {(editedUser?.id === user.id) ? (
                                                        <TextField
                                                            type="text"
                                                            value={editedUser.name}
                                                            required={true}
                                                            variant={"sm"}
                                                            pattern=".{6,}"
                                                            invalidMessage={'Name must be at least 6 characters long.'}
                                                            onChange={(e) => setEditedUser(prev => ({
                                                                ...prev!,
                                                                name: e.target.value
                                                            }))}
                                                            className="border rounded px-1 py-1 w-36 sm:w-52"
                                                        />
                                                    ) : user.name}
                                                </dd>
                                                <dd className={'lg:hidden text-gray-500 text-xs text-ellipsis font-mono overflow-x-hidden'}>
                                                    {user.id}
                                                </dd>
                                                <dd className={'md:hidden'}>
                                                    {(editedUser?.id === user.id) ? (
                                                        <TextField
                                                            type="email"
                                                            value={editedUser.email}
                                                            variant={'sm'}
                                                            invalidMessage={'Invalid email address.'}
                                                            onChange={(e) => setEditedUser(prev => ({
                                                                ...prev!,
                                                                email: e.target.value
                                                            }))}
                                                            className="border rounded px-1 sm:py-1"
                                                        />
                                                    ) : user.email}
                                                </dd>
                                            </dl>
                                        </Td>
                                        <Td className={'hidden md:table-cell'}>
                                            {(editedUser?.id === user.id) ? (
                                                <TextField
                                                    type="email"
                                                    value={editedUser.email}
                                                    required={true}
                                                    invalidMessage={'Invalid email address.'}
                                                    variant={'sm'}
                                                    onChange={(e) => setEditedUser(prev => ({
                                                        ...prev!,
                                                        email: e.target.value
                                                    }))}
                                                    className="border rounded px-1 py-1 sm:w-56"
                                                />
                                            ) : user.email}
                                        </Td>
                                        <Td className={'text-[12px] font-bold'}>
                                            {editedUser?.id === user.id ? (
                                                <select
                                                    name="role"
                                                    value={editedUser.role}
                                                    onChange={(e) => setEditedUser({
                                                        ...editedUser,
                                                        [e.target.name]: e.target.value
                                                    })}
                                                    className="border rounded md:px-1 sm:py-1 w-14 sm:w-16 md:w-20"
                                                >
                                                    <option value={Role.ADMIN}>ADMIN</option>
                                                    <option value={Role.STAFF}>STAFF</option>
                                                    <option value={Role.USER}>USER</option>
                                                </select>
                                            ) : user.role}
                                        </Td>
                                        <Td className={'hidden lg:table-cell'}>
                                            {user.createAt}
                                        </Td>
                                        <Td>
                                            {(editedUser?.id === user.id) ? (
                                                <Button onClick={handleSave}
                                                        className={'text-primary text-md'}>Save</Button>
                                            ) : (
                                                <Button onClick={() => handleEdit(user)}
                                                        className={'text-primary text-md'}>Edit</Button>
                                            )}
                                        </Td>
                                    </>
                                ) : (
                                    <>
                                        <td colSpan={6} className="hidden lg:table-cell px-3 py-3">
                                            <LoadingIcon size={'sm'} className={'w-full'}/>
                                        </td>

                                        <td colSpan={5}
                                            className="hidden md:table-cell lg:hidden px-3 py-3">
                                            <LoadingIcon size={'sm'} className={'w-full'}/>
                                        </td>

                                        <td colSpan={3} className="md:hidden px-3 py-3">
                                            <LoadingIcon size={'sm'} className={'w-full'}/>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {requestsToDisplay.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                                    No Users found.
                                </td>
                            </tr>
                        )}
                    </TBody>
                </Table>
            )}
        </>
    )
}