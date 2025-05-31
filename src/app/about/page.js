'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import Footer from '@/components/footer/page';

export default function AboutPage() {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
            >
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    animate={{ backgroundPositionX: ['0%', '100%', '0%'] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                    style={{
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block'
                    }}
                >
                    About ColorsForYou
                </motion.h1>

                <p className="text-lg text-secondary max-w-2xl mx-auto">
                    Discover the story behind the platform and the person who created it.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Developer Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/5 dark:bg-black/5 p-8 rounded-2xl border border-white/10 dark:border-white/5"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-6 overflow-hidden flex items-center justify-center">
                            
                            <img 
                                src="https://avatars.githubusercontent.com/u/92419099?v=4" 
                                alt="Sayan Pal" 
                                className="w-full h-full object-cover"
                            /> 
                        </div>

                        <h2 className="text-2xl font-bold text-primary mb-1">Sayan Pal</h2>
                        <p className="text-secondary mb-4">Developer & Color Enthusiast</p>
                        
                        <div className="flex space-x-3 mb-6">
                            <a 
                                href="https://github.com/reddevil212" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                                aria-label="GitHub Profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                            </a>
                            <a 
                                href="mailto:business.memchat@gmail.com" 
                                className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Email"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://api.whatsapp.com/send/?phone=917699958813&text=hi" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Twitter Profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.947 7.947 0 0 0 8.034.002C3.594.002 0 3.586 0 8.012c0 1.41.369 2.767 1.068 3.966L0 16l4.107-1.077a8.009 8.009 0 0 0 3.92 1.01h.003c4.438 0 8.033-3.585 8.033-8.011 0-2.144-.83-4.162-2.462-5.596zM8.03 14.596h-.003a6.566 6.566 0 0 1-3.34-.918l-.239-.142-2.434.638.651-2.374-.155-.244a6.535 6.535 0 0 1-.995-3.474c0-3.623 2.95-6.57 6.578-6.57 1.756 0 3.405.683 4.645 1.922a6.524 6.524 0 0 1 1.933 4.643c-.002 3.623-2.95 6.569-6.641 6.569zm3.587-4.92c-.196-.098-1.152-.568-1.33-.632-.178-.066-.308-.098-.438.098s-.504.63-.618.76c-.114.13-.228.147-.424.049-.196-.098-.827-.305-1.574-.973-.582-.518-.975-1.157-1.089-1.353-.114-.196-.012-.302.086-.398.088-.087.196-.228.293-.342.098-.114.13-.196.196-.327.065-.13.032-.245-.016-.342-.049-.098-.438-1.057-.601-1.45-.158-.38-.319-.33-.438-.336l-.373-.007c-.13 0-.342.049-.52.245s-.683.668-.683 1.63.7 1.885.798 2.016c.098.13 1.38 2.102 3.346 2.947.468.202.832.322 1.116.412.469.149.895.128 1.233.078.376-.056 1.152-.47 1.316-.924.163-.455.163-.844.114-.924-.049-.08-.178-.13-.373-.228z" />
                                </svg>

                            </a>
                        </div>
                        
                        <div className="text-left w-full">
                            <h3 className="text-lg font-semibold text-primary mb-3">About Me</h3>
                            <p className="text-secondary mb-4">
                                As a passionate developer with a love for design and colors, I created ColorsForYou to help designers, developers, and creatives find the perfect color palettes for their projects.
                            </p>
                            <p className="text-secondary mb-4">
                                My journey in web development started with a fascination for the intersection of technology and visual design. I believe that the right color scheme can transform any project from good to exceptional.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Project Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/5 dark:bg-black/5 p-8 rounded-2xl border border-white/10 dark:border-white/5"
                >
                    <h2 className="text-2xl font-bold text-primary mb-6">The Project</h2>
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-primary mb-3">Mission</h3>
                        <p className="text-secondary mb-4">
                            ColorsForYou aims to simplify the color selection process by providing intuitive tools and carefully crafted color palettes. Our mission is to make color theory accessible and practical for everyone.
                        </p>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-primary mb-3">Features</h3>
                        <ul className="list-disc list-inside space-y-2 text-secondary">
                            <li>Custom palette creation with advanced harmony tools</li>
                            <li>Image-based palette extraction</li>
                            <li>Comprehensive color format conversion</li>
                            <li>Accessibility checking for color combinations</li>
                            <li>Browse curated palette collections</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3">Technology</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 rounded-full">Next.js</span>
                            <span className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 rounded-full">React</span>
                            <span className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 rounded-full">TailwindCSS</span>
                            <span className="px-3 py-1 text-sm bg-white/10 dark:bg-white/10 rounded-full">Framer Motion</span>
                        </div>
                        <p className="text-secondary">
                            Built with modern web technologies to ensure a fast, responsive, and accessible experience across all devices.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Timeline Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-2xl font-bold text-primary mb-8 text-center">Project Timeline</h2>
                
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-white/10 dark:bg-white/10"></div>
                    
                    {/* Timeline items */}
                    <div className="space-y-12">
                        {[
                            { 
                                date: 'January 2025', 
                                title: 'Project Inception', 
                                description: 'The idea for ColorsForYou was born from the frustration of searching through countless color palettes for my own projects.'
                            },
                            { 
                                date: 'March 2025', 
                                title: 'First Prototype', 
                                description: 'Developed the first working prototype with basic palette creation functionality.'
                            },
                            { 
                                date: 'April 2025', 
                                title: 'Image Palette Feature', 
                                description: 'Added the ability to extract color palettes from uploaded images.'
                            },
                            { 
                                date: 'May 2025', 
                                title: 'Public Launch', 
                                description: 'Officially launched ColorsForYou to the public with all core features implemented.'
                            }
                        ].map((item, index) => (
                            <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                    <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                                    <p className="text-secondary mt-1">{item.description}</p>
                                </div>
                                
                                <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 dark:bg-white/20 border-4 border-black/10 dark:border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 text-left' : 'pr-8 text-right'}`}>
                                    <span className="text-sm font-medium text-secondary">{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Future Plans */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/5 dark:bg-black/5 p-8 rounded-2xl border border-white/10 dark:border-white/5 mb-16"
            >
                <h2 className="text-2xl font-bold text-primary mb-6">Future Plans</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Community Features
                        </h3>
                        <p className="text-secondary">
                            User accounts, palette sharing, and a community vote system for the most popular color combinations.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Design Integration
                        </h3>
                        <p className="text-secondary">
                            Plugins for popular design tools like Figma, Adobe XD, and Sketch to streamline the color workflow.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            AI Color Suggestions
                        </h3>
                        <p className="text-secondary">
                            Implementing machine learning to provide intelligent color recommendations based on project type and preferences.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            Accessibility Tools
                        </h3>
                        <p className="text-secondary">
                            Expanded tools for ensuring color combinations meet accessibility standards for various types of color vision deficiencies.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-white/5 dark:bg-black/5 p-8 rounded-2xl border border-white/10 dark:border-white/5 text-center"
            >
                <h2 className="text-2xl font-bold text-primary mb-4">Get In Touch</h2>
                <p className="text-secondary mb-6 max-w-xl mx-auto">
                    Have questions, suggestions, or just want to say hello? I'd love to hear from you!
                </p>
                
                <div className="flex justify-center space-x-4">
                    <a 
                        href="https://github.com/reddevil212" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        GitHub
                    </a>
                    <a 
                        href="mailto:business.memchat@gmail.com" 
                        className="px-6 py-3 rounded-lg bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                    </a>
                </div>
            </motion.div>
            <Footer />

        </div>
    );
}