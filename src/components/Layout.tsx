import React from 'react';
import { Fingerprint, Grid, Link as LinkIcon, Sparkles, Layout as LayoutIcon, Image as ImageIcon, AlignJustify, DownloadCloud, Monitor } from 'lucide-react';
import { type Tab } from '../constants/appConstants';

interface LayoutProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  children: React.ReactNode;
  background?: string;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children, background }) => {
  const navItems = [
    { id: 'templates', icon: Grid, label: 'Presets' },
    { id: 'content', icon: LinkIcon, label: 'Content' },
    { id: 'design', icon: Sparkles, label: 'Design' },
    { id: 'corners', icon: LayoutIcon, label: 'Anchors' },
    { id: 'branding', icon: ImageIcon, label: 'Branding' },
    { id: 'labels', icon: AlignJustify, label: 'Typography' },
    { id: 'export', icon: DownloadCloud, label: 'Export' },
  ];

  return (
    <div className="studio-container" style={{ background }}>
      {/* Desktop Sidebar */}
      <nav className="studio-nav desktop-only">
        <div className="nav-item active">
          <Fingerprint size={24} />
          <span>STUDIO</span>
        </div>
        <div style={{ flex: 1 }} />
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id as Tab)}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
      </nav>

      {/* 
          On Mobile: 
          - Children contain the QR Stage and Drawer.
          - We wrap them so the Nav can sit between them.
      */}
      <main className="studio-workbench">
        <div className="brand-badge">
          <Monitor size={20} color="var(--accent-neon)" />
          <h1>DOCXFORGE STUDIO</h1>
        </div>
        
        {/* The first child is the qr-stage, the second is the studio-drawer */}
        {React.Children.map(children, (child, index) => {
          if (index === 0) {
            return (
              <>
                {child}
                <nav className="mobile-nav">
                  {navItems.map((item) => (
                    <div
                      key={item.id}
                      className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(item.id as Tab)}
                    >
                      <item.icon size={20} />
                      <span className="mobile-label">{item.label}</span>
                    </div>
                  ))}
                </nav>
              </>
            );
          }
          return child;
        })}
      </main>
    </div>
  );
};

export default Layout;
