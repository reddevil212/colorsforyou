'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import Link from 'next/link';
import Footer from '@/components/footer/page';

export default function ColorToolsPage() {
    const { theme } = useTheme();
    const [color, setColor] = useState('#3498db');
    const [rgb, setRgb] = useState({ r: 52, g: 152, b: 219 });
    const [hsl, setHsl] = useState({ h: 204, s: 70, l: 53 });
    const [hsv, setHsv] = useState({ h: 204, s: 76, v: 86 });
    const [cmyk, setCmyk] = useState({ c: 76, m: 31, y: 0, k: 14 });
    const [format, setFormat] = useState('hex');
    const [copySuccess, setCopySuccess] = useState(null);
    const [saveHistory, setSaveHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState('monochromatic');
    const [colorScheme, setColorScheme] = useState([]);

    useEffect(() => {
        // Load color history from localStorage
        const history = localStorage.getItem('colorHistory');
        if (history) {
            try {
                setSaveHistory(JSON.parse(history).slice(0, 20)); // Limit to 20 items
            } catch (e) {
                console.error('Failed to parse color history', e);
            }
        }
    }, []);

    useEffect(() => {
        // Update all color models when hex changes
        updateColorModels(color);
        // Generate color scheme based on current color
        generateColorScheme();
    }, [color, selectedScheme]);

    // Convert hex to RGB
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    // Convert RGB to HSV/HSB
    const rgbToHsv = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    };

  

    const rgbToCmyk = (r, g, b) => {
        if (r === 0 && g === 0 && b === 0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);

        const minCMY = Math.min(c, m, y);

        if (minCMY === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        const k = minCMY;
        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        const kPercent = Math.round(k * 100);

        return { c, m, y, k: kPercent };
    };

    // Convert HSL to RGB
    const hslToRgb = (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };

    // Convert RGB to Hex
    const rgbToHex = (r, g, b) => {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    // Update all color models based on hex
    const updateColorModels = (hex) => {
        const rgbColor = hexToRgb(hex);
        const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
        const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
        const cmykColor = rgbToCmyk(rgbColor.r, rgbColor.g, rgbColor.b);

        setRgb(rgbColor);
        setHsl(hslColor);
        setHsv(hsvColor);
        setCmyk(cmykColor);
    };

    // Handle RGB input changes
    const handleRgbChange = (component, value) => {
        const newValue = Math.max(0, Math.min(255, parseInt(value) || 0));
        const newRgb = { ...rgb, [component]: newValue };
        setRgb(newRgb);

        // Update other color formats
        const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        setColor(hex);
    };

    // Handle HSL input changes
    const handleHslChange = (component, value) => {
        let newValue = parseInt(value) || 0;

        if (component === 'h') {
            newValue = Math.max(0, Math.min(359, newValue));
        } else {
            newValue = Math.max(0, Math.min(100, newValue));
        }

        const newHsl = { ...hsl, [component]: newValue };
        setHsl(newHsl);

        // Convert HSL to RGB, then to HEX
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        setColor(hex);
    };

    // Copy color to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopySuccess(text);
                setTimeout(() => setCopySuccess(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    // Save color to history
    const saveColor = () => {
        // Create new color object with all formats
        const colorData = {
            id: Date.now(),
            hex: color,
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            timestamp: new Date().toISOString()
        };

        // Add to history and limit to 20 items
        const updatedHistory = [colorData, ...saveHistory].slice(0, 20);
        setSaveHistory(updatedHistory);
        localStorage.setItem('colorHistory', JSON.stringify(updatedHistory));

        // Show success message
        setCopySuccess('Saved to history');
        setTimeout(() => setCopySuccess(null), 2000);
    };

    // Delete color from history
    const deleteFromHistory = (id) => {
        const updatedHistory = saveHistory.filter(item => item.id !== id);
        setSaveHistory(updatedHistory);
        localStorage.setItem('colorHistory', JSON.stringify(updatedHistory));
    };

    // Load color from history
    const loadColor = (hex) => {
        setColor(hex);
        setShowHistory(false);
    };

    // Generate color schemes
    const generateColorScheme = () => {
        const schemes = {
            monochromatic: () => {
                return [
                    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.max(0, hsl.s - 30), Math.max(10, hsl.l - 30)))),
                    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.max(0, hsl.s - 15), Math.max(20, hsl.l - 15)))),
                    color,
                    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.min(100, hsl.s + 15), Math.min(90, hsl.l + 15)))),
                    rgbToHex(...Object.values(hslToRgb(hsl.h, Math.min(100, hsl.s + 30), Math.min(95, hsl.l + 30)))),
                ];
            },
            complementary: () => {
                return [
                    color,
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 60) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 210) % 360, hsl.s, hsl.l))),
                ];
            },
            analogous: () => {
                return [
                    rgbToHex(...Object.values(hslToRgb((hsl.h - 40) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h - 20) % 360, hsl.s, hsl.l))),
                    color,
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 20) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 40) % 360, hsl.s, hsl.l))),
                ];
            },
            triadic: () => {
                return [
                    color,
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 60) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 300) % 360, hsl.s, hsl.l))),
                ];
            },
            splitComplementary: () => {
                return [
                    color,
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 150) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 210) % 360, hsl.s, hsl.l))),
                    rgbToHex(...Object.values(hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l))),
                ];
            },
        };

        setColorScheme(schemes[selectedScheme]());
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">
                Advanced Color Tools
            </h1>

            <div className="mb-8 flex flex-col md:flex-row gap-6">
                {/* Main color picker section */}
                <div className="flex-1 bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3 text-primary">Color Picker</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full h-40 cursor-pointer rounded-md"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => {
                                            if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                setColor(e.target.value);
                                            }
                                        }}
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-36 font-mono"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(color)}
                                            className="px-3 py-1 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20 transition-colors"
                                            aria-label="Copy HEX"
                                        >
                                            <span className="flex items-center gap-1 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy
                                            </span>
                                        </button>
                                        <button
                                            onClick={saveColor}
                                            className="px-3 py-1 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20 transition-colors"
                                            aria-label="Save color"
                                        >
                                            <span className="flex items-center gap-1 text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                                Save
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-md font-medium mb-2 text-primary">Color Format</h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        onClick={() => setFormat('hex')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${format === 'hex' ? 'bg-white/30 dark:bg-white/20 text-primary' : 'bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10'}`}
                                    >
                                        HEX
                                    </button>
                                    <button
                                        onClick={() => setFormat('rgb')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${format === 'rgb' ? 'bg-white/30 dark:bg-white/20 text-primary' : 'bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10'}`}
                                    >
                                        RGB
                                    </button>
                                    <button
                                        onClick={() => setFormat('hsl')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${format === 'hsl' ? 'bg-white/30 dark:bg-white/20 text-primary' : 'bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10'}`}
                                    >
                                        HSL
                                    </button>
                                    <button
                                        onClick={() => setFormat('hsv')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${format === 'hsv' ? 'bg-white/30 dark:bg-white/20 text-primary' : 'bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10'}`}
                                    >
                                        HSV
                                    </button>
                                    <button
                                        onClick={() => setFormat('cmyk')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${format === 'cmyk' ? 'bg-white/30 dark:bg-white/20 text-primary' : 'bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10'}`}
                                    >
                                        CMYK
                                    </button>
                                    <button
                                        onClick={() => setShowHistory(!showHistory)}
                                        className="px-3 py-2 rounded-md text-sm font-medium bg-white/10 dark:bg-black/20 text-secondary hover:bg-white/20 dark:hover:bg-white/10"
                                    >
                                        History
                                    </button>
                                </div>

                                {copySuccess && (
                                    <div className="mb-4 px-3 py-2 bg-green-500/20 text-green-500 dark:text-green-400 rounded-md text-sm">
                                        {copySuccess === 'Saved to history' ? 'Saved to history!' : `Copied: ${copySuccess}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Color format inputs */}
                    <div className="mb-6">
                        {format === 'hex' && (
                            <div>
                                <h3 className="text-md font-medium mb-2 text-primary">HEX</h3>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => {
                                            if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                setColor(e.target.value);
                                            }
                                        }}
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(color)}
                                        className="ml-2 p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {format === 'rgb' && (
                            <div>
                                <h3 className="text-md font-medium mb-2 text-primary">RGB</h3>
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">R</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={rgb.r}
                                            onChange={(e) => handleRgbChange('r', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">G</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={rgb.g}
                                            onChange={(e) => handleRgbChange('g', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">B</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={rgb.b}
                                            onChange={(e) => handleRgbChange('b', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                                        readOnly
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                                        className="ml-2 p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {format === 'hsl' && (
                            <div>
                                <h3 className="text-md font-medium mb-2 text-primary">HSL</h3>
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">H</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="359"
                                            value={hsl.h}
                                            onChange={(e) => handleHslChange('h', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">S (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={hsl.s}
                                            onChange={(e) => handleHslChange('s', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">L (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={hsl.l}
                                            onChange={(e) => handleHslChange('l', e.target.value)}
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                                        readOnly
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                                        className="ml-2 p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {format === 'hsv' && (
                            <div>
                                <h3 className="text-md font-medium mb-2 text-primary">HSV (HSB)</h3>
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">H</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="359"
                                            value={hsv.h}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">S (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={hsv.s}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">V (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={hsv.v}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}
                                        readOnly
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`)}
                                        className="ml-2 p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {format === 'cmyk' && (
                            <div>
                                <h3 className="text-md font-medium mb-2 text-primary">CMYK</h3>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">C (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={cmyk.c}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">M (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={cmyk.m}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">Y (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={cmyk.y}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-secondary mb-1">K (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={cmyk.k}
                                            readOnly
                                            className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                                        readOnly
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-full font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)}
                                        className="ml-2 p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {showHistory && (
                            <div className="mt-4">
                                <h3 className="text-md font-medium mb-2 text-primary">Color History</h3>
                                {saveHistory.length === 0 ? (
                                    <p className="text-secondary text-sm">No saved colors yet.</p>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                        {saveHistory.map((item) => (
                                            <div
                                                key={item.id}
                                                className="relative group cursor-pointer"
                                                onClick={() => loadColor(item.hex)}
                                            >
                                                <div
                                                    className="h-10 rounded-md border border-white/10 dark:border-white/5 transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: item.hex }}
                                                    title={item.hex}
                                                >
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteFromHistory(item.id);
                                                    }}
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/80 dark:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Delete color"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Color schemes section */}
                <div className="flex-1 bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                    <h2 className="text-lg font-semibold mb-3 text-primary">Color Schemes</h2>

                    <div className="mb-4">
                        <label className="block text-sm text-secondary mb-1">Scheme Type</label>
                        <select
                            value={selectedScheme}
                            onChange={(e) => setSelectedScheme(e.target.value)}
                            className="w-full px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary"
                        >
                            <option value="monochromatic">Monochromatic</option>
                            <option value="complementary">Complementary</option>
                            <option value="analogous">Analogous</option>
                            <option value="triadic">Triadic</option>
                            <option value="splitComplementary">Split Complementary</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2 text-primary">Generated Scheme</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {colorScheme.map((schemeColor, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className="w-12 h-12 rounded-md border border-white/10 dark:border-white/5 mr-3"
                                        style={{ backgroundColor: schemeColor }}
                                    ></div>
                                    <div className="flex-1">
                                        <p className="font-mono text-primary">{schemeColor}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(schemeColor)}
                                        className="p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-md font-medium mb-2 text-primary">Preview</h3>
                        <div className="overflow-hidden rounded-md border border-white/10 dark:border-white/5">
                            <div className="flex h-16">
                                {colorScheme.map((schemeColor, index) => (
                                    <div
                                        key={index}
                                        className="flex-1"
                                        style={{ backgroundColor: schemeColor }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sample UI with generated colors */}
                    <div className="mt-6">
                        <h3 className="text-md font-medium mb-2 text-primary">Sample UI</h3>
                        <div className="border border-white/10 dark:border-white/5 rounded-md overflow-hidden">
                            <div style={{ backgroundColor: colorScheme[0] }} className="p-3">
                                <div className="text-white text-sm font-bold">Header</div>
                            </div>
                            <div style={{ backgroundColor: colorScheme[1] }} className="p-4">
                                <div className="bg-white/80 dark:bg-white/90 rounded-md p-2 mb-2">
                                    <div className="text-xs font-medium" style={{ color: colorScheme[0] }}>Section Title</div>
                                </div>
                                <div className="bg-white/80 dark:bg-white/90 rounded-md p-2">
                                    <div className="text-xs" style={{ color: colorScheme[3] }}>Content goes here</div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: colorScheme[2] }} className="p-3 flex justify-between">
                                <button className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: colorScheme[4] }}>
                                    Button 1
                                </button>
                                <button className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colorScheme[0], color: 'white' }}>
                                    Button 2
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Link href="/palette" className="px-4 py-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20 transition-colors text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Browse Color Palettes
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search colors from palette database */}
            <div className="bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5 mb-8">
                <h2 className="text-lg font-semibold mb-3 text-primary">Search Colors</h2>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by color name, hex code or category..."
                            className="w-full px-4 py-3 pr-10 border border-theme rounded-lg bg-white/5 dark:bg-black/5 text-primary"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-secondary">
                        Search for colors by name, hex value, or browse by categories like "warm", "cool", "pastel", etc.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <button className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors">
                        warm
                    </button>
                    <button className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors">
                        cool
                    </button>
                    <button className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors">
                        pastel
                    </button>
                    <button className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors">
                        vibrant
                    </button>
                    <button className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors">
                        earth
                    </button>
                </div>

                <div className="text-center">
                    <Link href="/creator" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20 transition-colors text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Custom Palette
                    </Link>
                </div>
            </div>

            {/* Color Accessibility */}
            <div className="bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                <h2 className="text-lg font-semibold mb-3 text-primary">Color Accessibility</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Contrast checker */}
                    <div className="flex-1">
                        <h3 className="text-md font-medium mb-2 text-primary">Contrast Checker</h3>
                        <p className="text-secondary text-sm mb-4">
                            Test text readability with your selected color and a background color.
                        </p>

                        <div className="p-4 rounded-md flex items-center justify-center text-center" style={{ backgroundColor: color, minHeight: "100px" }}>
                            <p className="text-white text-lg font-medium">Sample Text on Your Color</p>
                        </div>

                        <div className="mt-4 p-4 rounded-md flex items-center justify-center text-center" style={{ backgroundColor: "#ffffff", minHeight: "100px" }}>
                            <p className="text-lg font-medium" style={{ color }}>Sample Text with Your Color</p>
                        </div>
                    </div>

                    {/* Color blindness simulation */}
                    <div className="flex-1">
                        <h3 className="text-md font-medium mb-2 text-primary">Color Blindness Simulation</h3>
                        <p className="text-secondary text-sm mb-4">
                            See how your color appears to people with different types of color blindness.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-secondary mb-1">Original</p>
                                <div className="h-12 rounded-md" style={{ backgroundColor: color }}></div>
                            </div>
                            <div>
                                <p className="text-xs text-secondary mb-1">Protanopia</p>
                                <div className="h-12 rounded-md bg-opacity-80" style={{ backgroundColor: color }}></div>
                            </div>
                            <div>
                                <p className="text-xs text-secondary mb-1">Deuteranopia</p>
                                <div className="h-12 rounded-md bg-opacity-90" style={{ backgroundColor: color }}></div>
                            </div>
                            <div>
                                <p className="text-xs text-secondary mb-1">Tritanopia</p>
                                <div className="h-12 rounded-md brightness-95" style={{ backgroundColor: color }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </div>
    );
}