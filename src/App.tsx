import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeStyling, {
  type DrawType,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type FileExtension
} from 'qr-code-styling';
import { 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  Sparkles,
  Link as LinkIcon,
  Box,
  Monitor,
  Fingerprint,
  DownloadCloud,
  AlignJustify
} from 'lucide-react';
import './App.css';

type Tab = 'content' | 'design' | 'corners' | 'branding' | 'labels' | 'export';

const PATTERNS: { id: DotType; label: string; preview: string }[] = [
  { id: 'rounded', label: 'Rounded', preview: 'radial-gradient(circle, #fff 40%, transparent 41%)' },
  { id: 'dots', label: 'Dots', preview: 'radial-gradient(circle, #fff 20%, transparent 21%)' },
  { id: 'classy', label: 'Classy', preview: 'linear-gradient(45deg, #fff 25%, transparent 25%)' },
  { id: 'classy-rounded', label: 'Dynamic', preview: 'radial-gradient(ellipse, #fff 50%, transparent 51%)' },
  { id: 'square', label: 'Square', preview: 'linear-gradient(#fff, #fff)' },
  { id: 'extra-rounded', label: 'Fluid', preview: 'conic-gradient(#fff 90deg, transparent 90deg)' },
];

const CORNERS: { id: CornerSquareType; label: string }[] = [
  { id: 'square', label: 'Classic' },
  { id: 'dot', label: 'Modern' },
  { id: 'rounded', label: 'Soft' },
  { id: 'extra-rounded', label: 'Curved' },
];

const INNER_CORNERS: { id: CornerDotType; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Circle' },
];

