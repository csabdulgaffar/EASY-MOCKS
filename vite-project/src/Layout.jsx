import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";

function Layout() {
    return (
        <div>
            <div className="bg-gray-700 p-5 flex flex-col md:flex-row justify-around items-center">
                <Link to="/" className="text-2xl font-bold text-white py-2">
                    EasyMocks
                </Link>
                <div className="flex flex-col md:flex-row gap-3 text-md">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "underline text-white font-bold" : "text-white font-bold"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/instructions"
                        className={({ isActive }) =>
                            isActive ? "underline text-white font-bold" : "text-white font-bold"
                        }
                    >
                        Read Instructions
                    </NavLink>


                    <NavLink
                        to="/create-quiz"
                        className={({ isActive }) =>
                            isActive ? "underline text-white font-bold" : "text-white font-bold"
                        }
                    >
                        Create a Mock
                    </NavLink>
                </div>
            </div>

            <div className="min-h-screen max-w-[1366px] m-auto px-5">
                <Outlet />
            </div>

            <div className="bg-gray-900 py-40 text-white text-center mt-20">
                <div>Copyright @2025 xyz@gmail.com</div>
            </div>
        </div>
    );
}

export default Layout;
