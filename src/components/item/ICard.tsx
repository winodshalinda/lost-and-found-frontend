import {HTMLAttributes} from "react";
import {ItemStatus} from "../../types/ItemIF";

const BaseURL = 'http://localhost:4444/laf';

interface ItemCardProps extends HTMLAttributes<HTMLDivElement> {
    itemName?: string;
    location?: string;
    status?: ItemStatus;
    imgLink?: string;
}

export const ItemCard = ({status, itemName, location, imgLink, onClick, ...rest}: ItemCardProps) => {

    let statusClass = undefined;
    switch (status) {
        case ItemStatus.LOST:
            statusClass = "bg-red-500";
            break;
        case ItemStatus.FOUND:
            statusClass = "bg-blue-500";
            break;
        case ItemStatus.CLAIMED:
            statusClass = "bg-green-500";
            break;
    }

    return (
        <div
            className={"group relative rounded bg-white hover:cursor-pointer"}
            onClick={onClick}
            {...rest}
        >
            <img
                src={`${BaseURL}${imgLink}`}
                alt={itemName}
                className={"aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-40"}
            />

            <h3 className={`absolute inset-0 rounded font-bold w-fit ml-1 mt-1 h-fit text-sm text-white px-2 ${statusClass}`}>{status}</h3>

            <div className={"mt-2"}>
                <div>
                    <h3 className="text font-bold text-black">
                        <div>
                            <span aria-hidden="true" className="absolute inset-0"/>
                            {itemName}
                        </div>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{location}</p>
                </div>
            </div>
        </div>
    );
}