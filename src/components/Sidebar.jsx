import React, { useContext } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import SidebarData from './SidebarData';
import { LoginContext } from './ContextProvider/Context';

export default function Sidebar() {
    const { logindata } = useContext(LoginContext);
    if (logindata.ValidUserOne){
        return (
            <div className="sidebar-container h-[90%] overflow-y-auto font-sans top-0 left-0">
                <SidebarData />
                
            </div>
        );
    } else {
        return <div>Sidebar is Loading...</div>; // or any other placeholder
    }
}

