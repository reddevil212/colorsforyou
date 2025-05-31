'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import Link from 'next/link';
import palettesData from '@/data/palettes.json';
import Footer from '@/components/footer/page';

export default function PalettePage() {
    const { theme } = useTheme();
    const [palettes, setPalettes] = useState([]);
    const [selectedPalette, setSelectedPalette] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [copiedColor, setCopiedColor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load data from the palettes.json file
        setTimeout(() => {
            setPalettes(palettesData.palettes);
            setIsLoading(false);
        }, 800);
    }, []);

    const toggleFavorite = (id) => {
        setPalettes(palettes.map(palette =>
            palette.id === id ? { ...palette, favorite: !palette.favorite } : palette
        ));
    };

    // Filter palettes based on category and search term
    const filteredPalettes = palettes
        .filter(p => {
            // First apply category filter
            if (filter !== 'all') {
                if (filter === 'favorites') {
                    if (!p.favorite) return false;
                } else if (p.category !== filter) {
                    return false;
                }
            }

            // Then apply search filter if there is a search term
            if (searchTerm.trim() === '') return true;

            const term = searchTerm.toLowerCase().trim();

            // Search in name
            if (p.name.toLowerCase().includes(term)) return true;

            // Search in category
            if (p.category.toLowerCase().includes(term)) return true;

            // Search in tags
            if (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term))) return true;

            // Search in colors (hex values)
            if (p.colors.some(color => color.toLowerCase().includes(term))) return true;

            return false;
        });

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

    return (
        <div className="min-h-screen pt-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Color Palettes</h1>
                        <p className="text-secondary">Find and save your favorite color combinations</p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg p-1 flex flex-wrap">
                            {['all', 'favorites', ...palettesData.categories].slice(0, 10).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all mr-1 mb-1 ${filter === category
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                <div className="mb-8">
                    <div className="relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search palettes by name, color, tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-theme rounded-lg bg-white/5 dark:bg-black/5 text-primary focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-3.5 text-secondary hover:text-primary"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredPalettes.length === 0 ? (
                            <div className="text-center py-16">
                                <h3 className="text-xl text-secondary mb-2">No palettes found</h3>
                                <p className="text-muted">Try a different filter or search term.</p>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <p className="text-muted text-sm">{filteredPalettes.length} palettes found</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPalettes.map((palette) => (
                                <div
                                    key={palette.id}
                                    className="bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex h-24">
                                        {palette.colors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="flex-1 group relative cursor-pointer"
                                                style={{ backgroundColor: color }}
                                            >
                                                {/* Hover overlay with copy button */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 dark:bg-white/30 backdrop-blur-sm transition-opacity duration-200">
                                                    <button
                                                        onClick={() => copyColorToClipboard(color)}
                                                        className={`
                                                            px-2 py-1 rounded-md text-xs font-medium transition-all
                                                            ${copiedColor === color
                                                                ? 'bg-transparent text-white dark:text-black'
                                                                : 'bg-white/80 dark:bg-black/80 text-black dark:text-white hover:bg-white dark:hover:bg-black'
                                                            }
                                                        `}
                                                        aria-label={`Copy ${color}`}
                                                    >
                                                        {copiedColor === color ? (
                                                            <span className="flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Copied!
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                </svg>
                                                                Copy
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-primary">{palette.name}</h3>
                                                <div className="text-xs text-muted capitalize">{palette.category}</div>
                                            </div>
                                            <button
                                                onClick={() => toggleFavorite(palette.id)}
                                                className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                                                aria-label={palette.favorite ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                {palette.favorite ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        {/* Tags */}
                                        {palette.tags && palette.tags.length > 0 && (
                                            <div className="mt-2 mb-3 flex flex-wrap">
                                                {palette.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="text-xs bg-white/10 dark:bg-black/20 text-secondary px-2 py-1 rounded-md mr-1 mb-1">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {palette.tags.length > 3 && (
                                                    <span className="text-xs text-secondary px-1 py-1">
                                                        +{palette.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {palette.colors.map((color, index) => (
                                                <div key={index} className="group relative">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-6 h-6 rounded-full border border-white/20 dark:border-white/10 mr-1 group-hover:scale-110 transition-transform"
                                                            style={{ backgroundColor: color }}
                                                        ></div>
                                                        <span
                                                            className={`text-xs font-mono ${copiedColor === color ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'} transition-colors`}
                                                        >
                                                            {color.toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {/* Copy button that appears on hover */}
                                                    <button
                                                        onClick={() => copyColorToClipboard(color)}
                                                        className={`
                                                            absolute -right-2 -top-2 w-5 h-5 rounded-full 
                                                            flex items-center justify-center
                                                            opacity-0 group-hover:opacity-100 transition-opacity
                                                            ${copiedColor === color ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                                        `}
                                                        aria-label={`Copy ${color}`}
                                                    >
                                                        {copiedColor === color ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Tooltip for copied status */}
                                                    {copiedColor === color && (
                                                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded opacity-90 pointer-events-none z-10">
                                                            Copied!
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="mt-12 border-t border-theme pt-8 text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Create Your Own Palette</h2>
                    <p className="text-secondary max-w-2xl mx-auto mb-6">
                        Need a custom color scheme for your project? Use our palette creator to design the perfect combination.
                    </p>
                    <Link
                        href="/creator"
                        className="inline-block px-6 py-3 mb-4 bg-black text-white dark:bg-white dark:text-black font-medium rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
                    >
                        Open Palette Creator
                    </Link>
                </div>
            </div>
                            <Footer />
            
        </div>
    );
}