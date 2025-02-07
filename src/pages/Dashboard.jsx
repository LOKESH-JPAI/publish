import React, { useEffect, useState } from "react";
import { FaBox, FaShoppingCart, FaUsers, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalSales: 0
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
            } else {
                setUser(currentUser);
            }
        });

        // Simulate fetching data (Replace with API call)
        setTimeout(() => {
            setDashboardData({
                totalProducts: 50,
                totalOrders: 120,
                totalUsers: 200,
                totalSales: 5000
            });
        }, 1000);

        return () => unsubscribe(); // Cleanup on unmount
    }, [navigate]);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            try {
                await signOut(auth);
                navigate("/login");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <button className="btn btn-danger mt-1 float-end" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
            </button>

            <h2 className="mb-4 text-center fw-bold">Admin Dashboard</h2>

            {user ? <p className="text-center text-muted">Welcome, {user.email}!</p> : <p className="text-center text-muted">Loading user...</p>}

            <div className="row g-4 justify-content-center">
                {[
                    { title: "Total Products", value: dashboardData.totalProducts, icon: <FaBox size={40} />, color: "primary" },
                    { title: "Total Orders", value: dashboardData.totalOrders, icon: <FaShoppingCart size={40} />, color: "success" },
                    { title: "Total Users", value: dashboardData.totalUsers, icon: <FaUsers size={40} />, color: "warning" },
                    { title: "Sales Overview", value: `$${dashboardData.totalSales}`, icon: <FaChartBar size={40} />, color: "info" },
                ].map((card, index) => (
                    <div className="col-md-3 col-sm-6" key={index}>
                        <div className={`card text-white bg-${card.color} shadow-lg border-0 rounded-3 hover-card`}>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                                {card.icon}
                                <h5 className="card-title mt-3 fw-bold">{card.title}</h5>
                                <p className="card-text fs-4">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Styling */}
            <style>
                {`
                .hover-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .hover-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
                }
                `}
            </style>
        </div>
    );
};

export default Dashboard;
