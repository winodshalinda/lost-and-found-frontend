import {useCallback, useEffect, useState} from "react";
import {getAllItems, getItemByStatus, getItemByUser, getItemsBySearch} from "../../services/ItemService";
import {ItemIF, ItemStatus} from "../../types/ItemIF";
import {Header} from "../layout/Header/Header";
import {Button} from "../common/Button";
import {ItemCard} from "./ICard";
import {useNavigate, useParams} from "react-router-dom";
import {ItemModal} from "./ItemModal";
import {Loading} from "../common/Loading";
import {Alert} from "../common/Alert";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {TextField} from "../common/Input";
import {debounceWithCancel} from "../../utils/debounce";
import {useAuth} from "../../features/auth";

export const ItemContainer = () => {

    const navigate = useNavigate();
    const {userId} = useAuth();
    const {itemTableState} = useParams();

    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ItemIF[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ItemIF[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<ItemIF>({
        itemId: '',
        itemName: '',
        location: '',
        foundOrLostDate: '',
        itemDescription: '',
        itemStatus: ItemStatus.LOST,
        itemImageUrl: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                let res: ItemIF[];
                switch (itemTableState) {
                    case 'all':
                        res = await getAllItems();
                        break;
                    case 'lost':
                        res = await getItemByStatus(ItemStatus.LOST);
                        break;
                    case 'found':
                        res = await getItemByStatus(ItemStatus.FOUND);
                        break;
                    case 'claimed':
                        res = await getItemByStatus(ItemStatus.CLAIMED);
                        break;
                    case 'user':
                        res = await getItemByUser(userId!);
                        break;
                    default:
                        res = [];
                        break;
                }
                setItems(res);
                setSearchResults([]);
            } catch (e) {
                console.error("Error loading items:", e);
                setError(e instanceof Error ? e.message : "Cannot load items. An unknown error occurred.");
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [itemTableState, userId]);

    const handleOnAddItem = () => {
        navigate('/items/add-items/')
    }

    const onDelete = () => {
        setItems(prevItems => prevItems.filter(item => item.itemId !== selectedItem.itemId));
        setSearchResults(prevResults => prevResults.filter(item => item.itemId !== selectedItem.itemId));
        setOpenModal(false);
    }

    const performSearch = useCallback(async (currentSearchTerm: string) => {
        if (!currentSearchTerm.trim()) {
            setSearchResults([]);
            setError(null);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const results = await getItemsBySearch(currentSearchTerm);
            setSearchResults(results);
        } catch (e) {
            console.error("Error searching items:", e);
            setError(e instanceof Error ? e.message : "An error occurred while searching.");
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const debouncedSearch = useCallback(
        debounceWithCancel<(currentSearchTerm: string) => Promise<void>>(performSearch, 1000),
        [performSearch]
    );

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

    const itemsToDisplay = searchTerm.trim() ? searchResults : items;

    return (
        <div className={"bg-white"}>
            <Header>
                <div className="flex flex-col items-center justify-center gap-y-2 sm:flex-row">
                    <h1>Items</h1>
                    <div className={'inline-flex gap-x-10 items-center sm:ml-auto'}>
                        <label htmlFor={'search'} className={'flex relative items-center shrink-0'}>
                            <TextField
                                id={'search'}
                                type={'text'}
                                placeholder={'Search'}
                                value={searchTerm}
                                className={'px-3 py-2 font-normal text-gray-700 tracking-wide'}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MagnifyingGlassIcon className={'absolute right-0 h-5 w-5 mx-2 text-gray-500'}/>
                        </label>
                        <Button
                            className="text-xs grow-0 shrink-0 font-medium px-2 py-2 border-1 rounded-md bg-secondary-dark text-white"
                            onClick={handleOnAddItem}
                        >
                            Add Items
                        </Button>
                    </div>
                </div>
            </Header>
            <div className={"mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"}>
                {isLoading && <Loading loading={isLoading}/>}
                {!isLoading && error && (
                    <Alert message={error} visibility={!!error} type={"error"} onClose={() => setError(null)}/>
                )}
                {!isLoading && (
                    <div className={
                        "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 xl:gap-x-8"
                    }>
                        {itemsToDisplay.length > 0 ? itemsToDisplay.map(
                            (item) => <ItemCard key={item.itemId} status={item.itemStatus}
                                                itemName={item.itemName}
                                                location={item.location} imgLink={item.itemImageUrl}
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setOpenModal(true);
                                                }}/>
                        ) : null}
                    </div>
                )}
                {itemsToDisplay.length === 0 && !isLoading && !error &&
                    <div className="text-center text-gray-500">
                        No items found.
                    </div>
                }
                {openModal &&
                    <ItemModal
                        onDelete={onDelete}
                        isOpen={openModal}
                        item={selectedItem}
                        onClose={() => setOpenModal(false)}
                    />
                }
            </div>
        </div>
    )
}