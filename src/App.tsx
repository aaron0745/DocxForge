import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeStyling, {
  type DrawType,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type FileExtension,
  type ErrorCorrectionLevel
} from 'qr-code-styling';
import { 
  Upload, Image as ImageIcon, Layout, Sparkles, Link as LinkIcon, Box, Monitor, Fingerprint, DownloadCloud,
  AlignJustify, ChevronDown, Wifi, Grid, User, MessageCircle, Calendar, RotateCcw
} from 'lucide-react';
import './App.css';

type Tab = 'content' | 'design' | 'corners' | 'branding' | 'labels' | 'export' | 'templates';
type FrameStyle = 'none' | 'pill' | 'glass' | 'tech' | 'dashed' | 'outline' | 'ribbon' | 'brutal' | 'chat' | 'banner';
type ContentType = 'url' | 'wifi' | 'email' | 'vcard' | 'whatsapp' | 'event';
type LogoShape = 'original' | 'circle' | 'square';
type LogoFilter = 'none' | 'grayscale' | 'gold' | 'neon' | 'ghost';

// Template Preview Component
const TemplateThumbnail = ({ config }: { config: any }) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (thumbRef.current) {
        thumbRef.current.innerHTML = '';
        const qr = new QRCodeStyling({
          width: 60, height: 60, type: 'svg', data: 'DOCX',
          dotsOptions: { 
            type: config.dotType, 
            color: config.useGradient ? undefined : config.dotColor1,
            gradient: config.useGradient ? {
              type: 'linear',
              colorStops: [{ offset: 0, color: config.dotColor1 }, { offset: 1, color: config.dotColor2 || config.dotColor1 }]
            } : undefined
          },
          backgroundOptions: { color: config.bgColor || 'transparent' },
          cornersSquareOptions: { type: config.cornerType, color: config.cornerColor || config.dotColor1 },
          cornersDotOptions: { type: config.cornerDotType || 'dot', color: config.cornerDotColor || config.dotColor1 }
        });
        qr.append(thumbRef.current);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [config]);
  return <div className="template-qr-container" ref={thumbRef} style={{ background: config.bgColor }} />;
};

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

const FONT_GROUPS = [
  { category: 'Sans-Serif', fonts: [{ name: 'Inter', value: "'Inter', sans-serif" }, { name: 'Poppins', value: "'Poppins', sans-serif" }, { name: 'Montserrat', value: "'Montserrat', sans-serif" }, { name: 'Outfit', value: "'Outfit', sans-serif" }, { name: 'Plus Jakarta', value: "'Plus Jakarta Sans', sans-serif" }, { name: 'Roboto', value: "'Roboto', sans-serif" }, { name: 'Open Sans', value: "'Open Sans', sans-serif" }, { name: 'Lato', value: "'Lato', sans-serif" }, { name: 'Ubuntu', value: "'Ubuntu', sans-serif" }, { name: 'Raleway', value: "'Raleway', sans-serif" }] },
  { category: 'Display & Bold', fonts: [{ name: 'Bebas Neue', value: "'Bebas Neue', cursive" }, { name: 'Anton', value: "'Anton', sans-serif" }, { name: 'Bangers', value: "'Bangers', cursive" }, { name: 'Titan One', value: "'Titan One', cursive" }, { name: 'Righteous', value: "'Righteous', cursive" }, { name: 'Oswald', value: "'Oswald', sans-serif" }, { name: 'Kanit', value: "'Kanit', sans-serif" }] },
  { category: 'Serif & Elegant', fonts: [{ name: 'Playfair Display', value: "'Playfair Display', serif" }, { name: 'Lora', value: "'Lora', serif" }, { name: 'Merriweather', value: "'Merriweather', serif" }, { name: 'Crimson Text', value: "'Crimson Text', serif" }, { name: 'Abril Fatface', value: "'Abril Fatface', cursive" }] },
  { category: 'Script & Decorative', fonts: [{ name: 'Great Vibes', value: "'Great Vibes', cursive" }, { name: 'Sacramento', value: "'Sacramento', cursive" }, { name: 'Pacifico', value: "'Pacifico', cursive" }, { name: 'Dancing Script', value: "'Dancing Script', cursive" }, { name: 'Caveat', value: "'Caveat', cursive" }, { name: 'Satisfy', value: "'Satisfy', cursive" }, { name: 'Lobster', value: "'Lobster', cursive" }, { name: 'Yellowtail', value: "'Yellowtail', cursive" }, { name: 'Cookie', value: "'Cookie', cursive" }] },
  { category: 'Technical & Mono', fonts: [{ name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" }, { name: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" }, { name: 'Fira Code', value: "'Fira Code', monospace" }, { name: 'Inconsolata', value: "'Inconsolata', monospace" }, { name: 'Source Code Pro', value: "'Source Code Pro', monospace" }, { name: 'Share Tech Mono', value: "'Share Tech Mono', monospace" }, { name: 'Major Mono', value: "'Major Mono Display', monospace" }, { name: 'VT323', value: "'VT323', monospace" }, { name: 'Courier Prime', value: "'Courier Prime', monospace" }] }
];

