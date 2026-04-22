import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="navbar glass-panel">
            <div className="container nav-content">
                <Link to="/" className="brand">
                    <Leaf className="brand-icon" size={28} color="var(--primary-color)" />
                    <h1 className="brand-title">AgriSens</h1>
                </Link>
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/features" className="nav-link">Features</Link>
                    <Link to="/guide" className="nav-link">Farming Guide</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                </nav>
                <button className="mobile-menu-btn">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
