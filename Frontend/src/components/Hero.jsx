import React from 'react';
import { ArrowRight, Activity, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container hero-container animate-fade-in">
                <div className="hero-content">
                    <div className="badge">
                        <Sprout size={16} />
                        <span>Smart Farming Revolution</span>
                    </div>
                    <h1 className="hero-title">AI-Powered Farming Assistant</h1>
                    <p className="hero-subtitle">
                        Empowering farmers with machine learning insights for optimal crop selection, early disease detection, and precision agriculture.
                    </p>
                    <div className="hero-cta-group">
                        <Link to="/features" className="btn btn-primary">
                            Explore Tools <ArrowRight size={18} />
                        </Link>
                        <Link to="/guide" className="btn btn-secondary">
                            Read Guide
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <span className="stat-number">99.5%</span>
                            <span className="stat-label">Prediction Accuracy</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">38+</span>
                            <span className="stat-label">Diseases Detected</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">Real-time</span>
                            <span className="stat-label">Weather Data</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
