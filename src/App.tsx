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
  Upload, Link as LinkIcon, Box, RotateCcw, ChevronDown, Wifi, User, MessageCircle, Calendar
} from 'lucide-react';
import './App.css';

import {
  type Tab, type FrameStyle, type ContentType, type LogoFilter, type EnhancedDotType, type LogoColorMode,
  PATTERNS, CORNERS, INNER_CORNERS, FONT_GROUPS, FRAME_STYLES, PRESET_LOGOS, TEMPLATES, SVG_PATHS
} from './constants/appConstants';
import Layout from './components/Layout';

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
            type: config.dotType as DotType, 
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

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  
  // Design State
  const [dotType, setDotType] = useState<EnhancedDotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType | 'hexagon'>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType | 'hexagon'>('dot');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#ffffff');
  const [useBgGradient, setUseBgGradient] = useState(false);
  const [dotColor1, setDotColor1] = useState('#050505');
  const [dotColor2, setDotColor2] = useState('#050505');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType] = useState<'linear' | 'radial'>('linear');
  const [cornerColor, setCornerColor] = useState('#050505');
  const [cornerColor2, setCornerColor2] = useState('#050505');
  const [useCornerGradient, setUseCornerGradient] = useState(false);
  const [cornerDotColor, setCornerDotColor] = useState('#050505');
  const [cornerDotColor2, setCornerDotColor2] = useState('#050505');
  const [useCornerDotGradient, setUseCornerDotGradient] = useState(false);
  
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
  const [logoFilter, setLogoFilter] = useState<LogoFilter>('none');
  const [logoColorMode, setLogoColorMode] = useState<LogoColorMode>('original');
  const [processedLogo, setProcessedLogo] = useState('');
  
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

  const clearPreset = () => {
    setDotType('rounded'); setCornerType('extra-rounded'); setCornerDotType('dot');
    setDotColor1('#050505'); setDotColor2('#050505'); setUseGradient(false);
    setBgColor('#ffffff'); setBgColor2('#ffffff'); setUseBgGradient(false);
    setCornerColor('#050505'); setCornerColor2('#050505'); setUseCornerGradient(false);
    setCornerDotColor('#050505'); setCornerDotColor2('#050505'); setUseCornerDotGradient(false);
    setFrameStyle('none'); setFontFamily(FONT_GROUPS[0].fonts[0].value);
  };

  const resetAll = () => {
    if (confirm('Reset entire design?')) {
      setLogo(''); setUrl(''); setTopText(''); setBottomText(''); setShowTopText(false); setShowBottomText(false);
      setLogoFilter('none'); setLogoColorMode('original');
      clearPreset();
    }
  };

  const applyTemplate = (t: any) => {
    setDotType(t.dotType); setCornerType(t.cornerType); setCornerDotType(t.cornerDotType || 'dot');
    setDotColor1(t.dotColor1); setBgColor(t.bgColor); setCornerColor(t.cornerColor || t.dotColor1);
    setCornerDotColor(t.cornerDotColor || t.dotColor1); setFrameStyle(t.frameStyle); setFontFamily(t.fontFamily);
    if (t.useGradient) { setUseGradient(true); setDotColor2(t.dotColor2 || t.dotColor1); }
    else { setUseGradient(false); setDotColor2(t.dotColor1); }
    
    if (t.useBgGradient) { setUseBgGradient(true); setBgColor2(t.bgColor2 || t.bgColor); }
    else { setUseBgGradient(false); setBgColor2(t.bgColor); }
    
    if (t.useCornerGradient) { setUseCornerGradient(true); setCornerColor2(t.cornerColor2 || t.cornerColor); }
    else { setUseCornerGradient(false); setCornerColor2(t.cornerColor); }
  };

  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling({
    width: 300, height: 300, type: 'svg' as DrawType,
    data: getQrData(), image: logo,
    dotsOptions: { color: dotColor1, type: dotType as DotType },
    backgroundOptions: { color: 'transparent' },
    cornersSquareOptions: { color: cornerColor, type: cornerType as CornerSquareType },
    cornersDotOptions: { color: cornerDotColor, type: cornerDotType as CornerDotType },
    imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize, hideBackgroundDots: true }
  }));

  useEffect(() => { if (qrRef.current) { qrRef.current.innerHTML = ''; qrCode.append(qrRef.current); } }, [qrCode]);

  useEffect(() => {
    if (!logo) {
      setProcessedLogo('');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (logoColorMode === 'bw') {
          ctx.filter = 'brightness(0)';
        }
        const scale = Math.min(size / img.width, size / img.height);
        const x = (size / 2) - (img.width / 2) * scale;
        const y = (size / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setProcessedLogo(canvas.toDataURL('image/png'));
      }
    };
    img.src = logo;
  }, [logo, logoColorMode]);

  useEffect(() => {
    const isCustom = dotType === 'diamond' || dotType === 'stars' || dotType === 'heart';

    const dotsOptions: any = { 
      type: isCustom ? 'square' : dotType,
      color: useGradient ? undefined : dotColor1,
      gradient: useGradient ? {
        type: gradientType,
        colorStops: [{ offset: 0, color: dotColor1 }, { offset: 1, color: dotColor2 }]
      } : undefined
    };
    
    qrCode.update({
      data: getQrData(), 
      image: processedLogo, 
      dotsOptions, 
      backgroundOptions: { 
        color: useBgGradient ? undefined : 'transparent',
        gradient: useBgGradient ? {
          type: 'linear',
          colorStops: [{ offset: 0, color: bgColor }, { offset: 1, color: bgColor2 }]
        } : undefined
      },
      cornersSquareOptions: { 
        type: cornerType as CornerSquareType,
        color: useCornerGradient ? undefined : cornerColor, 
        gradient: useCornerGradient ? {
          type: 'linear',
          colorStops: [{ offset: 0, color: cornerColor }, { offset: 1, color: cornerColor2 }]
        } : undefined
      },
      cornersDotOptions: { 
        type: cornerDotType as CornerDotType,
        color: useCornerDotGradient ? undefined : cornerDotColor,
        gradient: useCornerDotGradient ? {
          type: 'linear',
          colorStops: [{ offset: 0, color: cornerDotColor }, { offset: 1, color: cornerDotColor2 }]
        } : undefined
      },
      qrOptions: { errorCorrectionLevel: ecc },
      imageOptions: { hideBackgroundDots: !!logo, imageSize: logoSize, margin: logoMargin }
    });

    const timer = setTimeout(() => {
      const svg = qrRef.current?.querySelector('svg');
      if (svg) {
        const rects = svg.querySelectorAll('rect');
        rects.forEach(rect => {
          const w = parseFloat(rect.getAttribute('width') || '0');
          const h = parseFloat(rect.getAttribute('height') || '0');
          if (w > 0 && w < 20 && Math.abs(w - h) < 0.1) {
            const x = parseFloat(rect.getAttribute('x') || '0');
            const y = parseFloat(rect.getAttribute('y') || '0');
            if (isCustom) {
              const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              const d = `M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h} L ${x} ${y+h} Z`;
              newPath.setAttribute('d', transformPathToCustomShapes(d, dotType));
              newPath.setAttribute('fill', rect.getAttribute('fill') || dotColor1);
              rect.parentNode?.replaceChild(newPath, rect);
            }
          }
        });

        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
          const d = path.getAttribute('d') || '';
          const moveCount = (d.match(/M/g) || []).length;
          
          if (isCustom && moveCount > 10) {
            path.setAttribute('d', transformPathToCustomShapes(d, dotType));
          }
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [qrCode, url, wifiSsid, wifiPass, vcardName, waPhone, waMsg, evName, contentType, dotType, cornerType, cornerDotType, dotColor1, dotColor2, useGradient, gradientType, bgColor, bgColor2, useBgGradient, cornerColor, cornerColor2, useCornerGradient, cornerDotColor, cornerDotColor2, useCornerDotGradient, processedLogo, logoSize, logoMargin, ecc]);

  const applyNormalizedPath = (pathData: string, x: number, y: number, size: number) => {
    // Correctly handle replace callback arguments: (match, group1, group2, ...)
    return pathData.replace(/([MLC])\s*([\d.-]+)\s*([\d.-]+)(?:\s*([\d.-]+)\s*([\d.-]+)\s*([\d.-]+)\s*([\d.-]+))?/gi, (_match, command, p1, p2, p3, p4, p5, p6) => {
      const nx = parseFloat(p1);
      const ny = parseFloat(p2);
      const scaledX = (x + nx * size).toFixed(3);
      const scaledY = (y + ny * size).toFixed(3);
      
      if (command.toUpperCase() === 'C') {
        const nx2 = parseFloat(p3);
        const ny2 = parseFloat(p4);
        const nx3 = parseFloat(p5);
        const ny3 = parseFloat(p6);
        // Correct order: ControlPoint1X, ControlPoint1Y, ControlPoint2X, ControlPoint2Y, FinalX, FinalY
        return `C ${(x + nx * size).toFixed(3)} ${(y + ny * size).toFixed(3)} ${(x + nx2 * size).toFixed(3)} ${(y + ny2 * size).toFixed(3)} ${(x + nx3 * size).toFixed(3)} ${(y + ny3 * size).toFixed(3)}`;
      }
      
      return `${command} ${scaledX} ${scaledY}`;
    });
  };

  const transformPathToCustomShapes = (d: string, type: string) => {
    const pathKey = type === 'stars' ? 'star' : type as keyof typeof SVG_PATHS;
    const shapePath = SVG_PATHS[pathKey];
    if (!shapePath) return d;

    const chunks = d.match(/[Mm][^Mm]+/g);
    if (!chunks) return d;

    return chunks.map(chunk => {
      const points = chunk.match(/[\d.-]+/g)?.map(parseFloat) || [];
      if (points.length < 2) return chunk;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let currX = 0, currY = 0;

      const cmds = chunk.match(/([a-df-z])|(-?\d*\.?\d+)/gi) || [];
      let i = 0;
      while (i < cmds.length) {
        const cmd = cmds[i];
        if (/[a-z]/i.test(cmd)) {
          i++;
          if (cmd === 'M' || cmd === 'L') { currX = parseFloat(cmds[i++]); currY = parseFloat(cmds[i++]); }
          else if (cmd === 'm' || cmd === 'l') { currX += parseFloat(cmds[i++]); currY += parseFloat(cmds[i++]); }
          else if (cmd === 'H') { currX = parseFloat(cmds[i++]); }
          else if (cmd === 'h') { currX += parseFloat(cmds[i++]); }
          else if (cmd === 'V') { currY = parseFloat(cmds[i++]); }
          else if (cmd === 'v') { currY += parseFloat(cmds[i++]); }
          else if (cmd === 'Z' || cmd === 'z') { /* close */ }
          
          if (!isNaN(currX) && !isNaN(currY)) {
            minX = Math.min(minX, currX); minY = Math.min(minY, currY);
            maxX = Math.max(maxX, currX); maxY = Math.max(maxY, currY);
          }
        } else { i++; }
      }

      const size = Math.max(maxX - minX, maxY - minY);
      if (size > 0 && size < 25) {
        return applyNormalizedPath(shapePath, minX, minY, size);
      }
      return chunk;
    }).join(' ');
  };

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

  const onDownload = async (extension: FileExtension, withBg: boolean) => {
    if (extension === 'svg') {
      qrCode.download({ name: 'docxforge-qr', extension: 'svg' });
      return;
    }

    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const qrSize = 1000;
    const padding = withBg ? 200 : 50;
    const textSpace = 250;
    
    let canvasHeight = qrSize + padding * 2;
    if (withBg) {
      if (showTopText) canvasHeight += textSpace;
      if (showBottomText) canvasHeight += textSpace;
    }
    
    canvas.width = qrSize + padding * 2;
    canvas.height = canvasHeight;
    
    if (withBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const dotsOptions: any = { type: dotType, color: useGradient ? undefined : dotColor1, gradient: useGradient ? { type: gradientType, colorStops: [{ offset: 0, color: dotColor1 }, { offset: 1, color: dotColor2 }] } : undefined };
    const rawQr = new QRCodeStyling({ width: qrSize, height: qrSize, type: 'canvas', data: getQrData(), image: logo, dotsOptions, backgroundOptions: { color: 'transparent' }, cornersSquareOptions: { color: cornerColor, type: cornerType as CornerSquareType }, cornersDotOptions: { color: cornerDotColor, type: cornerDotType as CornerDotType }, imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize, hideBackgroundDots: true }, qrOptions: { errorCorrectionLevel: ecc } });
    const qrBlob = await rawQr.getRawData('png'); if (!qrBlob) return;
    const qrImg = new Image(); qrImg.src = URL.createObjectURL(qrBlob); await new Promise((res) => { qrImg.onload = res; });
    
    const qrY = padding + (withBg && showTopText ? textSpace : 0);
    ctx.drawImage(qrImg, padding, qrY, qrSize, qrSize);
    
    if (withBg) {
      ctx.font = `bold ${effectiveFontSize * 3}px ${fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (showTopText && topText) { const m = ctx.measureText(topText.toUpperCase()); drawFrame(ctx, canvas.width / 2, padding + textSpace / 2, m.width, effectiveFontSize * 3, frameStyle); ctx.fillText(topText.toUpperCase(), canvas.width / 2, padding + textSpace / 2); }
      if (showBottomText && bottomText) { const m = ctx.measureText(bottomText.toUpperCase()); drawFrame(ctx, canvas.width / 2, canvas.height - padding - textSpace / 2, m.width, effectiveFontSize * 3, frameStyle); ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - padding - textSpace / 2); }
    }

    const link = document.createElement('a');
    link.download = `docxforge-qr.${extension}`;
    link.href = canvas.toDataURL(extension === 'png' ? 'image/png' : 'image/jpeg', 1.0);
    link.click();
  };

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
    const isGlass = frameStyle === 'glass';
    
    const textColor = isSolid ? bgColor : dotColor1;

    return (
      <div 
        className={`cta-frame style-${frameStyle}`} 
        style={{
          background: isBrutal ? bgColor : (isGlass ? 'rgba(255,255,255,0.15)' : (isSolid ? dotColor1 : 'transparent')),
          border: ['outline', 'glass', 'brutal'].includes(frameStyle) ? `3px solid ${dotColor1}` : (frameStyle === 'dashed' ? `3px dashed ${dotColor1}` : 'none'),
          boxShadow: isBrutal ? `8px 8px 0 ${dotColor1}` : (isGlass ? '0 8px 32px rgba(0,0,0,0.2)' : 'none'),
          backdropFilter: isGlass ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isGlass ? 'blur(12px)' : 'none',
          color: isBrutal ? dotColor1 : textColor,
          fontFamily: fontFamily, 
          fontSize: `clamp(12px, 4vw, ${effectiveFontSize}px)`,
          padding: '12px 30px', 
          fontWeight: 800, 
          textTransform: 'uppercase',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 10,
          lineHeight: 1
        }}
      >
        <span style={{ position: 'relative', zIndex: 11 }}>{text}</span>
      </div>
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

  const getWorkbenchBg = () => {
    if (useBgGradient) return `linear-gradient(135deg, ${bgColor} 0%, ${bgColor2} 100%)`;
    return undefined; // Fallback to CSS default
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} background={getWorkbenchBg()}>
      <div className="qr-stage">
        <div className="qr-frame-glow" />
        <motion.div 
          className="qr-pedestal" 
          layoutId="pedestal" 
          transition={{ type: 'spring', damping: 20 }} 
          style={{ 
            background: bgColor, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1.5rem'
          }}
        >
          {showTopText && topText && renderPreviewText(topText)}
          <div ref={qrRef} className={`filter-${logoFilter} logo-color-mode-${logoColorMode}`} style={{ padding: '0.5rem' }} />
          {showBottomText && bottomText && renderPreviewText(bottomText)}
        </motion.div>
        <div className="reset-container" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <button className="btn-premium btn-ghost" onClick={resetAll} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)' }}>
            <RotateCcw size={16} /> RESET STUDIO
          </button>
          <div className="version-badge">
            v1.2.5 • PROFESSIONAL EDITION
          </div>
        </div>
      </div>

      <aside className="studio-drawer">
        <AnimatePresence mode="wait">
          {activeTab === 'templates' && (
            <motion.div key="templates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Presets</h2><p>Live QR previews.</p></div>
              <div className="option-grid">
                <div className="studio-option template-card" onClick={clearPreset} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="template-qr-container" style={{ background: '#222', border: '2px dashed #444', height: 60, width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                    <RotateCcw size={20} color="#666" />
                  </div>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>NONE</span>
                </div>
                {TEMPLATES.map(t => (<div key={t.name} className="studio-option template-card" onClick={() => applyTemplate(t)}><TemplateThumbnail config={t} /><span>{t.name}</span></div>))}
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Branding</h2><p>Logo & Styling.</p></div>
              <div className="panel-section">
                <div className="label-group">Color Mode</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`studio-option ${logoColorMode === 'original' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setLogoColorMode('original')}>COLOR</button>
                  <button className={`studio-option ${logoColorMode === 'bw' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setLogoColorMode('bw')}>MONO</button>
                </div>
              </div>
              <div className="panel-section">
                <div className="label-group">Quick Logos</div>
                <div className="logo-studio-grid">
                  {PRESET_LOGOS.map(l => (
                    <div key={l.name} className={`logo-studio-item ${logo === l.url ? 'active' : ''} logo-color-mode-${logoColorMode}`} onClick={() => setLogo(l.url)}>
                      {l.url ? <img src={l.url} alt={l.name} /> : <div style={{ fontSize: '0.6rem', color: '#000', fontWeight: 900 }}>NONE</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel-section">
                <label className="studio-option upload-studio" style={{ flexDirection: 'row', cursor: 'pointer' }}>
                  <Upload size={18} />
                  <span>UPLOAD CUSTOM</span>
                  <input type="file" hidden onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
              <div className="panel-section">
                <div className="label-group">Logo Size</div>
                <input type="range" min="20" max="50" value={logoSize * 100} onChange={(e) => setLogoSize(parseInt(e.target.value) / 100)} style={{ width: '100%', accentColor: 'var(--accent-neon)' }} />
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Content</h2><p>QR Data Source.</p></div>
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
              <div className="drawer-header"><h2>Design</h2><p>Patterns & Canvas.</p></div>
              <div className="panel-section">
                <div className="label-group">Pattern</div>
                <div className="option-grid">
                  {PATTERNS.map(p => {
                    const pathKey = p.id === 'stars' ? 'star' : p.id as keyof typeof SVG_PATHS;
                    const customPath = SVG_PATHS[pathKey];
                    return (
                      <div key={p.id} className={`studio-option ${dotType === p.id ? 'active' : ''}`} onClick={() => setDotType(p.id)}>
                        {customPath ? (
                          <svg width="20" height="20" viewBox="0 0 1 1">
                            <path d={customPath} fill="currentColor" />
                          </svg>
                        ) : (
                          <div style={{ background: p.preview, width: 20, height: 20, borderRadius: p.id === 'rounded' ? '50%' : '0' }} />
                        )}
                        <span>{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel-section">
                <div className="label-group">Dot Color</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button className={`studio-option ${!useGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseGradient(false)}>Solid</button>
                  <button className={`studio-option ${useGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseGradient(true)}>Gradient</button>
                </div>
                <div className="color-row"><span>{useGradient ? 'Start' : 'Color'}</span><input type="color" className="color-swatch" value={dotColor1} onChange={(e) => setDotColor1(e.target.value)} /></div>
                {useGradient && <div className="color-row" style={{ marginTop: '0.5rem' }}><span>End</span><input type="color" className="color-swatch" value={dotColor2} onChange={(e) => setDotColor2(e.target.value)} /></div>}
              </div>

              <div className="panel-section">
                <div className="label-group">Background</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button className={`studio-option ${!useBgGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseBgGradient(false)}>Solid</button>
                  <button className={`studio-option ${useBgGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseBgGradient(true)}>Gradient</button>
                </div>
                <div className="color-row"><span>{useBgGradient ? 'Color 1' : 'BG'}</span><input type="color" className="color-swatch" value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div>
                {useBgGradient && <div className="color-row" style={{ marginTop: '0.5rem' }}><span>Color 2</span><input type="color" className="color-swatch" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} /></div>}
              </div>
            </motion.div>
          )}

          {activeTab === 'corners' && (
            <motion.div key="corners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Anchors</h2><p>Eye Styling.</p></div>
              <div className="panel-section">
                <div className="label-group">Frame</div>
                <div className="option-grid">
                  {CORNERS.map(c => (
                    <div key={c.id} className={`studio-option ${cornerType === c.id ? 'active' : ''}`} onClick={() => setCornerType(c.id as any)}>
                      <div style={{ width: 30, height: 30, border: '3px solid white', borderRadius: c.id === 'extra-rounded' ? '10px' : c.id === 'rounded' ? '6px' : c.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className={`studio-option ${!useCornerGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseCornerGradient(false)}>Solid</button>
                  <button className={`studio-option ${useCornerGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseCornerGradient(true)}>Gradient</button>
                </div>
                <div className="color-row" style={{ marginTop: '0.5rem' }}><span>{useCornerGradient ? 'Start' : 'Frame'}</span><input type="color" className="color-swatch" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} /></div>
                {useCornerGradient && <div className="color-row" style={{ marginTop: '0.5rem' }}><span>End</span><input type="color" className="color-swatch" value={cornerColor2} onChange={(e) => setCornerColor2(e.target.value)} /></div>}
              </div>
              <div className="panel-section">
                <div className="label-group">Inner</div>
                <div className="option-grid">
                  {INNER_CORNERS.map(ic => (
                    <div key={ic.id} className={`studio-option ${cornerDotType === ic.id ? 'active' : ''}`} onClick={() => setCornerDotType(ic.id as any)}>
                      <div style={{ width: 16, height: 16, background: 'white', borderRadius: ic.id === 'dot' ? '50%' : '0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{ic.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className={`studio-option ${!useCornerDotGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseCornerDotGradient(false)}>Solid</button>
                  <button className={`studio-option ${useCornerDotGradient ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setUseCornerDotGradient(true)}>Gradient</button>
                </div>
                <div className="color-row" style={{ marginTop: '0.5rem' }}><span>{useCornerDotGradient ? 'Start' : 'Dot Color'}</span><input type="color" className="color-swatch" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} /></div>
                {useCornerDotGradient && <div className="color-row" style={{ marginTop: '0.5rem' }}><span>End</span><input type="color" className="color-swatch" value={cornerDotColor2} onChange={(e) => setCornerDotColor2(e.target.value)} /></div>}
              </div>
            </motion.div>
          )}

          {activeTab === 'labels' && (
            <motion.div key="labels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="drawer-header"><h2>Typography</h2><p>Branded Text.</p></div>
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
                              <div className="font-grid-container" style={{ padding: '1rem 0' }}>
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
                <button className="btn-premium btn-ghost" onClick={() => onDownload('jpeg', true)}>JPEG (Solid BG)</button>
                <div className="label-group" style={{ marginTop: '1rem' }}>Vector</div>
                <button className="btn-premium btn-ghost" onClick={() => onDownload('svg', false)}>SVG (Standard)</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </Layout>
  );
}

export default App;