const FRAME_STYLES: { id: FrameStyle; label: string }[] = [
  { id: 'none', label: 'None' }, { id: 'pill', label: 'Pill' }, { id: 'glass', label: 'Glass' }, { id: 'tech', label: 'Cyber' }, { id: 'brutal', label: 'Brutal' }, { id: 'ribbon', label: 'Ribbon' }, { id: 'chat', label: 'Bubble' }, { id: 'banner', label: 'Banner' }, { id: 'dashed', label: 'Dashed' }, { id: 'outline', label: 'Outline' }
];

const PRESET_LOGOS = [
  { name: 'None', url: '' },
  { name: 'GitHub', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg' },
  { name: 'Google', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg' },
  { name: 'Instagram', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg' },
  { name: 'X', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/x.svg' },
  { name: 'YouTube', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/youtube.svg' }
];

const TEMPLATES = [
  { name: 'Neo Matrix', dotType: 'square', cornerType: 'square', cornerDotType: 'square', dotColor1: '#00ff41', bgColor: '#000000', cornerColor: '#00ff41', cornerDotColor: '#00ff41', frameStyle: 'tech', fontFamily: "'JetBrains Mono', monospace" },
  { name: 'Synthwave', dotType: 'dots', cornerType: 'dot', cornerDotType: 'dot', dotColor1: '#ff00ff', dotColor2: '#38bdf8', useGradient: true, bgColor: '#050505', cornerColor: '#ff00ff', cornerDotColor: '#38bdf8', frameStyle: 'glass', fontFamily: "'Righteous', cursive" },
  { name: 'Royalty', dotType: 'classy', cornerType: 'extra-rounded', cornerDotType: 'dot', dotColor1: '#d4af37', bgColor: '#1a1a1a', cornerColor: '#d4af37', cornerDotColor: '#d4af37', frameStyle: 'ribbon', fontFamily: "'Playfair Display', serif" },
  { name: 'Electric Sunset', dotType: 'rounded', cornerType: 'extra-rounded', cornerDotType: 'dot', dotColor1: '#f97316', dotColor2: '#ec4899', useGradient: true, bgColor: '#ffffff', cornerColor: '#f97316', cornerDotColor: '#ec4899', frameStyle: 'banner', fontFamily: "'Anton', sans-serif" },
  { name: 'Ocean Breeze', dotType: 'rounded', cornerType: 'dot', cornerDotType: 'dot', dotColor1: '#0ea5e9', dotColor2: '#6366f1', useGradient: true, bgColor: '#f0f9ff', cornerColor: '#0ea5e9', cornerDotColor: '#6366f1', frameStyle: 'pill', fontFamily: "'Outfit', sans-serif" },
  { name: 'Blood Diamond', dotType: 'square', cornerType: 'extra-rounded', cornerDotType: 'square', dotColor1: '#ef4444', bgColor: '#000000', cornerColor: '#ef4444', cornerDotColor: '#ffffff', frameStyle: 'brutal', fontFamily: "'Bebas Neue', cursive" },
  { name: 'Terminal Pro', dotType: 'square', cornerType: 'square', cornerDotType: 'square', dotColor1: '#22c55e', bgColor: '#0a0a0a', cornerColor: '#22c55e', cornerDotColor: '#22c55e', frameStyle: 'tech', fontFamily: "'VT323', monospace" },
  { name: 'Paperback', dotType: 'classy', cornerType: 'extra-rounded', cornerDotType: 'dot', dotColor1: '#18181b', bgColor: '#f5f5f4', cornerColor: '#18181b', cornerDotColor: '#18181b', frameStyle: 'outline', fontFamily: "'Lora', serif" },
  { name: 'Cyber Pink', dotType: 'dots', cornerType: 'extra-rounded', cornerDotType: 'dot', dotColor1: '#f472b6', dotColor2: '#a855f7', useGradient: true, bgColor: '#1e1b4b', cornerColor: '#f472b6', cornerDotColor: '#a855f7', frameStyle: 'glass', fontFamily: "'Righteous', cursive" },
  { name: 'Gold Marble', dotType: 'classy-rounded', cornerType: 'extra-rounded', cornerDotType: 'dot', dotColor1: '#fbbf24', dotColor2: '#d97706', useGradient: true, bgColor: '#ffffff', cornerColor: '#fbbf24', cornerDotColor: '#d97706', frameStyle: 'banner', fontFamily: "'Playfair Display', serif" }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  
  // Design State
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('dot');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotColor1, setDotColor1] = useState('#050505');
  const [dotColor2, setDotColor2] = useState('#050505');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType] = useState<'linear' | 'radial'>('linear');
  const [cornerColor, setCornerColor] = useState('#050505');
  const [cornerDotColor, setCornerDotColor] = useState('#050505');
  
  // Content State
  const [contentType, setContentType] = useState<ContentType>('url');
  const [url, setUrl] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [evName, setEvName] = useState('');
  const [evLoc, setEvLoc] = useState('');
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMsg, setWaMsg] = useState('');
  
  // Advanced State
  const [ecc] = useState<ErrorCorrectionLevel>('Q');
  const [logo, setLogo] = useState('');
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin] = useState(5);
  const [logoShape, setLogoShape] = useState<LogoShape>('original');
  const [logoFilter, setLogoFilter] = useState<LogoFilter>('none');
  
  // Typography State
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [showTopText, setShowTopText] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState<string>('24');
  const [fontFamily, setFontFamily] = useState(FONT_GROUPS[0].fonts[0].value);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [openFontGroup, setOpenFontGroup] = useState<string | null>(FONT_GROUPS[0].category);
  
  const effectiveFontSize = Math.min(100, Math.max(8, parseInt(fontSizeInput) || 8));
  const qrRef = useRef<HTMLDivElement>(null);
  
  const getQrData = () => {
    if (contentType === 'wifi') return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    if (contentType === 'event') return `BEGIN:VEVENT\nSUMMARY:${evName}\nLOCATION:${evLoc}\nEND:VEVENT`;
    if (contentType === 'vcard') return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nTEL:${vcardPhone}\nEND:VCARD`;
    if (contentType === 'whatsapp') return `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;
    return url || 'DocxForge Studio';
  };

  const resetAll = () => {
    if (confirm('Reset entire design?')) {
      setLogo(''); setUrl(''); setTopText(''); setBottomText(''); setShowTopText(false); setShowBottomText(false);
      setDotType('rounded'); setCornerType('extra-rounded'); setCornerDotType('dot');
      setDotColor1('#050505'); setDotColor2('#050505'); setUseGradient(false);
      setBgColor('#ffffff'); setCornerColor('#050505'); setCornerDotColor('#050505');
      setFrameStyle('none'); setFontFamily(FONT_GROUPS[0].fonts[0].value);
      setLogoFilter('none');
    }
  };

  const applyTemplate = (t: any) => {
    setDotType(t.dotType); setCornerType(t.cornerType); setCornerDotType(t.cornerDotType || 'dot');
    setDotColor1(t.dotColor1); setBgColor(t.bgColor); setCornerColor(t.cornerColor || t.dotColor1);
    setCornerDotColor(t.cornerDotColor || t.dotColor1); setFrameStyle(t.frameStyle); setFontFamily(t.fontFamily);
    if (t.useGradient) { setUseGradient(true); setDotColor2(t.dotColor2 || t.dotColor1); }
    else { setUseGradient(false); setDotColor2(t.dotColor1); }
  };

  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling({
    width: 300, height: 300, type: 'svg' as DrawType,
    data: getQrData(), image: logo,
    dotsOptions: { color: dotColor1, type: dotType },
    backgroundOptions: { color: 'transparent' },
    cornersSquareOptions: { color: cornerColor, type: cornerType },
    cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
    imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize, hideBackgroundDots: true }
  }));

  useEffect(() => { if (qrRef.current) { qrRef.current.innerHTML = ''; qrCode.append(qrRef.current); } }, [qrCode]);

  useEffect(() => {
    const dotsOptions: any = { 
      type: dotType,
      color: useGradient ? undefined : dotColor1,
      gradient: useGradient ? {
        type: gradientType,
        colorStops: [{ offset: 0, color: dotColor1 }, { offset: 1, color: dotColor2 }]
      } : undefined
    };
    qrCode.update({
      data: getQrData(), image: logo, dotsOptions, backgroundOptions: { color: 'transparent' },
      cornersSquareOptions: { color: cornerColor, type: cornerType },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
      qrOptions: { errorCorrectionLevel: ecc },
      imageOptions: { hideBackgroundDots: !!logo, imageSize: logoSize, margin: logoMargin }
    });
  }, [qrCode, url, wifiSsid, wifiPass, vcardName, waPhone, waMsg, evName, contentType, dotType, cornerType, cornerDotType, dotColor1, dotColor2, useGradient, gradientType, bgColor, cornerColor, cornerDotColor, logo, logoSize, logoMargin, ecc]);

  const onDownload = async (extension: FileExtension, withBg: boolean) => {
    if (extension === 'svg') {
      qrCode.download({ name: 'docxforge-qr', extension: 'svg' });
      return;
    }

    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const qrSize = 1000; const padding = withBg ? 200 : 50; const textSpace = 250;
    let canvasHeight = qrSize + padding * 2; if (withBg) { if (showTopText) canvasHeight += textSpace; if (showBottomText) canvasHeight += textSpace; }
    canvas.width = qrSize + padding * 2; canvas.height = canvasHeight;
    if (withBg) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); } else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
    const dotsOptions: any = { type: dotType, color: useGradient ? undefined : dotColor1, gradient: useGradient ? { type: gradientType, colorStops: [{ offset: 0, color: dotColor1 }, { offset: 1, color: dotColor2 }] } : undefined };
    const rawQr = new QRCodeStyling({ width: qrSize, height: qrSize, type: 'canvas', data: getQrData(), image: logo, dotsOptions, backgroundOptions: { color: 'transparent' }, cornersSquareOptions: { color: cornerColor, type: cornerType }, cornersDotOptions: { color: cornerDotColor, type: cornerDotType }, imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize, hideBackgroundDots: true }, qrOptions: { errorCorrectionLevel: ecc } });
    const qrBlob = await rawQr.getRawData('png'); if (!qrBlob) return;
    const qrImg = new Image(); qrImg.src = URL.createObjectURL(qrBlob); await new Promise((res) => { qrImg.onload = res; });
    const qrY = padding + (withBg && showTopText ? textSpace : 0); ctx.drawImage(qrImg, padding, qrY, qrSize, qrSize);
    if (withBg) {
      ctx.font = `bold ${effectiveFontSize * 3}px ${fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const drawFrame = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, style: FrameStyle) => {
        ctx.save(); ctx.beginPath();
        const padW = 50; const padH = 20; const fullW = w + padW * 2; const fullH = h + padH * 2;
        if (style === 'pill') { ctx.roundRect(x - fullW / 2, y - fullH / 2, fullW, fullH, [fullH / 2]); ctx.fillStyle = dotColor1; ctx.fill(); ctx.fillStyle = bgColor; }
        else if (style === 'brutal') { ctx.fillStyle = dotColor1; ctx.fillRect(x - fullW / 2 + 15, y - fullH / 2 + 15, fullW, fullH); ctx.fillStyle = bgColor; ctx.fillRect(x - fullW / 2, y - fullH / 2, fullW, fullH); ctx.strokeStyle = dotColor1; ctx.lineWidth = 6; ctx.strokeRect(x - fullW / 2, y - fullH / 2, fullW, fullH); ctx.fillStyle = dotColor1; }
        else if (style === 'tech') { const cut = 20; ctx.moveTo(x - fullW / 2 + cut, y - fullH / 2); ctx.lineTo(x + fullW / 2 - cut, y - fullH / 2); ctx.lineTo(x + fullW / 2, y - fullH / 2 + cut); ctx.lineTo(x + fullW / 2, y + fullH / 2 - cut); ctx.lineTo(x + fullW / 2 - cut, y + fullH / 2); ctx.lineTo(x - fullW / 2 + cut, y + fullH / 2); ctx.lineTo(x - fullW / 2, y + fullH / 2 - cut); ctx.lineTo(x - fullW / 2, y - fullH / 2 + cut); ctx.closePath(); ctx.fillStyle = dotColor1; ctx.fill(); ctx.fillStyle = bgColor; }
        else if (style === 'ribbon') { const notch = 30; ctx.moveTo(x - fullW / 2, y - fullH / 2); ctx.lineTo(x + fullW / 2, y - fullH / 2); ctx.lineTo(x + fullW / 2 - notch, y); ctx.lineTo(x + fullW / 2, y + fullH / 2); ctx.lineTo(x - fullW / 2, y + fullH / 2); ctx.lineTo(x - fullW / 2 + notch, y); ctx.closePath(); ctx.fillStyle = dotColor1; ctx.fill(); ctx.fillStyle = bgColor; }
        else if (style === 'banner') { const slant = 40; ctx.moveTo(x - fullW / 2 - slant, y - fullH / 2); ctx.lineTo(x + fullW / 2 + slant, y - fullH / 2); ctx.lineTo(x + fullW / 2, y + fullH / 2); ctx.lineTo(x - fullW / 2, y + fullH / 2); ctx.closePath(); ctx.fillStyle = dotColor1; ctx.fill(); ctx.fillStyle = bgColor; }
        else if (style === 'chat') { ctx.roundRect(x - fullW / 2, y - fullH / 2, fullW, fullH, [15]); ctx.moveTo(x - 15, y + fullH / 2); ctx.lineTo(x, y + fullH / 2 + 20); ctx.lineTo(x + 15, y + fullH / 2); ctx.fillStyle = dotColor1; ctx.fill(); ctx.fillStyle = bgColor; }
        else if (style === 'glass') { ctx.roundRect(x - fullW / 2, y - fullH / 2, fullW, fullH, [15]); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill(); ctx.strokeStyle = dotColor1; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = dotColor1; }
        else if (style === 'outline') { ctx.strokeStyle = dotColor1; ctx.lineWidth = 4; ctx.strokeRect(x - fullW / 2, y - fullH / 2, fullW, fullH); ctx.fillStyle = dotColor1; }
        else if (style === 'dashed') { ctx.setLineDash([15, 10]); ctx.strokeStyle = dotColor1; ctx.lineWidth = 4; ctx.strokeRect(x - fullW / 2, y - fullH / 2, fullW, fullH); ctx.fillStyle = dotColor1; }
        else { ctx.fillStyle = dotColor1; }
        ctx.restore();
      };
      if (showTopText && topText) { const m = ctx.measureText(topText.toUpperCase()); drawFrame(ctx, canvas.width / 2, padding + textSpace / 2, m.width, effectiveFontSize * 3, frameStyle); ctx.fillText(topText.toUpperCase(), canvas.width / 2, padding + textSpace / 2); }
      if (showBottomText && bottomText) { const m = ctx.measureText(bottomText.toUpperCase()); drawFrame(ctx, canvas.width / 2, canvas.height - padding - textSpace / 2, m.width, effectiveFontSize * 3, frameStyle); ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - padding - textSpace / 2); }
    }
    const link = document.createElement('a'); link.download = `docxforge-qr.${extension}`;
    link.href = canvas.toDataURL(extension === 'png' ? 'image/png' : 'image/jpeg', 1.0); link.click();
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') { e.preventDefault(); onDownload('png', true); }
        if (e.key === 'e') { e.preventDefault(); setActiveTab('export'); }
        if (e.key === 'b') { e.preventDefault(); setActiveTab('branding'); }
      }
      if (e.key === 'Escape') { e.preventDefault(); resetAll(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dotType, cornerType, dotColor1, dotColor2, useGradient, bgColor, logo, logoFilter, logoShape, logoSize, frameStyle, fontFamily, topText, bottomText, showTopText, showBottomText]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogo(ev.target?.result as string); reader.readAsDataURL(file); }
  };

  const handleFontSizeBlur = () => {
    let val = parseInt(fontSizeInput);
    if (isNaN(val) || val < 8) val = 8; if (val > 100) val = 100;
    setFontSizeInput(val.toString());
  };

  const renderPreviewText = (text: string) => {
    const isSolid = ['pill', 'tech', 'ribbon', 'chat', 'banner'].includes(frameStyle);
    const isBrutal = frameStyle === 'brutal';
    return (
      <div className={`cta-frame style-${frameStyle}`} style={{
        background: isBrutal ? bgColor : (isSolid ? dotColor1 : frameStyle === 'glass' ? 'rgba(255,255,255,0.15)' : 'transparent'),
        border: ['outline', 'glass', 'brutal'].includes(frameStyle) ? `3px solid ${dotColor1}` : frameStyle === 'dashed' ? `3px dashed ${dotColor1}` : 'none',
        boxShadow: isBrutal ? `10px 10px 0 ${dotColor1}` : 'none',
        color: isBrutal ? dotColor1 : (isSolid ? bgColor : dotColor1),
        fontFamily: fontFamily, fontSize: `clamp(12px, 4vw, ${effectiveFontSize}px)`,
        padding: '12px 35px', fontWeight: 800, textTransform: 'uppercase'
      }}>{text}</div>
    );
  };

  const renderFrameIcon = (id: FrameStyle) => {
    if (id === 'none') return <Box size={20} />;
    if (id === 'pill') return <div style={{ width: 30, height: 15, background: 'white', borderRadius: 15 }} />;
    if (id === 'outline') return <div style={{ width: 30, height: 15, border: '2px solid white', borderRadius: 4 }} />;
    if (id === 'dashed') return <div style={{ width: 30, height: 15, border: '2px dashed white', borderRadius: 4 }} />;
    if (id === 'brutal') return <div style={{ width: 30, height: 15, border: '2.5px solid white', boxShadow: '4px 4px 0 white' }} />;
    if (id === 'tech') return <div style={{ width: 30, height: 15, border: '2px solid white', clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }} />;
    if (id === 'ribbon') return <div style={{ width: 35, height: 15, background: 'white', clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%)' }} />;
    if (id === 'banner') return <div style={{ width: 35, height: 15, background: 'white', clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }} />;
    if (id === 'chat') return <div style={{ width: 30, height: 15, background: 'white', borderRadius: '4px 4px 4px 0' }} />;
    if (id === 'glass') return <div style={{ width: 30, height: 15, border: '1px solid white', background: 'rgba(255,255,255,0.2)' }} />;
    return <Box size={20} />;
  };

  return (
    <div className="studio-container">
      <nav className="studio-nav">
        <div className="nav-item active"><Fingerprint size={24} /><span>STUDIO</span></div>
        <div style={{ flex: 1 }} />
        <div className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}><Grid size={22} /><span>Presets</span></div>
        <div className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}><LinkIcon size={22} /><span>Content</span></div>
        <div className={`nav-item ${activeTab === 'design' ? 'active' : ''}`} onClick={() => setActiveTab('design')}><Sparkles size={22} /><span>Design</span></div>
        <div className={`nav-item ${activeTab === 'corners' ? 'active' : ''}`} onClick={() => setActiveTab('corners')}><Layout size={22} /><span>Anchors</span></div>
        <div className={`nav-item ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}><ImageIcon size={22} /><span>Branding</span></div>
        <div className={`nav-item ${activeTab === 'labels' ? 'active' : ''}`} onClick={() => setActiveTab('labels')}><AlignJustify size={22} /><span>Typography</span></div>
        <div className={`nav-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}><DownloadCloud size={22} /><span>Export</span></div>
        <div style={{ flex: 1 }} />
      </nav>

      <main className="studio-workbench">
        <div className="brand-badge"><Monitor size={20} color="var(--accent-neon)" /><h1>DOCXFORGE STUDIO</h1></div>
        <div className="qr-stage">
          <div className="qr-frame-glow" />
          <motion.div className="qr-pedestal" layoutId="pedestal" transition={{ type: 'spring', damping: 20 }} style={{ background: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {showTopText && topText && renderPreviewText(topText)}
            <div ref={qrRef} className={`filter-${logoFilter}`} style={{ padding: '0.5rem', borderRadius: logoShape === 'circle' ? '50%' : (logoShape === 'square' ? '12px' : '0') }} />
            {showBottomText && bottomText && renderPreviewText(bottomText)}
          </motion.div>
        </div>
        <div style={{ marginTop: '2rem' }}><button className="btn-premium btn-ghost" onClick={resetAll} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)' }}><RotateCcw size={16} /> RESET STUDIO</button></div>
        <div style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>ENGINE v1.2.0 • PROFESSIONAL EDITION</div>
      </main>

      <aside className="studio-drawer">
        <AnimatePresence mode="wait">
          {activeTab === 'templates' && (
            <motion.div key="templates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Presets</h2><p>Live QR previews.</p></div>
              <div className="option-grid">{TEMPLATES.map(t => (<div key={t.name} className="studio-option template-card" onClick={() => applyTemplate(t)}><TemplateThumbnail config={t} /><span>{t.name}</span></div>))}</div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Branding</h2><p>Logo filters & shapes.</p></div>
              <div className="panel-section">
                <div className="label-group">Filters</div>
                <div className="option-grid">
                  {['none', 'grayscale', 'gold', 'neon', 'ghost'].map(f => (
                    <button key={f} className={`studio-option ${logoFilter === f ? 'active' : ''}`} onClick={() => setLogoFilter(f as LogoFilter)} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Logo Shape</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['original', 'circle', 'square'].map(s => (<button key={s} className={`studio-option ${logoShape === s ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setLogoShape(s as LogoShape)}>{s.toUpperCase()}</button>))}
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Logo Gallery</div>
                <div className="logo-studio-grid">
                  {PRESET_LOGOS.map(p => (
                    <div key={p.name} className={`logo-studio-item ${logo === p.url ? 'active' : ''}`} onClick={() => setLogo(p.url)}>
                      {p.url ? <img src={p.url} alt={p.name} /> : <ImageIcon size={18} color="#000" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-section"><label className="studio-option upload-studio" style={{ flexDirection: 'row' }}><Upload size={18} /><span>UPLOAD LOGO</span><input type="file" hidden onChange={handleLogoUpload} accept="image/*" /></label></div>
              <div className="panel-section"><div className="label-group">Logo Size</div><input type="range" min="20" max="50" value={logoSize * 100} onChange={(e) => setLogoSize(parseInt(e.target.value) / 100)} style={{ width: '100%', accentColor: 'var(--accent-neon)' }} /></div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div key="export" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Export Matrix</h2><p>High-res branded assets.</p></div>
              <div className="export-stack">
                <div className="label-group">PNG (Lossless)</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-premium btn-primary" style={{ flex: 1 }} onClick={() => onDownload('png', true)}>SOLID</button>
                  <button className="btn-premium btn-ghost" style={{ flex: 1 }} onClick={() => onDownload('png', false)}>TRANS</button>
                </div>
                <div className="label-group" style={{ marginTop: '1rem' }}>JPEG (Optimized)</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-premium btn-ghost" style={{ flex: 1 }} onClick={() => onDownload('jpeg', true)}>SOLID</button>
                  <button className="btn-premium btn-ghost" style={{ flex: 1 }} onClick={() => onDownload('jpeg', false)}>MINIMAL</button>
                </div>
                <div className="label-group" style={{ marginTop: '1rem' }}>Vector</div>
                <button className="btn-premium btn-ghost" onClick={() => onDownload('svg', false)}>SVG (Standard)</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Content</h2></div>
              <div className="panel-section">
                <div className="option-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <button className={`studio-option ${contentType === 'url' ? 'active' : ''}`} onClick={() => setContentType('url')}><LinkIcon size={14} /> URL</button>
                  <button className={`studio-option ${contentType === 'wifi' ? 'active' : ''}`} onClick={() => setContentType('wifi')}><Wifi size={14} /> WIFI</button>
                  <button className={`studio-option ${contentType === 'event' ? 'active' : ''}`} onClick={() => setContentType('event')}><Calendar size={14} /> EVENT</button>
                  <button className={`studio-option ${contentType === 'vcard' ? 'active' : ''}`} onClick={() => setContentType('vcard')}><User size={14} /> VCARD</button>
                  <button className={`studio-option ${contentType === 'whatsapp' ? 'active' : ''}`} onClick={() => setContentType('whatsapp')}><MessageCircle size={14} /> WA</button>
                </div>
                {contentType === 'url' && <input type="text" className="studio-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />}
                {contentType === 'wifi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" className="studio-input" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="SSID" />
                    <input type="text" className="studio-input" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder="Password" />
                  </div>
                )}
                {contentType === 'event' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" className="studio-input" value={evName} onChange={(e) => setEvName(e.target.value)} placeholder="Event Name" />
                    <input type="text" className="studio-input" value={evLoc} onChange={(e) => setEvLoc(e.target.value)} placeholder="Location" />
                  </div>
                )}
                {contentType === 'vcard' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" className="studio-input" value={vcardName} onChange={(e) => setVcardName(e.target.value)} placeholder="Name" />
                    <input type="text" className="studio-input" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} placeholder="Phone" />
                  </div>
                )}
                {contentType === 'whatsapp' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" className="studio-input" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} placeholder="Phone" />
                    <input type="text" className="studio-input" value={waMsg} onChange={(e) => setWaMsg(e.target.value)} placeholder="Message" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div key="design" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Design</h2></div>
              <div className="panel-section">
                <div className="label-group">Pattern</div>
                <div className="option-grid">{PATTERNS.map(p => (<div key={p.id} className={`studio-option ${dotType === p.id ? 'active' : ''}`} onClick={() => setDotType(p.id)}><div style={{ background: p.preview, width: 20, height: 20 }} /><span>{p.label}</span></div>))}</div>
              </div>
              <div className="panel-section">
                <div className="label-group">Color Profile</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button className={`studio-option ${!useGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseGradient(false)}>Solid</button>
                  <button className={`studio-option ${useGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseGradient(true)}>Gradient</button>
                </div>
                <div className="color-row"><span>Start</span><input type="color" className="color-swatch" value={dotColor1} onChange={(e) => setDotColor1(e.target.value)} /></div>
                {useGradient && <div className="color-row" style={{ marginTop: '0.5rem' }}><span>End</span><input type="color" className="color-swatch" value={dotColor2} onChange={(e) => setDotColor2(e.target.value)} /></div>}
              </div>
              <div className="panel-section"><div className="color-row"><span>BG</span><input type="color" className="color-swatch" value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div></div>
            </motion.div>
          )}

          {activeTab === 'corners' && (
            <motion.div key="corners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Anchors</h2></div>
              <div className="panel-section">
                <div className="label-group">Frame</div>
                <div className="option-grid">
                  {CORNERS.map(c => (
                    <div key={c.id} className={`studio-option ${cornerType === c.id ? 'active' : ''}`} onClick={() => setCornerType(c.id)}>
                      <div style={{ width: 30, height: 30, border: '3px solid white', borderRadius: c.id === 'extra-rounded' ? '10px' : c.id === 'rounded' ? '6px' : c.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <div className="color-row" style={{ marginTop: '0.5rem' }}><span>Frame Color</span><input type="color" className="color-swatch" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} /></div>
              </div>
              <div className="panel-section">
                <div className="label-group">Inner</div>
                <div className="option-grid">
                  {INNER_CORNERS.map(ic => (
                    <div key={ic.id} className={`studio-option ${cornerDotType === ic.id ? 'active' : ''}`} onClick={() => setCornerDotType(ic.id)}>
                      <div style={{ width: 16, height: 16, background: 'white', borderRadius: ic.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{ic.label}</span>
                    </div>
                  ))}
                </div>
                <div className="color-row" style={{ marginTop: '0.5rem' }}><span>Dot Color</span><input type="color" className="color-swatch" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} /></div>
              </div>
            </motion.div>
          )}

          {activeTab === 'labels' && (
            <motion.div key="labels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Typography</h2></div>
              <div className="panel-section">
                <div className="label-group">Enable Panels</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`studio-option ${showTopText ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setShowTopText(!showTopText)}>TOP</button>
                  <button className={`studio-option ${showBottomText ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setShowBottomText(!showBottomText)}>BOTTOM</button>
                </div>
              </div>
              {(showTopText || showBottomText) && (
                <>
                  <div className="panel-section">
                    <div className="label-group">Frame Style Gallery</div>
                    <div className="option-grid">
                      {FRAME_STYLES.map(s => (
                        <div key={s.id} className={`studio-option ${frameStyle === s.id ? 'active' : ''}`} onClick={() => setFrameStyle(s.id)}>
                          {renderFrameIcon(s.id)}
                          <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="panel-section">
                    <div className="label-group">Content</div>
                    {showTopText && <input type="text" className="studio-input" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="TOP TEXT..." />}
                    {showBottomText && <input type="text" className="studio-input" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="BOTTOM TEXT..." />}
                  </div>
                  <div className="panel-section">
                    <div className="label-group">Font Size (8-100 px)</div>
                    <input type="text" className="studio-input" value={fontSizeInput} onChange={(e) => setFontSizeInput(e.target.value.replace(/[^0-9]/g, ''))} onBlur={handleFontSizeBlur} placeholder="Size..." />
                  </div>
                  <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {FONT_GROUPS.map(group => (
                      <div key={group.category}>
                        <div className={`font-tab-header ${openFontGroup === group.category ? 'active' : ''}`} onClick={() => setOpenFontGroup(openFontGroup === group.category ? null : group.category)}>
                          <span>{group.category}</span><ChevronDown size={18} />
                        </div>
                        <AnimatePresence>
                          {openFontGroup === group.category && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                              <div className="font-grid-container">
                                <div className="option-grid">
                                  {group.fonts.map(f => (
                                    <div key={f.name} className={`studio-option ${fontFamily === f.value ? 'active' : ''}`} style={{ fontFamily: f.value, padding: '0.75rem' }} onClick={() => setFontFamily(f.value)}>
                                      <span style={{ fontSize: '0.65rem' }}>{f.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

export default App;
