import React, { useState } from 'react';
import { BookOpen, Droplets, Leaf, Shield, Tractor, ChevronRight, CheckCircle2 } from 'lucide-react';

const guideTopics = [
    {
        id: 'soil',
        title: 'Soil Preparation & Management',
        icon: <Leaf size={24} />,
        content: (
            <div className="guide-content-section animate-fade-in">
                <h2>Building Healthy Soil</h2>
                <p>Soil is the foundation of a successful harvest. Managing soil health involves understanding its structure, pH, and nutrient composition.</p>
                
                <h3>Key Practices:</h3>
                <ul className="guide-list">
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Testing:</strong> Regularly test your soil to monitor NPK (Nitrogen, Phosphorus, Potassium) levels and pH.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Organic Matter:</strong> Incorporate compost, manure, or cover crops to improve soil structure and water retention.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Tillage:</strong> Use minimum or no-till farming where possible to prevent soil erosion and preserve beneficial microorganisms.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Crop Rotation:</strong> Rotate crops belonging to different families to prevent nutrient depletion.</span></li>
                </ul>
                
                <div className="guide-tip-box mt-4">
                    <strong>Pro Tip:</strong> Legumes like peas and beans naturally fix atmospheric nitrogen into the soil, reducing the need for synthetic nitrogen fertilizers!
                </div>
            </div>
        )
    },
    {
        id: 'sowing',
        title: 'Crop Selection & Sowing',
        icon: <Tractor size={24} />,
        content: (
            <div className="guide-content-section animate-fade-in">
                <h2>Planting for Success</h2>
                <p>Choosing the right crop for your specific location and planting it correctly is critical for optimal yield.</p>
                
                <h3>Key Practices:</h3>
                <ul className="guide-list">
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Climate Matching:</strong> Select crop varieties bred for your local climate to ensure resistance to local stresses.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Seed Quality:</strong> Always use certified, disease-free seeds with high germination rates.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Spacing:</strong> Adhere to recommended plant spacing to avoid competition for sunlight and nutrients.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Timing:</strong> Plant at the right time. Our AI Models can help you determine the best crop based on current seasonal conditions.</span></li>
                </ul>
            </div>
        )
    },
    {
        id: 'irrigation',
        title: 'Irrigation Strategies',
        icon: <Droplets size={24} />,
        content: (
            <div className="guide-content-section animate-fade-in">
                <h2>Efficient Water Management</h2>
                <p>Water is a precious resource. Efficient irrigation ensures plants get exactly what they need without wastage.</p>
                
                <h3>Key Practices:</h3>
                <ul className="guide-list">
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Drip Irrigation:</strong> Highly efficient for row crops and orchards, delivering water directly to the root zone.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Scheduling:</strong> Water during cooler parts of the day (early morning or late evening) to minimize evaporation.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Mulching:</strong> Apply organic mulch to the soil surface to conserve moisture and suppress weeds.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Monitoring:</strong> Use soil moisture sensors rather than visual guessing to determine when to water.</span></li>
                </ul>
                
                <div className="guide-tip-box mt-4" style={{ background: '#e3f2fd', borderLeftColor: '#1976d2', color: '#1565c0' }}>
                    <strong>Did you know?</strong> Overwatering can be just as harmful as underwatering, often leading to root rot and increased fungal diseases.
                </div>
            </div>
        )
    },
    {
        id: 'pest',
        title: 'Pest & Disease Control',
        icon: <Shield size={24} />,
        content: (
            <div className="guide-content-section animate-fade-in">
                <h2>Protecting Your Harvest</h2>
                <p>Integrated Pest Management (IPM) is the most sustainable way to keep diseases and pests at bay.</p>
                
                <h3>Key Practices:</h3>
                <ul className="guide-list">
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Early Detection:</strong> Routinely scout your fields. Use our Disease Identification tool at the first sign of leaf spots or discoloration.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Biocontrol:</strong> Encourage natural predators like ladybugs or use safe biopesticides like Neem oil before resorting to harsh chemicals.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Sanitation:</strong> Remove and destroy infected plant debris to prevent the spread of fungal spores.</span></li>
                    <li><CheckCircle2 size={18} color="var(--primary-color)" /> <span><strong>Resistant Varieties:</strong> Plant cultivars that are genetically resistant to common local diseases.</span></li>
                </ul>
            </div>
        )
    }
];

const FarmingGuide = () => {
    const [activeTopic, setActiveTopic] = useState(guideTopics[0].id);

    return (
        <div className="container section animate-fade-in pb-8">
            <div className="text-center" style={{ marginBottom: '40px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <BookOpen color="var(--primary-color)" size={36} /> Smart Farming Guide
                </h1>
                <p className="hero-subtitle">Comprehensive best-practices for sustainable and highly-productive agriculture.</p>
            </div>

            <div className="guide-layout">
                {/* Sidebar Navigation */}
                <div className="guide-sidebar glass-panel">
                    <h3 style={{ padding: '0 15px 15px', color: 'var(--primary-dark)', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                        Topics
                    </h3>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {guideTopics.map(topic => (
                            <button 
                                key={topic.id}
                                onClick={() => setActiveTopic(topic.id)}
                                className={`guide-nav-btn ${activeTopic === topic.id ? 'active' : ''}`}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {topic.icon} {topic.title}
                                </span>
                                {activeTopic === topic.id && <ChevronRight size={18} />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="guide-content glass-panel" style={{ minHeight: '400px' }}>
                    {guideTopics.find(t => t.id === activeTopic)?.content}
                </div>
            </div>

            <style jsx>{`
                .guide-layout {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 30px;
                    align-items: start;
                }
                
                @media (max-width: 768px) {
                    .guide-layout {
                        grid-template-columns: 1fr;
                    }
                }

                .guide-sidebar {
                    padding: 20px;
                }

                .guide-content {
                    padding: 40px;
                }

                .guide-nav-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 12px 15px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    text-align: left;
                    font-size: 1rem;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .guide-nav-btn:hover {
                    background: rgba(76, 175, 80, 0.05);
                    color: var(--primary-color);
                }

                .guide-nav-btn.active {
                    background: var(--primary-color);
                    color: white;
                    font-weight: 500;
                }
                
                .guide-nav-btn.active svg {
                    color: white !important;
                }

                .guide-content-section h2 {
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    font-size: 2rem;
                }

                .guide-content-section h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                    color: #333;
                }

                .guide-content-section p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #555;
                }

                .guide-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .guide-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    font-size: 1.05rem;
                    line-height: 1.5;
                    color: #444;
                }

                .guide-list li svg {
                    flex-shrink: 0;
                    margin-top: 3px;
                }

                .guide-tip-box {
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(76, 175, 80, 0.1);
                    border-left: 4px solid var(--primary-color);
                    border-radius: 4px 8px 8px 4px;
                    color: #2e7d32;
                    font-size: 1.05rem;
                }
            `}</style>
        </div>
    );
};

export default FarmingGuide;
