import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { LoginContext } from './ContextProvider/Context';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';


const Login = () => {
    const { logindata, setLoginData } = useContext(LoginContext);
    const [passShow, setPassShow] = useState(false);
    const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });

    const history = useNavigate();

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

        if (name === "email") {
            if (value.trim() === "" || !validator.isEmail(value)) {
                isError = true;
            }
        } else if (name === "password") {
            if (value.trim() === "" || value.length < 6) { // Assuming a minimum length of 6 for the password
                isError = true;
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: isError
        }));
    };

    const loginuser = async (e) => {
        e.preventDefault();

        const { email, password } = inpval;

        if (email === "") {
            toast.error("Email is required!", {
                position: "top-center"
            });
        } else if (!validator.isEmail(email)) {
            toast.warning("Please enter a valid email!", {
                position: "top-center"
            });
        } else if (password === "") {
            toast.error("Password is required!", {
                position: "top-center"
            });
        } else if (password.length<6) {
            toast.error("Minimum length of password should be 6!", {
                position: "top-center"
            });
        }
        else {
            const data = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "referer": "", email, password
                })
            });

            const resone = await data.json();
            const tokenVar = resone.token;

            const data2 = await fetch("/checkAuthentication", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + tokenVar,
                    "Content-Type": "application/json"
                },
            });

            const res = await data2.json();
            if (res.status === "pass") {
                localStorage.setItem("usersdatatoken", resone.token);
                history("/dash");
                toast.success("Login was successful!", {
                    position: "top-center"
                });
                setInpval({ ...inpval, email: "", password: "" });
            } else {
                toast.error("Invalid credentials!", {
                    position: "top-center"
                });
            }
        }
    }

    return (
        <>
            <section className="w-full py-10 min-h-screen">
                <div className="form_data max-w-lg w-full mx-auto p-6 bg-white shadow-md rounded flex flex-col items-center">
                    <div className="form_heading mb-10">
                        <h1 className="text-3xl font-sans text-gray-900">Login to Intaligen</h1>
                    </div>

                    <form className="w-full" onSubmit={loginuser}>
                        <div className="form_input">
                            <label htmlFor="email" className="block font-sans font-semibold text-blue-900 text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={inpval.email}
                                onChange={setVal}
                                name="email"
                                id="email"
                                className={`font-sans w-full px-3 py-2 border rounded outline-none text-gray-700 leading-tight focus:border-blue-500 mb-3 ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter Your Email Address"
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password" className="block font-semibold text-blue-900 text-sm mb-2 font-sans">Password</label>
                            <div className="two relative font-sans">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    onChange={setVal}
                                    value={inpval.password}
                                    name="password"
                                    id="password"
                                    className={`w-full px-3 py-2 border rounded outline-none text-gray-700 leading-tight focus:border-blue-500 mb-6 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Enter Your Password"
                                />
                                <div className="font-sans showpass absolute top-0 right-0 px-2 py-1 mr-1 mt-0.5 font-semibold text-blue-900 bg-gray-200 border rounded cursor-pointer" onClick={() => setPassShow(!passShow)}>
                                    {!passShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>

                        <button className="font-sans btn bg-gradient-to-r from-purple-400 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full">Login</button>
                        

                        <p className="font-sans text-sm mt-4 text-center">Don't have an Account? <NavLink to="/register" className="text-violet-500">Sign Up</NavLink> </p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    );
}

export default Login;