const PRESET_LOGOS = [
  { name: 'None', url: '' },
  { name: 'GitHub', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg' },
  { name: 'Google', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg' },
  { name: 'Instagram', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg' },
  { name: 'X', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/x.svg' },
  { name: 'YouTube', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/youtube.svg' }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [url, setUrl] = useState('');
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot');
  const [dotColor, setDotColor] = useState('#050505');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState('');
  
  // Text Label State
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [showTopText, setShowTopText] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: url || 'DocxForge Studio',
    image: logo,
    dotsOptions: { color: dotColor, type: dotType },
    backgroundOptions: { color: bgColor },
    cornersSquareOptions: { color: dotColor, type: cornerType },
    cornersDotOptions: { color: dotColor, type: cornerDotType },
    imageOptions: { 
      crossOrigin: 'anonymous', 
      margin: 5,
      imageSize: 0.4,
      hideBackgroundDots: true 
    }
  }));

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    qrCode.update({
      data: url || 'DocxForge Studio',
      image: logo,
      dotsOptions: { color: dotColor, type: dotType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: dotColor, type: cornerType },
      cornersDotOptions: { color: dotColor, type: cornerDotType },
      imageOptions: { 
        hideBackgroundDots: !!logo,
        imageSize: 0.4,
        margin: 5
      }
    });
  }, [qrCode, url, dotType, cornerType, cornerDotType, dotColor, bgColor, logo]);

  const onDownload = async (extension: FileExtension) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrSize = 1000;
    const padding = 150;
    const textSpace = 120;
    
    let canvasHeight = qrSize + padding * 2;
    if (showTopText) canvasHeight += textSpace;
    if (showBottomText) canvasHeight += textSpace;

    canvas.width = qrSize + padding * 2;
    canvas.height = canvasHeight;

    // Background
    if (extension !== 'png') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Get QR Image
    const rawQr = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type: 'canvas',
      data: url || 'DocxForge Studio',
      image: logo,
      dotsOptions: { color: dotColor, type: dotType },
      backgroundOptions: { color: extension === 'png' ? 'transparent' : bgColor },
      cornersSquareOptions: { color: dotColor, type: cornerType },
      cornersDotOptions: { color: dotColor, type: cornerDotType },
      imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.4, hideBackgroundDots: true }
    });

    const qrBlob = await rawQr.getRawData('png');
    if (!qrBlob) return;
    
    const qrImg = new Image();
    qrImg.src = URL.createObjectURL(qrBlob);
    
    await new Promise((resolve) => { qrImg.onload = resolve; });

    const qrY = padding + (showTopText ? textSpace : 0);
    ctx.drawImage(qrImg, padding, qrY, qrSize, qrSize);

    // Draw Text
    ctx.fillStyle = dotColor;
    ctx.textAlign = 'center';
    ctx.font = `bold ${fontSize * 3}px 'Space Grotesk', sans-serif`;

    if (showTopText && topText) {
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, padding + textSpace / 2);
    }

    if (showBottomText && bottomText) {
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - padding - textSpace / 4);
    }

    const link = document.createElement('a');
    link.download = `docxforge-qr.${extension}`;
    link.href = canvas.toDataURL(`image/${extension === 'png' ? 'png' : 'jpeg'}`, 1.0);
    link.click();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="studio-container">
      {/* LEFT NAVIGATION */}
      <nav className="studio-nav">
        <div className="nav-item active">
          <Fingerprint size={24} />
          <span style={{ fontSize: '1rem', fontWeight: 800 }}>STUDIO</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
          <LinkIcon size={22} />
          <span>Content Source</span>
        </div>
        <div className={`nav-item ${activeTab === 'design' ? 'active' : ''}`} onClick={() => setActiveTab('design')}>
          <Sparkles size={22} />
          <span>Visual Design</span>
        </div>
        <div className={`nav-item ${activeTab === 'corners' ? 'active' : ''}`} onClick={() => setActiveTab('corners')}>
          <Layout size={22} />
          <span>Anchor Points</span>
        </div>
        <div className={`nav-item ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>
          <ImageIcon size={22} />
          <span>Branding Studio</span>
        </div>
        <div className={`nav-item ${activeTab === 'labels' ? 'active' : ''}`} onClick={() => setActiveTab('labels')}>
          <AlignJustify size={22} />
          <span>Typography</span>
        </div>
        <div className={`nav-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>
          <DownloadCloud size={22} />
          <span>Export Assets</span>
        </div>
        <div style={{ flex: 1 }} />
      </nav>

      {/* CENTER WORKBENCH */}
      <main className="studio-workbench">
        <div className="brand-badge">
          <Monitor size={20} color="var(--accent-neon)" />
          <h1>DOCXFORGE <span style={{ color: 'var(--text-dim)' }}>STUDIO</span></h1>
        </div>

        <div className="qr-stage">
          <div className="qr-frame-glow" />
          <motion.div 
            className="qr-pedestal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1rem',
              background: bgColor,
              width: 'fit-content'
            }}
          >
            {showTopText && topText && (
              <span style={{ 
                color: dotColor, 
                fontWeight: 800, 
                fontFamily: 'var(--font-heading)', 
                fontSize: `clamp(12px, 4vw, ${fontSize}px)`, 
                textTransform: 'uppercase',
                textAlign: 'center',
                wordBreak: 'break-word',
                maxWidth: '280px'
              }}>
                {topText}
              </span>
            )}
            <div ref={qrRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
            {showBottomText && bottomText && (
              <span style={{ 
                color: dotColor, 
                fontWeight: 800, 
                fontFamily: 'var(--font-heading)', 
                fontSize: `clamp(12px, 4vw, ${fontSize}px)`, 
                textTransform: 'uppercase',
                textAlign: 'center',
                wordBreak: 'break-word',
                maxWidth: '280px'
              }}>
                {bottomText}
              </span>
            )}
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          LIVE RENDERING ENGINE v4.0 • COMPOSITION MODE
        </div>
      </main>

      {/* RIGHT SETTINGS DRAWER */}
      <aside className="studio-drawer">
        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Source Content</h2>
                <p>Define the target destination for your QR code.</p>
              </div>
              <div className="panel-section">
                <div className="label-group">Destination URL / Text</div>
                <input 
                  type="text" 
                  className="studio-input"
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Paste link here..."
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div key="design" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Visual Design</h2>
                <p>Customize patterns and the overall theme.</p>
              </div>
              <div className="panel-section">
                <div className="label-group">Body Pattern</div>
                <div className="option-grid">
                  {PATTERNS.map((p) => (
                    <div key={p.id} className={`studio-option ${dotType === p.id ? 'active' : ''}`} onClick={() => setDotType(p.id)}>
                      <div className="pattern-preview" style={{ background: p.preview, width: 24, height: 24 }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Color Palette</div>
                <div className="color-row">
                  <span style={{ fontSize: '0.8rem' }}>Foreground</span>
                  <input type="color" className="color-swatch" value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
                </div>
                <div className="color-row">
                  <span style={{ fontSize: '0.8rem' }}>Background</span>
                  <input type="color" className="color-swatch" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'corners' && (
            <motion.div key="corners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Anchor Points</h2>
                <p>Style the three main corner frames and dots.</p>
              </div>
              <div className="panel-section">
                <div className="label-group">Frame Shape</div>
                <div className="option-grid">
                  {CORNERS.map((c) => (
                    <div key={c.id} className={`studio-option ${cornerType === c.id ? 'active' : ''}`} onClick={() => setCornerType(c.id)}>
                      <div style={{ width: 20, height: 20, border: '2px solid white', borderRadius: c.id === 'extra-rounded' ? '6px' : c.id === 'rounded' ? '3px' : c.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Inner Dot Shape</div>
                <div className="option-grid">
                  {INNER_CORNERS.map((ic) => (
                    <div key={ic.id} className={`studio-option ${cornerDotType === ic.id ? 'active' : ''}`} onClick={() => setCornerDotType(ic.id)}>
                      <div style={{ width: 12, height: 12, background: 'white', borderRadius: ic.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{ic.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Studio Branding</h2>
                <p>Add a signature logo to the center of your QR.</p>
              </div>
              <div className="panel-section">
                <div className="label-group">Quick Presets</div>
                <div className="logo-studio-grid">
                  {PRESET_LOGOS.map((p) => (
                    <div key={p.name} className={`logo-studio-item ${logo === p.url ? 'active' : ''}`} onClick={() => setLogo(p.url)}>
                      {p.url ? <img src={p.url} alt={p.name} /> : <Type size={18} color="#000" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Custom Asset</div>
                <label className="studio-option upload-studio" style={{ width: '100%', flexDirection: 'row' }}>
                  <Upload size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>UPLOAD LOGO</span>
                  <input type="file" hidden onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'labels' && (
            <motion.div key="labels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Typography Studio</h2>
                <p>Add optional text labels to your QR design.</p>
              </div>
              <div className="panel-section">
                <div className="label-group">
                  <input type="checkbox" checked={showTopText} onChange={(e) => setShowTopText(e.target.checked)} />
                  Enable Top Label
                </div>
                {showTopText && (
                  <input 
                    type="text" 
                    className="studio-input"
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)} 
                    placeholder="Enter top text..."
                  />
                )}
              </div>
              <div className="panel-section">
                <div className="label-group">
                  <input type="checkbox" checked={showBottomText} onChange={(e) => setShowBottomText(e.target.checked)} />
                  Enable Bottom Label
                </div>
                {showBottomText && (
                  <input 
                    type="text" 
                    className="studio-input"
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)} 
                    placeholder="Enter bottom text..."
                  />
                )}
              </div>
              <div className="panel-section">
                <div className="label-group">Font Size: {fontSize}px</div>
                <input 
                  type="range" 
                  min="12" 
                  max="48" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-neon)' }}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div key="export" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header">
                <h2>Export Assets</h2>
                <p>Download your design in high-resolution formats.</p>
              </div>
              <div className="export-stack">
                <button className="btn-premium btn-primary" onClick={() => onDownload('png')}>
                  <Download size={18} /> PNG (TRANSPARENT)
                </button>
                <button className="btn-premium btn-ghost" onClick={() => onDownload('jpeg')}>
                  <ImageIcon size={18} /> JPEG (SOLID)
                </button>
                <button className="btn-premium btn-ghost" onClick={() => onDownload('svg')}>
                  <Box size={18} /> VECTOR SVG (QR ONLY)
                </button>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--accent-neon)', margin: 0, lineHeight: 1.5 }}>
                  Composition rendering active. PNG/JPEG exports include your custom text and branding.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

export default App;
