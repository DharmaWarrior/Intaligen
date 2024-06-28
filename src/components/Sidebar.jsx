import React, { useContext } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import SidebarData from './SidebarData';
import { LoginContext } from './ContextProvider/Context';
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from './cn';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from './../../components/ui/resizable';
import { Separator } from './../../components/ui/separator';
import Nav from './Nav'
import {
    LogOut,
} from 'lucide-react';
import { RxDashboard } from 'react-icons/rx';
import { MdInsights } from 'react-icons/md';
import { RiCouponLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFolder, BsWallet2 } from 'react-icons/bs';
import { Button } from './../../components/ui/button';
import { useAuth } from './ContextProvider/Authcontext';
import { toast } from 'react-toastify';

export default function Sidebar(
    defaultLayout = [265, 440, 655],
    defaultCollapsed = false,
    navCollapsedSize = 4,
) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
    const {user , login, logout } = useAuth(); 

    const history = useNavigate();

    const logoutuser = async () => {
        try {
            let token = localStorage.getItem("usersdatatoken");
            const response = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
        
            if (response.ok) {
                console.log('Logout was successful!');
                logout();
                history("/");
            } else {
                console.log('Logout was unsuccessful!');
            }
        } catch (error) {
            console.error('Error fetching order info:', error);
            alert('Error fetching order info');
        }
    };

    {
        return (
            <ResizablePanel
                // defaultSize={defaultLayout[0]}  
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={12}
                maxSize={18}
                onCollapse={() => {
                    setIsCollapsed(true)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
                }}
                onExpand={() => {
                    setIsCollapsed(false)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
                }}
                className={cn(
                    isCollapsed &&
                    " h-[120%] overflow-y-auto font-sans top-0 left-0"
                )}
            >
            <div className='text-2xl text-black pb-3'>Raqgen Solutions Pvt. Ltd.</div>
                <Separator className='mb-3'/> 
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                    {
                        label: "1",
                        icon: RxDashboard,
                        title: "Dashboard",
                        route: "/dash",
                        variant: "ghost",
                    },
                    {
                        label: "2",
                        icon: MdInsights,
                        title: "Production planning",
                        variant: "ghost",
                        route: "/productionchartsnew"
                    },
                    {
                        label: "3",
                        icon: RiCouponLine,
                        title: "Orders",
                        variant: "ghost",
                        route: "/orders"
                    },
                    {
                        label: "4",
                        icon: RiCouponLine,
                        title: "Production departments",
                        variant: "ghost",
                        route: "/workstation_console"
                    },
                    {
                        label: "5",
                        icon: BsWallet2,
                        title: "Inventory",
                        variant: "ghost",
                        route: "/inventory"
                    },
                    {
                        label: "6",
                        icon: AiOutlineMessage,
                        title: "Material planning",
                        variant: "ghost",
                        route: "/material-planning"
                    },
                    {
                        label: "7",
                        icon: BsFolder,
                        title: "Purchases",
                        variant: "ghost",
                        route: "/purchases"
                    },
                    {
                        label: "8",
                        icon: FiUser,
                        title: "Admin",
                        variant: "ghost",
                        route: "/admin"
                    },
                    {
                        label: "9",
                        icon: BsWallet2,
                        title: "Master data",
                        variant: "ghost",
                        route: "/masterDataDashboard"
                    },
                    ]}
                />
                {!isCollapsed ? (
                    <Button className='mt-4 ml-3' onClick={logoutuser}> Logout</Button>
                ) : (
                    <Button className='my-1 ml-3' size="icon" onClick={logoutuser}> 
                        <LogOut className="h-4 w-4"/>
                    </Button>
                )
                    }
                
                
            </ResizablePanel>
        );
    }
}

