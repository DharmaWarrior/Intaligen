import { RxDashboard } from 'react-icons/rx';
import { MdInsights } from 'react-icons/md';
import { RiCouponLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFolder, BsWallet2 } from 'react-icons/bs';

export const datas = [
    {
        id: 1,
        icon: <RxDashboard style={{ color: 'white' }} />,
        text: "Dashboard",
        route: "/dash"
    },
    {
        id: 2,
        icon: <MdInsights style={{ color: 'white' }} />,
        text: "Production planning",
        route: "/productionchartsnew"
    },
    {
        id: 3,
        icon: <RiCouponLine style={{ color: 'white' }} />,
        text: "Orders",
        route: "/orders"
    },
    {
        id: 4,
        icon: <RiCouponLine style={{ color: 'white' }} />,
        text: "Production departments",
        route: "/workstation_console"
    },
    {
        id: 5,
        icon: <BsWallet2 style={{ color: 'white' }} />,
        text: "Inventory",
        route: "/inventory"
    },
    {
        id: 6,
        icon: <AiOutlineMessage style={{ color: 'white' }} />,
        text: "Material planning",
        route: "/material-planning"
    },
    {
        id: 7,
        icon: <BsFolder style={{ color: 'white' }} />,
        text: "Purchases",
        route: "/purchases"
    },
    {
        id: 8,
        icon: <FiUser style={{ color: 'white' }} />,
        text: "Admin",
        route: "/admin"
    },
    {
        id: 9,
        icon: <BsWallet2 style={{ color: 'white' }} />,
        text: "Master data",
        route: "/masterDataDashboard"
    },
    // {
    // id: 8,
    // icon: <FiLogout style={{ color: 'white' }} />,
    // text: "Logout",
    // route: "/logout"
    // },
];