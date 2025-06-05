import {PhotoIcon} from "@heroicons/react/24/solid";
import {TextArea, TextField} from "../common/Input";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {ItemIF} from "../../types/ItemIF";
import {createItem, updateItem} from "../../services/ItemService";
import {Button} from "../common/Button";
import {useNavigate, useParams} from "react-router-dom";
import {Alert} from "../common/Alert";

const BaseURL = 'http://localhost:4444/laf';

export const ItemForm = () => {
    const {editItem} = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<ItemIF>({
        itemName: '',
        location: '',
        foundOrLostDate: '',
        itemDescription: ''
    });

    const [imgFile, setImgFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editItem) {
            const i = sessionStorage.getItem(editItem);
            if (i) {
                const parsedItem = JSON.parse(i);
                setItem(parsedItem);
            } else {
                console.warn(`Item with key "${editItem}" not found in sessionStorage.`);
                setItem({
                    itemName: '',
                    location: '',
                    foundOrLostDate: '',
                    itemDescription: '',
                    itemImageUrl: undefined
                });
                setImgFile(null);
            }
        } else {
            setItem({
                itemName: '',
                location: '',
                foundOrLostDate: '',
                itemDescription: '',
                itemImageUrl: undefined
            });
            setImgFile(null);
        }
    }, [editItem]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgFile(e.target.files[0]);
        }
    };

    const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setItem({...item, [e.target.name]: e.target.value});
    };

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setItem({...item, [e.target.name]: e.target.value});
    };

    const handleOnSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!item.itemName.trim()) {
            setError("Item name is required");
            setIsSubmitting(false);
            return;
        }

        if (!item.foundOrLostDate) {
            setError("Date is required");
            setIsSubmitting(false);
            return;
        }

        try {
            if (editItem) {
                const updatedItem = await updateItem(item, imgFile);
                console.log("Item updated successfully:", updatedItem);
            } else {
                const createdItem = await createItem(item, imgFile);
                console.log("Item created successfully:", createdItem);
            }

            // Reset a form for next submission
            setItem({
                itemName: '',
                location: '',
                foundOrLostDate: '',
                itemDescription: ''
            });

            setImgFile(null);
            navigate('/items/all');

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Alert
                message={error}
                type="error"
                visibility={!!error}
                onClose={() => {
                    setError(null)
                }}
                className={'fixed top-auto left-0 right-0 z-20'}
            />

            <div className={'mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8 '}>
                <form onSubmit={handleOnSubmit} noValidate={true}>

                    <div className="space-y-12">

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base/7 font-semibold text-gray-900 border-b border-gray-900/10 ">
                                Item Information
                            </h2>

                            <div className="mt-10">
                                <div className="">
                                    <label className="block text-sm/6 font-medium text-gray-900">
                                        Item photo
                                    </label>
                                    <div className="flex flex-col justify-center items-center">
                                        <div
                                            className={`mt-2 w-full sm:w-1/2 min-h-full flex justify-center items-center rounded-lg border border-dashed py-10 border-green-500 bg-green-50`}
                                        >
                                            <div className="text-center">
                                                {imgFile ? ( // Priority 1: Show newly selected file preview
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-fit h-64 mb-2 p-2 overflow-hidden rounded-md">
                                                            <img
                                                                src={URL.createObjectURL(imgFile)}
                                                                alt="Preview"
                                                                className="w-fit h-full object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : item.itemImageUrl ? ( // Priority 2: Show existing item image (if editing)
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-fit h-64 mb-2 p-2 overflow-hidden rounded-md">
                                                            <img
                                                                src={`${BaseURL}${item.itemImageUrl}`}
                                                                alt="Current item"
                                                                className="w-fit h-full object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : ( // Priority 3: Show placeholder
                                                    <PhotoIcon aria-hidden="true"
                                                               className="mx-auto size-12 text-gray-300"/>
                                                )}
                                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                                    <label
                                                        htmlFor="image"
                                                        className="relative p-2 cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-light"
                                                    >
                                                        {/* Adjust label based on whether an image is displayed */}
                                                        <span>{(imgFile || item.itemImageUrl) ? 'Change file' : 'Upload a file'}</span>
                                                        <input
                                                            id="image"
                                                            name="image"
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            required={!editItem} // Only required if creating a new item
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                    {/* Adjust helper text visibility */}
                                                    {!(imgFile || item.itemImageUrl) &&
                                                        <p className="pl-1">or drag and drop</p>}
                                                </div>
                                                {!(imgFile || item.itemImageUrl) &&
                                                    <p className="text-xs/5 text-gray-600">PNG, JPG up to 10MB</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="itemName" className="block text-sm/6 font-medium text-gray-900">
                                        Item name
                                    </label>
                                    <div className="mt-2">
                                        <TextField
                                            id="itemName"
                                            name="itemName"
                                            type="text"
                                            value={item.itemName}
                                            variant={'sm'}
                                            required
                                            className="block"
                                            onChange={handleTextInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">
                                        Location
                                    </label>
                                    <div className="mt-2">
                                        <TextField
                                            id="location"
                                            name="location"
                                            value={item.location}
                                            type="text"
                                            className="block"
                                            onChange={handleTextInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="foundOrLostDate"
                                           className="block text-sm/6 font-medium text-gray-900">
                                        Found or Lost Date
                                    </label>
                                    <div className="mt-2">
                                        <TextField
                                            id="foundOrLostDate"
                                            name="foundOrLostDate"
                                            type="date"
                                            value={item.foundOrLostDate}
                                            required
                                            className="block"
                                            onChange={handleTextInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="itemDescription"
                                           className="block text-sm/6 font-medium text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <TextArea
                                            id="itemDescription"
                                            name="itemDescription"
                                            value={item.itemDescription}
                                            rows={3}
                                            onChange={handleTextAreaChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Button
                            className="text-sm/6 font-semibold text-gray-900"
                            onClick={() => {
                                setItem({
                                    itemName: '',
                                    location: '',
                                    foundOrLostDate: '',
                                    itemDescription: ''
                                });
                                setImgFile(null);
                                setError(null);
                            }}
                        >
                            Reset
                        </Button>
                        {editItem ? (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSubmitting
                                    ? 'bg-primary-light cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark'
                                }`}
                            >
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSubmitting
                                    ? 'bg-primary-light cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark'
                                }`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>)
                        }

                    </div>
                </form>
            </div>
        </>
    )
}
