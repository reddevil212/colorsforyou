'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import Link from 'next/link';
import Footer from '@/components/footer/page';

export default function CreatorPage() {
    const { theme } = useTheme();
    const [palette, setPalette] = useState([
        { id: 1, color: '#3498db', locked: false },
        { id: 2, color: '#e74c3c', locked: false },
        { id: 3, color: '#2ecc71', locked: false },
        { id: 4, color: '#f39c12', locked: false },
        { id: 5, color: '#9b59b6', locked: false },
    ]);
    const [paletteName, setPaletteName] = useState('My Custom Palette');
    const [colorPickerActive, setColorPickerActive] = useState(null);
    const [activeTab, setActiveTab] = useState('manual'); // manual, harmony, gradient
    const [harmonyType, setHarmonyType] = useState('complementary');
    const [baseColor, setBaseColor] = useState('#3498db');
    const [copiedColor, setCopiedColor] = useState(null);
    const [savedPalettes, setSavedPalettes] = useState([]);
    const [showSavedSuccess, setShowSavedSuccess] = useState(false);

    // Load saved palettes from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedPalettes');
        if (saved) {
            try {
                setSavedPalettes(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved palettes', e);
            }
        }
    }, []);

    // Generate a random color
    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    // Regenerate non-locked colors
    const regenerateColors = () => {
        setPalette(palette.map(item =>
            item.locked ? item : { ...item, color: getRandomColor() }
        ));
    };

    // Toggle lock status
    const toggleLock = (id) => {
        setPalette(palette.map(item =>
            item.id === id ? { ...item, locked: !item.locked } : item
        ));
    };

    // Update a specific color
    const updateColor = (id, newColor) => {
        setPalette(palette.map(item =>
            item.id === id ? { ...item, color: newColor } : item
        ));
    };

    // Handle color picker visibility
    const toggleColorPicker = (id) => {
        setColorPickerActive(colorPickerActive === id ? null : id);
    };

    // Convert hex to HSL
    const hexToHSL = (hex) => {
        // Convert hex to RGB
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;

        // Find min and max RGB values
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);

        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
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

    // Convert HSL to hex
    const hslToHex = (h, s, l) => {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    };

    // Generate harmony colors based on baseColor and harmony type
    const generateHarmonyColors = useCallback(() => {
        const hsl = hexToHSL(baseColor);
        const { h, s, l } = hsl;
        let colors = [];

        switch (harmonyType) {
            case 'complementary':
                colors = [
                    baseColor,
                    hslToHex((h + 180) % 360, s, l),
                    hslToHex((h + 60) % 360, s, l),
                    hslToHex((h + 240) % 360, s, l),
                    hslToHex((h + 30) % 360, s, l),
                ];
                break;
            case 'analogous':
                colors = [
                    hslToHex((h - 30) % 360, s, l),
                    hslToHex((h - 15) % 360, s, l),
                    baseColor,
                    hslToHex((h + 15) % 360, s, l),
                    hslToHex((h + 30) % 360, s, l),
                ];
                break;
            case 'triadic':
                colors = [
                    baseColor,
                    hslToHex((h + 120) % 360, s, l),
                    hslToHex((h + 240) % 360, s, l),
                    hslToHex((h + 60) % 360, s, l),
                    hslToHex((h + 180) % 360, s, l),
                ];
                break;
            case 'monochromatic':
                colors = [
                    hslToHex(h, s, Math.max(l - 30, 10)),
                    hslToHex(h, s, Math.max(l - 15, 20)),
                    baseColor,
                    hslToHex(h, s, Math.min(l + 15, 85)),
                    hslToHex(h, s, Math.min(l + 30, 95)),
                ];
                break;
            case 'split-complementary':
                colors = [
                    baseColor,
                    hslToHex((h + 150) % 360, s, l),
                    hslToHex((h + 210) % 360, s, l),
                    hslToHex((h + 30) % 360, s, l),
                    hslToHex((h + 270) % 360, s, l),
                ];
                break;
        }

        setPalette(palette.map((item, index) =>
            item.locked ? item : { ...item, color: colors[index] }
        ));
    }, [baseColor, harmonyType, palette]);

    // Apply harmony when tab or base color changes
    useEffect(() => {
        if (activeTab === 'harmony') {
            generateHarmonyColors();
        }
    }, [activeTab, baseColor, harmonyType, generateHarmonyColors]);

    // Copy color to clipboard
    const copyColorToClipboard = (color) => {
        navigator.clipboard.writeText(color)
            .then(() => {
                setCopiedColor(color);
                setTimeout(() => setCopiedColor(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy color: ', err);
            });
    };

    // Add current palette to saved palettes
    const savePalette = () => {
        const newPalette = {
            id: Date.now(),
            name: paletteName,
            colors: palette.map(p => p.color),
            date: new Date().toISOString(),
        };

        const updatedPalettes = [...savedPalettes, newPalette];
        setSavedPalettes(updatedPalettes);
        localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));

        setShowSavedSuccess(true);
        setTimeout(() => setShowSavedSuccess(false), 3000);
    };

    // Export palette as JSON
    const exportPalette = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            name: paletteName,
            colors: palette.map(p => p.color),
        }));

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${paletteName.replace(/ /g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="min-h-screen pt-20 px-4 md:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Palette Creator</h1>
                        <p className="text-secondary">Design your perfect color combination</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <button
                            onClick={regenerateColors}
                            className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-primary font-medium rounded-lg transition-colors"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Regenerate
                            </span>
                        </button>
                        <button
                            onClick={savePalette}
                            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save Palette
                            </span>
                        </button>
                    </div>
                </div>

                {/* Success notification */}
                {showSavedSuccess && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Palette saved successfully!
                    </div>
                )}

                {/* Palette name input */}
                <div className="mb-6">
                    <label htmlFor="palette-name" className="block text-sm text-secondary mb-1">Palette Name</label>
                    <input
                        type="text"
                        id="palette-name"
                        value={paletteName}
                        onChange={(e) => setPaletteName(e.target.value)}
                        className="px-4 py-2 border border-theme rounded-lg bg-white/5 dark:bg-black/5 text-primary w-full max-w-md"
                    />
                </div>

                {/* Tabs for different creation modes */}
                <div className="mb-6">
                    <div className="flex border-b border-theme">
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`px-4 py-2 font-medium ${activeTab === 'manual' ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}
                        >
                            Manual
                        </button>
                        <button
                            onClick={() => setActiveTab('harmony')}
                            className={`px-4 py-2 font-medium ${activeTab === 'harmony' ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}
                        >
                            Color Harmony
                        </button>
                        <button
                            onClick={() => setActiveTab('gradient')}
                            className={`px-4 py-2 font-medium ${activeTab === 'gradient' ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}
                        >
                            Gradient
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                <div className="mb-8">
                    {activeTab === 'manual' && (
                        <p className="text-secondary mb-4">
                            Click on any color to edit it manually. Use the lock icon to prevent colors from changing when regenerating.
                        </p>
                    )}

                    {activeTab === 'harmony' && (
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <div>
                                    <label htmlFor="base-color" className="block text-sm text-secondary mb-1">Base Color</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            id="base-color"
                                            value={baseColor}
                                            onChange={(e) => setBaseColor(e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={baseColor}
                                            onChange={(e) => {
                                                if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                    setBaseColor(e.target.value);
                                                }
                                            }}
                                            className="ml-2 px-2 py-1 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-24 text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="harmony-type" className="block text-sm text-secondary mb-1">Harmony Type</label>
                                    <select
                                        id="harmony-type"
                                        value={harmonyType}
                                        onChange={(e) => setHarmonyType(e.target.value)}
                                        className="px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary"
                                    >
                                        <option value="complementary">Complementary</option>
                                        <option value="analogous">Analogous</option>
                                        <option value="triadic">Triadic</option>
                                        <option value="monochromatic">Monochromatic</option>
                                        <option value="split-complementary">Split Complementary</option>
                                    </select>
                                </div>
                                <button
                                    onClick={generateHarmonyColors}
                                    className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-primary font-medium rounded-lg transition-colors self-end"
                                >
                                    Generate Harmony
                                </button>
                            </div>
                            <p className="text-muted text-sm">
                                {harmonyType === 'complementary' && "Complementary colors are opposite on the color wheel, creating high contrast."}
                                {harmonyType === 'analogous' && "Analogous colors are adjacent on the color wheel, creating a harmonious and serene feel."}
                                {harmonyType === 'triadic' && "Triadic colors are evenly spaced around the color wheel, creating a vibrant and balanced look."}
                                {harmonyType === 'monochromatic' && "Monochromatic colors use different shades and tints of one base hue."}
                                {harmonyType === 'split-complementary' && "Split-complementary uses a base color and two colors adjacent to its complement."}
                            </p>
                        </div>
                    )}

                    {activeTab === 'gradient' && (
                        <div className="mb-6">
                            <p className="text-secondary mb-4">
                                Select your start and end colors to create a gradient palette.
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div>
                                    <label htmlFor="start-color" className="block text-sm text-secondary mb-1">Start Color</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            id="start-color"
                                            value={palette[0].color}
                                            onChange={(e) => {
                                                // Update start color and generate gradient
                                                const startColor = e.target.value;
                                                updateColor(1, startColor);

                                                // Generate gradient between start and end colors
                                                const startHSL = hexToHSL(startColor);
                                                const endHSL = hexToHSL(palette[4].color);

                                                setPalette([
                                                    { ...palette[0], color: startColor },
                                                    {
                                                        ...palette[1], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.25),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.25),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.25)
                                                        )
                                                    },
                                                    {
                                                        ...palette[2], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.5),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.5),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.5)
                                                        )
                                                    },
                                                    {
                                                        ...palette[3], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.75),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.75),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.75)
                                                        )
                                                    },
                                                    palette[4],
                                                ]);
                                            }}
                                            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={palette[0].color}
                                            onChange={(e) => {
                                                if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                    updateColor(1, e.target.value);
                                                }
                                            }}
                                            className="ml-2 px-2 py-1 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-24 text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="end-color" className="block text-sm text-secondary mb-1">End Color</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            id="end-color"
                                            value={palette[4].color}
                                            onChange={(e) => {
                                                // Update end color and generate gradient
                                                const endColor = e.target.value;
                                                updateColor(5, endColor);

                                                // Generate gradient between start and end colors
                                                const startHSL = hexToHSL(palette[0].color);
                                                const endHSL = hexToHSL(endColor);

                                                setPalette([
                                                    palette[0],
                                                    {
                                                        ...palette[1], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.25),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.25),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.25)
                                                        )
                                                    },
                                                    {
                                                        ...palette[2], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.5),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.5),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.5)
                                                        )
                                                    },
                                                    {
                                                        ...palette[3], color: hslToHex(
                                                            Math.round(startHSL.h + (endHSL.h - startHSL.h) * 0.75),
                                                            Math.round(startHSL.s + (endHSL.s - startHSL.s) * 0.75),
                                                            Math.round(startHSL.l + (endHSL.l - startHSL.l) * 0.75)
                                                        )
                                                    },
                                                    { ...palette[4], color: endColor },
                                                ]);
                                            }}
                                            className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={palette[4].color}
                                            onChange={(e) => {
                                                if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                    updateColor(5, e.target.value);
                                                }
                                            }}
                                            className="ml-2 px-2 py-1 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary w-24 text-sm font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Color palette display */}
                <div className="bg-white/5 dark:bg-black/5 border border-theme rounded-xl overflow-hidden mb-8">
                    {/* Large color display */}
                    <div className="flex h-40 md:h-56">
                        {palette.map((item) => (
                            <div
                                key={item.id}
                                className="flex-1 relative group"
                                style={{ backgroundColor: item.color }}
                            >
                                {/* Color controls */}
                                <div className="absolute top-0 right-0 m-2">
                                    <button
                                        onClick={() => toggleLock(item.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${item.locked
                                                ? 'bg-black/30 text-white'
                                                : 'bg-white/30 text-black hover:bg-white/50'
                                            } transition-colors`}
                                        aria-label={item.locked ? "Unlock color" : "Lock color"}
                                    >
                                        {item.locked ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Color code and copy button */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/30 dark:bg-white/30 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center justify-between">
                                        <div className="font-mono text-sm text-white dark:text-black">
                                            {item.color.toUpperCase()}
                                        </div>
                                        <button
                                            onClick={() => copyColorToClipboard(item.color)}
                                            className={`p-1 rounded-full ${copiedColor === item.color
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/80 dark:bg-black/80 text-black dark:text-white hover:bg-white dark:hover:bg-black'
                                                } transition-colors`}
                                            aria-label={`Copy ${item.color}`}
                                        >
                                            {copiedColor === item.color ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Color picker overlay */}
                                {activeTab === 'manual' && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => toggleColorPicker(item.id)}
                                    >
                                        <div className="bg-black/50 dark:bg-white/50 text-white dark:text-black rounded-lg p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Color picker modal */}
                                {colorPickerActive === item.id && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Edit Color
                                                </h3>
                                                <button
                                                    onClick={() => setColorPickerActive(null)}
                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div>
                                                <div className="mb-4">
                                                    <input
                                                        type="color"
                                                        value={item.color}
                                                        onChange={(e) => updateColor(item.id, e.target.value)}
                                                        className="w-full h-40 cursor-pointer border-0 rounded-md"
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Hex Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.color}
                                                        onChange={(e) => {
                                                            if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                                                                updateColor(item.id, e.target.value);
                                                            }
                                                        }}
                                                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full font-mono"
                                                    />
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setColorPickerActive(null)}
                                                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Color information */}
                    <div className="bg-white dark:bg-black bg-opacity-5 dark:bg-opacity-30 p-4 flex flex-wrap gap-4 justify-between">
                        {palette.map((item) => (
                            <div key={item.id} className="flex items-center">
                                <div
                                    className="w-6 h-6 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <div className="font-mono text-sm text-primary">
                                    {item.color.toUpperCase()}
                                    {item.locked && (
                                        <span className="ml-2 text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Export options */}
                <div className="mb-12">
                    <h3 className="text-lg font-semibold text-primary mb-3">Export Options</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={exportPalette}
                            className="px-4 py-2 border border-theme text-primary font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export as JSON
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                const css = `/* Color Palette: ${paletteName} */
:root {
${palette.map((item, index) => `  --color-${index + 1}: ${item.color};`).join('\n')}
}

/* Example usage:
.element {
  background-color: var(--color-1);
  color: var(--color-2);
}
*/`;

                                const dataStr = "data:text/css;charset=utf-8," + encodeURIComponent(css);

                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", `${paletteName.replace(/ /g, '_')}.css`);
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                            }}
                            className="px-4 py-2 border border-theme text-primary font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export as CSS Variables
                            </span>
                        </button>
                    </div>
                </div>

                {/* Saved palettes */}
                {savedPalettes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-primary mb-4">Your Saved Palettes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedPalettes.map((savedPalette) => (
                                <div
                                    key={savedPalette.id}
                                    className="bg-white/5 dark:bg-black/5 border border-theme rounded-lg overflow-hidden"
                                >
                                    <div className="flex h-16">
                                        {savedPalette.colors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="flex-1"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-primary">{savedPalette.name}</div>
                                            <div className="text-xs text-muted">
                                                {new Date(savedPalette.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Load this palette
                                                setPalette(savedPalette.colors.map((color, index) => ({
                                                    id: index + 1,
                                                    color,
                                                    locked: false
                                                })));
                                                setPaletteName(savedPalette.name);
                                            }}
                                            className="text-primary hover:text-black dark:hover:text-white"
                                            aria-label="Load palette"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Return to palettes */}
                <div className="text-center">
                    <Link
                        href="/palette"
                        className="inline-flex items-center text-primary hover:underline"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Palette Gallery
                    </Link>
                </div>
            </div>
            <Footer />

        </div>
    );
}