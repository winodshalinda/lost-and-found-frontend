import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import {Logo} from "../../common/Logo";
import {Nav} from "./Nav";
import {NavLink} from "react-router-dom";
import {LogOutButton} from "../../common/Button";
import {Role} from "../../../types/SignUpIF";
import {useAuth} from "../../../features/auth";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/solid";

const navigation = [
    {name: 'All', href: '/items/all'},
    {name: 'Lost', href: '/items/lost'},
    {name: 'Found', href: '/items/found'},
    {name: 'Claimed', href: '/items/claimed'}
];

const subNavigation = [
    {name: 'My Items', href: '/items/user', roles: [Role.USER, Role.ADMIN, Role.STAFF]},
    {name: 'My Requests', href: '/requests/my-requests', roles: [Role.USER]},
    {name: 'Received Requests', href: '/requests/all', roles: [Role.ADMIN, Role.STAFF]},
    {name: 'User Management', href: '/all-users', roles: [Role.ADMIN]}
];

export const NavBar = () => {
    const {userRole} = useAuth();

    return (
        <Disclosure as="nav" className="bg-primary-dark sticky top-0 z-20">
            {({open, close}) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                                <DisclosureButton
                                    className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-7 w-7" aria-hidden="true"/>
                                    ) : (
                                        <Bars3Icon className="block h-7 w-7" aria-hidden="true"/>
                                    )}
                                </DisclosureButton>
                            </div>

                            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                                <NavLink to="/" className="flex shrink-0 items-center">
                                    <Logo className={"h-10 w-auto"} color={'white'}/>
                                </NavLink>
                                <div className="hidden md:ml-6 md:flex md:items-center">
                                    <div className="flex h-fit space-x-1">
                                        {navigation.map((item) => (
                                            <Nav key={item.name} to={item.href}
                                                 className="text-gray-300 hover:bg-primary hover:text-white rounded-md px-2 py-2 text-sm font-medium"
                                                 activeClassName="bg-gray-900 text-white">
                                                {item.name}
                                            </Nav>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={'hidden md:ml-2 md:flex md:items-center'}>
                                <div className="flex items-center lg:gap-x-4">
                                    {subNavigation.filter(item => item.roles.includes(userRole!))
                                        .map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.href}
                                                className={({isActive}) =>
                                                    `rounded-md px-2 py-1 text-xs lg:text-sm font-medium text-gray-300 hover:text-white hover:underline ${isActive ? 'text-white underline font-semibold' : ''}`
                                                }
                                            >
                                                {item.name}
                                            </NavLink>
                                        ))}
                                </div>
                                <LogOutButton
                                    className="ml-3 bg-primary text-white rounded-lg hover:text-red-700 hover:bg-white px-3 py-1 text-sm font-medium tracking-tight"
                                />
                            </div>


                            <div
                                className="md:hidden absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                                <LogOutButton
                                    className="bg-primary text-white rounded-lg hover:text-red-700 hover:bg-white px-3 py-1 text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel
                        className="lg:hidden fixed inset-x-0 top-16 z-20 w-full bg-primary-dark bg-opacity-95 backdrop-blur-lg max-h-[calc(100vh-4rem)] overflow-y-auto sm:w-72 sm:left-0 sm:right-auto"
                    >
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => close()}
                                    className={({isActive}) =>
                                        `block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary ${isActive ? `bg-gray-900 text-white` : ``}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                            <div className="border-t border-primary my-2"></div>
                            {subNavigation
                                .filter(item => item.roles.includes(userRole!))
                                .map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => close()}
                                        className={({isActive}) =>
                                            `block rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-primary ${isActive ? `bg-gray-900 text-white` : ``}`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};