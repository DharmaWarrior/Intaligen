import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';

export default function Register() {
    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);
    const navigate = useNavigate();
    const [inpval, setInpval] = useState({
        name: "",
        email: "",
        password1: "",
        password2: ""
    });
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password1: false,
        password2: false
    });
    const setVal = (e) => {
        const { name, value } = e.target;
        setInpval((prevState) => ({
            ...prevState,
            [name]: value
        }));
        // Validate the input while typing
        validateField(name, value);
    };
    const validateField = (name, value) => {
        let isError = false;
        if (name === "name" && value.trim() === "") {
            isError = true;
        } else if (name === "email") {
            if (value.trim() === "" || !validator.isEmail(value)) {
                isError = true;
            }
        } else if (name === "password1") {
            if (
                value.length < 8 ||
                !/[a-z]/.test(value) ||
                !/[A-Z]/.test(value) ||
                !/[0-9]/.test(value) ||
                !/[@$!%*?&]/.test(value)
            ) {
                isError = true;
            }
        } else if (name === "password2" && value !== inpval.password1) {
            isError = true;
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: isError
        }));
    };
    const addUserdata = async (e) => {
        e.preventDefault();
        const { name, email, password1, password2 } = inpval;
        if (name.trim() === "") {
            toast.warning("Please enter your name!", {
                position: "top-center"
            });
        } else if (email.trim() === "") {
            toast.error("Please enter email!", {
                position: "top-center"
            });
        } else if (!validator.isEmail(email)) {
            toast.warning("Please enter a valid email!", {
                position: "top-center"
            });
        } else if (password1 === "") {
            toast.error("Please enter the password!", {
                position: "top-center"
            });
        } else if (password1.length < 8) {
            toast.error("Password must be at least 8 characters long!", {
                position: "top-center"
            });
        } else if (!/[a-z]/.test(password1)) {
            toast.error("Password must contain at least one lowercase letter!", {
                position: "top-center"
            });
        } else if (!/[A-Z]/.test(password1)) {
            toast.error("Password must contain at least one uppercase letter!", {
                position: "top-center"
            });
        } else if (!/[0-9]/.test(password1)) {
            toast.error("Password must contain at least one digit!", {
                position: "top-center"
            });
        } else if (!/[@$!%*?&]/.test(password1)) {
            toast.error("Password must contain at least one special character (@$!%*?&)!", {
                position: "top-center"
            });
        } else if (password2 === "") {
            toast.error("Please confirm the password!", {
                position: "top-center"
            });
        } else if (password1 !== password2) {
            toast.error("Passwords do not match!", {
                position: "top-center"
            });
        } else {
            const data = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password1, password2, status: "new"
                })
            });
            const res = await data.json();
            console.log(res);
            if (res.message === "User registered successfully. Check your email for verification") {
                setInpval({ name: "", email: "", password1: "", password2: "" });
                toast.success("Registration was successful. Please login here after verifying the mail!", {
                    position: "top-center"
                });
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                toast.error(res.message, {
                    position: "top-center"
                });
            }
        }
    }

    return (
        <>
            <section className="w-full py-10 min-h-screen">
                <div className="form_data max-w-md w-full mx-auto p-6 bg-white shadow-md rounded flex flex-col items-center">
                    <div className="form_heading mb-10">
                        <h1 className="font-sans text-3xl text-blue-900">Sign Up</h1>
                    </div>
                    <form className="w-full" onSubmit={addUserdata}>
                        <div className="form_input">
                            <label htmlFor="name" className="font-sans block font-semibold text-gray-700 text-sm mb-2">Name</label>
                            <input
                                type="text"
                                onChange={setVal}
                                value={inpval.name}
                                name="name"
                                id="name"
                                className={`font-sans w-full px-3 py-2 border rounded outline-none text-gray-700 leading-tight focus:border-blue-500 mb-3 ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Enter Your Name"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="email" className="block font-semibold text-gray-700 text-sm mb-2 font-sans">Email</label>
                            <input
                                type="email"
                                onChange={setVal}
                                value={inpval.email}
                                name="email"
                                id="email"
                                className={`font-sans w-full px-3 py-2 border rounded outline-none text-gray-700 leading-tight focus:border-blue-500 mb-3 ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter Your Email Address"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password1" className="font-sans block font-semibold text-gray-700 text-sm mb-2">Password</label>
                            <div className="two relative font-sans">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    value={inpval.password1}
                                    onChange={setVal}
                                    name="password1"
                                    id="password1"
                                    className={`font-sans w-full px-3 py-2 border rounded outline-none text-gray-700 leading-tight focus:border-blue-500 mb-3 ${errors.password1 ? 'border-red-500' : ''}`}
                                    placeholder="Enter Your Password"
                                />
                                <div className="font-sans showpass absolute top-0 right-0 px-2 py-1 mr-1 mt-0.5 font-semibold text-blue-900 bg-gray-200 border rounded cursor-pointer" onClick={() => setPassShow(!passShow)}>
                                    {!passShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <div className="form_input">
                            <label htmlFor="password2" className="font-sans block font-semibold text-gray-700 text-sm mb-2">Confirm Password</label>
                            <div className="two relative font-sans">
                                <input
                                    type={!cpassShow ? "password" : "text"}
                                    value={inpval.password2}
                                    onChange={setVal}
                                    name="password2"
                                    id="password2"
                                    className={`font-sans w-full px-3 py-2 border rounded-lg outline-none text-gray-700 leading-tight focus:border-blue-500 mb-6 ${errors.password2 ? 'border-red-500' : ''}`}
                                    placeholder="Confirm Password"
                                />
                                <div className="font-sans showpass absolute top-0 right-0 px-2 py-1 mr-1 mt-0.5 font-semibold text-blue-900 bg-gray-200 border rounded cursor-pointer" onClick={() => setCPassShow(!cpassShow)}>
                                    {!cpassShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <button className="font-sans btn bg-gradient-to-r from-purple-400 to-teal-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full">Sign Up</button>
                        <p className="font-sans text-sm mt-4 text-center">Already have an account? <NavLink to="/" className="text-violet-500">Login</NavLink></p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    );
}