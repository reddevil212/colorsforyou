'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import Link from 'next/link';
import NextImage from 'next/image';

export default function ImagePalettePage() {
    const { theme } = useTheme();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [extractedPalette, setExtractedPalette] = useState([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState(null);
    const [sampleCount, setSampleCount] = useState(5);
    const [colorQuantity, setColorQuantity] = useState('balanced');
    const [savedPalettes, setSavedPalettes] = useState([]);
    const [paletteName, setPaletteName] = useState('Image Palette');
    const [showSavedSuccess, setShowSavedSuccess] = useState(false);
    const canvasRef = useRef(null);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset states
        setError(null);
        setExtractedPalette([]);

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit');
            return;
        }

        // Check file type
        if (!file.type.match('image.*')) {
            setError('Only image files are allowed');
            return;
        }

        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setPaletteName(`Palette from ${file.name.split('.')[0]}`);
    };

    const extractPalette = async () => {
        if (!imageUrl) return;

        setIsExtracting(true);
        setError(null);

        try {
            // Load image
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = () => {
                // Create canvas
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                
                // Set canvas size to match image
                const maxDimension = 300; // Limit size for performance
                let width = img.width;
                let height = img.height;
                
                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, width, height).data;
                
                // Extract colors based on selected strategy
                let palette;
                switch (colorQuantity) {
                    case 'vibrant':
                        palette = extractVibrantColors(imageData, sampleCount);
                        break;
                    case 'muted':
                        palette = extractMutedColors(imageData, sampleCount);
                        break;
                    case 'balanced':
                    default:
                        palette = extractBalancedColors(imageData, sampleCount);
                }
                
                setExtractedPalette(palette);
                setIsExtracting(false);
            };
            
            img.onerror = () => {
                setError('Failed to load image');
                setIsExtracting(false);
            };
            
            img.src = imageUrl;
        } catch (err) {
            setError('Error processing image: ' + err.message);
            setIsExtracting(false);
        }
    };

    // Extract a balanced set of colors representing the image
    const extractBalancedColors = (imageData, colorCount) => {
        // Use color quantization to reduce to main colors
        const colors = {};
        const pixelCount = imageData.length / 4;
        
        // Sample pixels (not every pixel for performance)
        const sampleRate = Math.max(1, Math.floor(pixelCount / 10000));
        
        for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Reduce color precision to group similar colors
            const quantizedR = Math.round(r / 16) * 16;
            const quantizedG = Math.round(g / 16) * 16;
            const quantizedB = Math.round(b / 16) * 16;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            
            if (!colors[colorKey]) {
                colors[colorKey] = {
                    r: quantizedR,
                    g: quantizedG,
                    b: quantizedB,
                    count: 0
                };
            }
            
            colors[colorKey].count++;
        }
        
        // Convert to array and sort by frequency
        const sortedColors = Object.values(colors)
            .sort((a, b) => b.count - a.count)
            .slice(0, colorCount * 2); // Get more colors than needed for filtering
        
        // Convert RGB to HSL for better color selection
        const hslColors = sortedColors.map(color => {
            const hsl = rgbToHsl(color.r, color.g, color.b);
            return {
                ...color,
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                hex: rgbToHex(color.r, color.g, color.b)
            };
        });
        
        // Filter colors to ensure variety (avoid too many similar colors)
        const filteredColors = [];
        for (const color of hslColors) {
            // Check if this color is too similar to already selected colors
            const isTooSimilar = filteredColors.some(selectedColor => {
                const hDiff = Math.abs(selectedColor.h - color.h);
                const sDiff = Math.abs(selectedColor.s - color.s);
                const lDiff = Math.abs(selectedColor.l - color.l);
                
                // Consider similar if all HSL components are close
                return (hDiff < 15 || hDiff > 345) && sDiff < 10 && lDiff < 10;
            });
            
            if (!isTooSimilar) {
                filteredColors.push(color);
                if (filteredColors.length >= colorCount) break;
            }
        }
        
        // If we don't have enough colors after filtering, just take the top ones
        if (filteredColors.length < colorCount) {
            for (const color of hslColors) {
                if (!filteredColors.includes(color)) {
                    filteredColors.push(color);
                    if (filteredColors.length >= colorCount) break;
                }
            }
        }
        
        // Return hex values
        return filteredColors.map(color => color.hex);
    };

    // Extract more vibrant colors from the image
    const extractVibrantColors = (imageData, colorCount) => {
        const colors = {};
        const pixelCount = imageData.length / 4;
        const sampleRate = Math.max(1, Math.floor(pixelCount / 10000));
        
        for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            
            if (a < 128) continue;
            
            const hsl = rgbToHsl(r, g, b);
            
            // Only consider vibrant colors (higher saturation)
            if (hsl.s < 50) continue;
            
            const quantizedR = Math.round(r / 16) * 16;
            const quantizedG = Math.round(g / 16) * 16;
            const quantizedB = Math.round(b / 16) * 16;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            
            if (!colors[colorKey]) {
                colors[colorKey] = {
                    r: quantizedR,
                    g: quantizedG,
                    b: quantizedB,
                    count: 0,
                    h: hsl.h,
                    s: hsl.s,
                    l: hsl.l,
                    hex: rgbToHex(r, g, b)
                };
            }
            
            colors[colorKey].count++;
        }
        
        // Convert to array and sort by frequency and saturation combined
        const sortedColors = Object.values(colors)
            .sort((a, b) => (b.count * (b.s / 100)) - (a.count * (a.s / 100)))
            .slice(0, colorCount * 2);
        
        // Filter for variety
        const filteredColors = [];
        for (const color of sortedColors) {
            const isTooSimilar = filteredColors.some(selectedColor => {
                const hDiff = Math.abs(selectedColor.h - color.h);
                return (hDiff < 25 || hDiff > 335);
            });
            
            if (!isTooSimilar) {
                filteredColors.push(color);
                if (filteredColors.length >= colorCount) break;
            }
        }
        
        // If we don't have enough colors after filtering, just take the top ones
        if (filteredColors.length < colorCount) {
            for (const color of sortedColors) {
                if (!filteredColors.includes(color)) {
                    filteredColors.push(color);
                    if (filteredColors.length >= colorCount) break;
                }
            }
        }
        
        return filteredColors.map(color => color.hex);
    };

    // Extract more muted/pastel colors from the image
    const extractMutedColors = (imageData, colorCount) => {
        const colors = {};
        const pixelCount = imageData.length / 4;
        const sampleRate = Math.max(1, Math.floor(pixelCount / 10000));
        
        for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];
            
            if (a < 128) continue;
            
            const hsl = rgbToHsl(r, g, b);
            
            // Only consider muted colors (lower saturation, medium lightness)
            if (hsl.s > 60 || hsl.l < 30 || hsl.l > 80) continue;
            
            const quantizedR = Math.round(r / 16) * 16;
            const quantizedG = Math.round(g / 16) * 16;
            const quantizedB = Math.round(b / 16) * 16;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            
            if (!colors[colorKey]) {
                colors[colorKey] = {
                    r: quantizedR,
                    g: quantizedG,
                    b: quantizedB,
                    count: 0,
                    h: hsl.h,
                    s: hsl.s,
                    l: hsl.l,
                    hex: rgbToHex(r, g, b)
                };
            }
            
            colors[colorKey].count++;
        }
        
        // Convert to array and sort by frequency
        const sortedColors = Object.values(colors)
            .sort((a, b) => b.count - a.count)
            .slice(0, colorCount * 2);
        
        // Filter for variety
        const filteredColors = [];
        for (const color of sortedColors) {
            const isTooSimilar = filteredColors.some(selectedColor => {
                const hDiff = Math.abs(selectedColor.h - color.h);
                const lDiff = Math.abs(selectedColor.l - color.l);
                return (hDiff < 20 || hDiff > 340) && lDiff < 10;
            });
            
            if (!isTooSimilar) {
                filteredColors.push(color);
                if (filteredColors.length >= colorCount) break;
            }
        }
        
        // If we don't have enough colors after filtering, just take the top ones
        if (filteredColors.length < colorCount) {
            for (const color of sortedColors) {
                if (!filteredColors.includes(color)) {
                    filteredColors.push(color);
                    if (filteredColors.length >= colorCount) break;
                }
            }
        }
        
        return filteredColors.map(color => color.hex);
    };

    // RGB to HSL conversion
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

    // RGB to HEX conversion
    const rgbToHex = (r, g, b) => {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

    // Save palette to localStorage
    const savePalette = () => {
        if (extractedPalette.length === 0) return;
        
        const newPalette = {
            id: Date.now(),
            name: paletteName,
            colors: extractedPalette,
            date: new Date().toISOString(),
            source: 'image'
        };
        
        const updatedPalettes = [...savedPalettes, newPalette];
        setSavedPalettes(updatedPalettes);
        localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
        
        setShowSavedSuccess(true);
        setTimeout(() => setShowSavedSuccess(false), 3000);
    };

    // Export palette as JSON
    const exportPalette = () => {
        if (extractedPalette.length === 0) return;
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            name: paletteName,
            colors: extractedPalette,
        }));
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${paletteName.replace(/ /g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Export palette as CSS variables
    const exportCss = () => {
        if (extractedPalette.length === 0) return;
        
        const css = `/* Color Palette: ${paletteName} */
:root {
${extractedPalette.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
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
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">
                Image Palette Generator
            </h1>
            
            {/* Main content area */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image upload section */}
                <div className="bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                    <h2 className="text-lg font-semibold mb-3 text-primary">Upload Image</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm text-secondary mb-2">
                            Select an image to extract colors
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-theme rounded-lg cursor-pointer bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mb-1 text-sm text-primary">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-secondary">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </label>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 text-red-500 dark:text-red-400 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    {imageUrl && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium mb-2 text-primary">Preview</h3>
                            <div className="relative aspect-w-16 aspect-h-9 bg-white/5 dark:bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Uploaded preview"
                                    className="max-h-48 max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Extraction options */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-3 text-primary">Extraction Options</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="color-count" className="block text-sm text-secondary mb-1">
                                    Number of Colors
                                </label>
                                <select
                                    id="color-count"
                                    value={sampleCount}
                                    onChange={(e) => setSampleCount(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary"
                                >
                                    <option value="3">3 Colors</option>
                                    <option value="4">4 Colors</option>
                                    <option value="5">5 Colors</option>
                                    <option value="6">6 Colors</option>
                                    <option value="7">7 Colors</option>
                                    <option value="8">8 Colors</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="color-quantity" className="block text-sm text-secondary mb-1">
                                    Color Style
                                </label>
                                <select
                                    id="color-quantity"
                                    value={colorQuantity}
                                    onChange={(e) => setColorQuantity(e.target.value)}
                                    className="w-full px-3 py-2 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary"
                                >
                                    <option value="balanced">Balanced</option>
                                    <option value="vibrant">Vibrant</option>
                                    <option value="muted">Muted/Pastel</option>
                                </select>
                            </div>
                        </div>
                        
                        <button
                            onClick={extractPalette}
                            disabled={!imageUrl || isExtracting}
                            className="w-full px-4 py-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-primary font-medium rounded-lg transition-colors"
                        >
                            {isExtracting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Extracting...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                    Extract Colors
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Hidden canvas for image processing */}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                
                {/* Extracted palette section */}
                <div className="bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-primary">Extracted Palette</h2>
                        
                        {extractedPalette.length > 0 && (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={paletteName}
                                    onChange={(e) => setPaletteName(e.target.value)}
                                    className="px-3 py-1 border border-theme rounded bg-white/5 dark:bg-black/5 text-primary text-sm mr-2"
                                    placeholder="Palette name"
                                />
                                <button
                                    onClick={savePalette}
                                    className="p-2 bg-white/10 dark:bg-white/10 rounded-md hover:bg-white/20 dark:hover:bg-white/20 transition-colors"
                                    aria-label="Save palette"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {extractedPalette.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium mb-1">No palette yet</p>
                            <p className="text-sm">Upload an image and extract colors to see the palette</p>
                        </div>
                    ) : (
                        <>
                            {/* Large color preview */}
                            <div className="mb-6">
                                <div className="flex h-32 mb-2 rounded-lg overflow-hidden">
                                    {extractedPalette.map((color, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 group relative"
                                            style={{ backgroundColor: color }}
                                        >
                                            {/* Hover overlay with copy button */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 dark:bg-white/30 backdrop-blur-sm transition-opacity duration-200">
                                                <button
                                                    onClick={() => copyToClipboard(color)}
                                                    className={`
                                                        px-2 py-1 rounded-md text-xs font-medium transition-all
                                                        ${copySuccess === color
                                                            ? 'bg-transparent text-white dark:text-black'
                                                            : 'bg-white/80 dark:bg-black/80 text-black dark:text-white hover:bg-white dark:hover:bg-black'
                                                        }
                                                    `}
                                                >
                                                    {copySuccess === color ? (
                                                        <span className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Copied
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            Copy
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Color details list */}
                            <div className="mb-6">
                                <h3 className="text-md font-medium mb-3 text-primary">Colors</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {extractedPalette.map((color, index) => (
                                        <div key={index} className="flex items-center group">
                                            <div
                                                className="w-10 h-10 rounded-md border border-white/10 dark:border-white/5 mr-3"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                            <div className="flex-1">
                                                <p className="font-mono text-primary">{color.toUpperCase()}</p>
                                                <p className="text-xs text-secondary">Color {index + 1}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(color)}
                                                className={`p-2 rounded-md ${copySuccess === color
                                                    ? 'text-green-500 dark:text-green-400'
                                                    : 'text-secondary hover:bg-white/10 dark:hover:bg-white/10'
                                                } transition-colors`}
                                                aria-label={`Copy ${color}`}
                                            >
                                                {copySuccess === color ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Export options */}
                            <div>
                                <h3 className="text-md font-medium mb-3 text-primary">Export Options</h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={exportPalette}
                                        className="px-4 py-2 border border-theme text-primary font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export JSON
                                    </button>
                                    <button
                                        onClick={exportCss}
                                        className="px-4 py-2 border border-theme text-primary font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export CSS
                                    </button>
                                    <Link href="/creator" className="px-4 py-2 border border-theme text-primary font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit in Creator
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* How it works section */}
            <div className="mb-8 bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                <h2 className="text-lg font-semibold mb-4 text-primary">How It Works</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-white/10 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-md font-medium mb-1 text-primary">1. Upload Image</h3>
                        <p className="text-secondary text-sm">
                            Upload any image (PNG, JPG, GIF) up to 5MB in size that you want to extract colors from.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-white/10 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <h3 className="text-md font-medium mb-1 text-primary">2. Extract Colors</h3>
                        <p className="text-secondary text-sm">
                            Select how many colors you want and the style (balanced, vibrant, or muted), then click extract.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-white/10 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                        </div>
                        <h3 className="text-md font-medium mb-1 text-primary">3. Use Your Palette</h3>
                        <p className="text-secondary text-sm">
                            Save the palette, export it as JSON or CSS variables, or send it to the Palette Creator for fine-tuning.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mb-8 bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                <h2 className="text-lg font-semibold mb-4 text-primary">Tips for Best Results</h2>
                
                <ul className="list-disc list-inside text-secondary space-y-2">
                    <li>Use images with clear, distinct colors for more accurate palette extraction.</li>
                    <li>For product images, choose photos with minimal background distraction.</li>
                    <li>Try different extraction styles to find the perfect palette for your project.</li>
                    <li>Landscapes and nature photos often produce beautiful, harmonious color schemes.</li>
                    <li>Use the "Vibrant" style for energetic, bold color schemes.</li>
                    <li>Try the "Muted" style for softer, more subdued palettes.</li>
                </ul>
            </div>

            {/* Related tools */}
            <div className="mb-8 bg-white/5 dark:bg-black/5 p-6 rounded-xl border border-white/10 dark:border-white/5">
                <h2 className="text-lg font-semibold mb-4 text-primary">Related Tools</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/creator" className="p-4 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <h3 className="text-md font-medium mb-1 text-primary">Palette Creator</h3>
                        <p className="text-secondary text-sm">
                            Create custom color palettes with advanced tools for harmony and gradients.
                        </p>
                    </Link>
                    
                    <Link href="/palette" className="p-4 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <h3 className="text-md font-medium mb-1 text-primary">Palette Browser</h3>
                        <p className="text-secondary text-sm">
                            Browse hundreds of pre-made color palettes organized by theme and style.
                        </p>
                    </Link>
                    
                    <Link href="/colors" className="p-4 bg-white/5 dark:bg-black/5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <h3 className="text-md font-medium mb-1 text-primary">Color Tools</h3>
                        <p className="text-secondary text-sm">
                            Advanced color tools including format conversion, schemes and accessibility testing.
                        </p>
                    </Link>
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
        </div>
    );
}