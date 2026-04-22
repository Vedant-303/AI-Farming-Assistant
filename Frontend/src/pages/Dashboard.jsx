import React, { useState, useEffect } from 'react';
import { getFarmStatus, getRecommendationHistory, resetFarmStatus } from '../services/api';
import { LayoutDashboard, Sprout, Calendar, ArrowRight, Trash2, History, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [status, setStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statusData, historyData] = await Promise.all([
                getFarmStatus(),
                getRecommendationHistory()
            ]);
            setStatus(statusData.active ? statusData : null);
            setHistory(historyData || []);
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm("Are you sure you want to reset your farm status? This will clear your currently planted crop data.")) {
            try {
                await resetFarmStatus();
                setStatus(null);
            } catch (err) {
                alert("Failed to reset");
            }
        }
    };

    const calculateDaysPlanted = (date) => {
        const start = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) return (
        <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="loader">Loading Dashboard...</div>
        </div>
    );

    return (
        <div className="container section animate-fade-in">
            <div className="dashboard-header">
                <h1><LayoutDashboard /> Farm Management Dashboard</h1>
                <p className="hero-subtitle">Monitor your crops, track progress, and view latest AI insights.</p>
            </div>

            <div className="dashboard-grid">
                {/* Current Status Card */}
                <div className="glass-panel status-card">
                    <div className="card-header">
                        <h2>Current Activity</h2>
                        {status && (
                            <button onClick={handleReset} className="btn-icon text-error" title="Reset Dashboard">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {status ? (
                        <div className="status-content">
                            <div className="crop-badge animate-pulse">
                                <Sprout size={40} />
                                <div>
                                    <h3>{status.crop_name}</h3>
                                    <span className="status-tag">{status.status}</span>
                                </div>
                            </div>
                            <div className="status-details">
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <span>Planted on: {status.date_planted} ({calculateDaysPlanted(status.date_planted)} days ago)</span>
                                </div>
                                <div className="detail-item">
                                    <AlertCircle size={18} />
                                    <span><strong>Next Step:</strong> {status.next_step}</span>
                                </div>
                            </div>
                            <div className="progress-container">
                                <div className="progress-label">
                                    <span>Growth Progress</span>
                                    <span>35%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '35%' }}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Sprout size={48} opacity={0.3} />
                            <p>No active crop detected.</p>
                            <a href="/recommend-crop" className="btn btn-primary btn-sm">Recommend a Crop</a>
                        </div>
                    )}
                </div>

                {/* Quick Actions / Integration Info */}
                <div className="glass-panel info-card">
                    <h2>Smart Farming Tools</h2>
                    <div className="action-links">
                        <a href="/weather" className="action-item">
                            <div className="action-icon weather">🌦️</div>
                            <div className="action-text">
                                <h4>Check Weather</h4>
                                <p>Plan irrigation based on forecast</p>
                            </div>
                            <ArrowRight size={16} />
                        </a>
                        <a href="/identify-disease" className="action-item">
                            <div className="action-icon disease">🔍</div>
                            <div className="action-text">
                                <h4>Identify Disease</h4>
                                <p>Upload leaf images for diagnosis</p>
                            </div>
                            <ArrowRight size={16} />
                        </a>
                        <a href="/recommend-fertilizer" className="action-item">
                            <div className="action-icon fertilizer">🧪</div>
                            <div className="action-text">
                                <h4>Optimise Nutrients</h4>
                                <p>Get fertilizer recommendations</p>
                            </div>
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>

                {/* History List */}
                <div className="glass-panel history-card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h2><History size={20} /> Recent AI Insights</h2>
                    </div>
                    {history.length > 0 ? (
                        <div className="history-list">
                            {history.map((item) => (
                                <div key={item.id} className="history-item">
                                    <div className={`type-dot ${item.type.toLowerCase()}`}></div>
                                    <div className="history-info">
                                        <span className="history-type">{item.type} Recommendation</span>
                                        <span className="history-result">{item.result}</span>
                                    </div>
                                    <span className="history-time">{item.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>No history available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
