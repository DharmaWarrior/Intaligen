import React, { useContext } from 'react';
import useState from 'react';
import Avatar from '@mui/material/Avatar';
import { LoginContext } from './ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate , NavLink } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {

    const { logindata, setLoginData } = useContext(LoginContext);

    const history = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const logoutuser = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                Accept: "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data);

        if (data.msg === 'logout successful') {
            
            console.log("use logout");
            toast.success("Logout was successful!", {
                    position: "top-center"
                });
            localStorage.removeItem("usersdatatoken");
            
            
            
              setLoginData(false)
                history("/");
            
            // history("/");
        } else {
            console.log("error");
            toast.error("User already logged out!", {
                    position: "top-center"
                });
        }
    }

    const goDash = () => {
        history("/dash")
    }

    const goError = () => {
        history("*")
    }








    return (
        <>
            <header className="w-full h-20 bg-white shadow-md">
            <nav className="max-w-7xl h-full mx-auto flex justify-between items-center px-4">
                <NavLink to="/" className="text-xl font-bold text-gray-800 flex flex-row">
                <img
                className="h-8 object-cover object-center"
                src="intaligen_logo.png"
                alt="logo"
                />
                <p className='ml-2'>Intaligen</p>
                </NavLink>
                <div className="avtar">
                {
                    logindata.ValidUserOne ? 
                    <Avatar 
                        className="cursor-pointer"
                        style={{ background: "salmon", fontWeight: "bold", textTransform: "capitalize" }} 
                        onClick={handleClick}
                    >
                        {logindata.ValidUserOne.name[0].toUpperCase()}
                    </Avatar> :
                    <Avatar className="cursor-pointer" style={{ background: "blue" }} onClick={handleClick} />
                }
                </div>

                <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                >
                {
                    logindata.ValidUserOne ? (
                    <div>
                        <MenuItem onClick={() => {
                        goDash()
                        handleClose()
                        }}>Profile</MenuItem>
                        <MenuItem onClick={() => {
                        logoutuser()
                        handleClose()
                        }}>Logout</MenuItem>
                    </div>
                    ) : (
                    <div>
                        <MenuItem onClick={() => {
                        goError()
                        handleClose()
                        }}>Profile</MenuItem>
                    </div>
                    )
                }
                </Menu>
            </nav>
            <ToastContainer />
            </header>
        </>
    );
}

export default Header;