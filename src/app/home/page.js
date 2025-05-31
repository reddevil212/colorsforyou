'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import Footer from '@/components/footer/page';
import AdSense from '@/components/ads/AdSense';

export default function Home() {
    const { theme } = useTheme();
    const [color, setColor] = useState('#6E6E6E');
    const [stars, setStars] = useState([]);
    const starId = useRef(0);

    // Smooth scroll configuration
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    // Fluid scroll effect
    const smoothScrollY = useSpring(scrollYProgress, {
        damping: 15,
        stiffness: 150,
        mass: 0.5
    });

    // Parallax effects with smooth scroll
    const heroY = useTransform(smoothScrollY, [0, 1], [0, -100]);
    const heroOpacity = useTransform(smoothScrollY, [0, 0.3], [1, 0]);

    // Section transitions
    const featureSectionY = useTransform(smoothScrollY, [0.3, 0.6], [50, 0]);
    const colorSectionY = useTransform(smoothScrollY, [0.1, 0.4], [50, 0]);

    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Star colors
    const starColors = [
        '#ffb400', // gold
        '#ff3e00', // orange
        '#ff00aa', // pink
        '#00bbff', // blue
        '#00ff88', // green
    ];

    // Implement smooth scrolling
    useEffect(() => {
        // Smooth scroll behavior for all anchor links
        const handleAnchorClick = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        };

        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        return () => {
            anchorLinks.forEach(anchor => {
                anchor.removeEventListener('click', handleAnchorClick);
            });
        };
    }, []);

    // Star cursor effect
    useEffect(() => {
        let lastPosition = { x: 0, y: 0 };
        let lastSpawnTime = 0;

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Calculate distance moved since last position
            const dx = e.clientX - lastPosition.x;
            const dy = e.clientY - lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only spawn stars if cursor moved enough distance or enough time passed
            const now = Date.now();
            if (distance > 5 || now - lastSpawnTime > 50) {
                // Create 2-4 stars
                const numberOfStars = Math.floor(Math.random() * 3) + 2;

                for (let i = 0; i < numberOfStars; i++) {
                    // Random angle in a circle
                    const angle = Math.random() * Math.PI * 2;
                    // Random speed
                    const speed = Math.random() * 4 + 2;
                    // Random size
                    const size = Math.random() * 5 + 2;
                    // Random color
                    const colorIndex = Math.floor(Math.random() * starColors.length);

                    const newStar = {
                        id: starId.current++,
                        x: e.clientX,
                        y: e.clientY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size,
                        color: starColors[colorIndex],
                        opacity: 1
                    };

                    setStars(prev => [...prev, newStar]);
                }

                lastPosition = { x: e.clientX, y: e.clientY };
                lastSpawnTime = now;
            }
        };

        // Update star positions and fade them out
        const updateStars = () => {
            setStars(prev =>
                prev
                    .map(star => ({
                        ...star,
                        x: star.x + star.vx,
                        y: star.y + star.vy,
                        opacity: star.opacity - 0.02 // Fade out
                    }))
                    .filter(star => star.opacity > 0) // Remove fully faded stars
            );

            animationFrame = requestAnimationFrame(updateStars);
        };

        let animationFrame = requestAnimationFrame(updateStars);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 400
            }
        },
        tap: {
            scale: 0.95
        }
    };

    const colorSquareVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: (i) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                type: "spring",
                damping: 8,
                stiffness: 200
            }
        }),
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 300
            }
        }
    };

    const featureCardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 300
            }
        }
    };

    // Scroll animation variants
    const scrollRevealVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <div ref={scrollRef} className="min-h-screen flex flex-col overflow-hidden relative">
            {/* Star Cursor Effect */}
            <div className="fixed inset-0 pointer-events-none z-50">
                {/* Stars */}
                {stars.map(star => (
                    <motion.div
                        key={star.id}
                        className="absolute"
                        style={{
                            x: star.x,
                            y: star.y,
                            width: star.size,
                            height: star.size,
                            backgroundColor: star.color,
                            borderRadius: '50%',
                            opacity: star.opacity,
                            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}

                {/* Ripple effect on click */}
                <motion.div
                    className="absolute w-8 h-8 rounded-full border border-primary/50"
                    style={{
                        x: cursorX,
                        y: cursorY,
                        translateX: '-50%',
                        translateY: '-50%'
                    }}
                    whileTap={{
                        scale: [1, 2, 1],
                        opacity: [0.8, 0.3, 0],
                        transition: { duration: 0.6 }
                    }}
                />
            </div>

            {/* Progress bar for scroll */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-40"
                style={{
                    scaleX: smoothScrollY,
                    transformOrigin: "0% 0%",
                }}
            />

            {/* Hero Section with smooth parallax */}
            <motion.section
                className="flex flex-col items-center justify-center py-20 px-4 text-center relative"
                style={{ y: heroY, opacity: heroOpacity }}
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-primary"
                    >
                        Find Your Perfect{' '}
                        <motion.span
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
                                backgroundSize: '300% 300%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Color Palette
                        </motion.span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-secondary max-w-2xl mb-10"
                    >
                        Generate beautiful color combinations with our minimal {theme === 'dark' ? 'dark' : 'light'} interface.
                        No distractions, just great color selection.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 mb-10"
                    >
                        <motion.button
                            onClick={() => window.location.href = '/creator'}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-medium rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ type: "tween", duration: 0.3 }}
                                style={{ mixBlendMode: 'overlay' }}
                            />
                            Generate Palette
                        </motion.button>

                        <motion.button
                            onClick={() => window.location.href = '/colors'}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-6 py-3 border border-theme text-primary font-medium rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                            Color Picker
                        </motion.button>        
                    </motion.div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                    className="absolute top-20 left-10 w-4 h-4 bg-pink-400 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-32 right-16 w-6 h-6 bg-blue-400 rounded-full"
                    animate={{
                        y: [0, 15, 0],
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-3 h-3 bg-green-400 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </motion.section>

            {/* Color Preview with fluid animation */}
            <motion.section
                className="py-16 bg-black/5 dark:bg-white/5 relative"
                style={{ y: colorSectionY }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                }}
            >
                <div className="container mx-auto px-4">
                    <motion.h3
                        className="text-2xl font-bold text-primary mb-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Preview Your Colors
                    </motion.h3>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <motion.div
                            className="w-full max-w-xs"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.4,
                                type: "spring",
                                damping: 20
                            }}
                        >
                            <label className="block text-secondary mb-2">Select a color:</label>
                            <motion.input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full h-12 rounded-lg cursor-pointer border border-theme"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            />
                            <motion.div
                                className="mt-2 text-muted font-mono"
                                key={color}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {color.toUpperCase()}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="w-full max-w-md"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.6,
                                type: "spring",
                                damping: 20
                            }}
                        >
                            <motion.div
                                className="grid grid-cols-3 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {[0.8, 0.6, 0.4, 0.2, 0].map((opacity, i) => (
                                    <motion.div
                                        key={i}
                                        custom={i}
                                        variants={colorSquareVariants}
                                        whileHover="hover"
                                        className="aspect-square rounded-lg flex items-center justify-center text-xs cursor-pointer"
                                        style={{
                                            backgroundColor: `${color}${Math.round(opacity * 100).toString(16).padStart(2, '0')}`,
                                            color: opacity > 0.5 ? '#fff' : '#000'
                                        }}
                                    >
                                        {Math.round(opacity * 100)}%
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section with fluid scroll */}
            <motion.section
                id="features"
                className="py-20 relative"
                style={{ y: featureSectionY }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                }}
            >
                <div className="container mx-auto px-4">
                    <motion.h3
                        className="text-3xl font-bold text-primary mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            damping: 20
                        }}
                    >
                        Features
                    </motion.h3>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            {
                                title: 'Palette Generator',
                                description: 'Create harmonious color schemes automatically based on color theory principles.',
                                icon: '🎨'
                            },
                            {
                                title: 'Color Picker',
                                description: 'Select and fine-tune colors with precision using our advanced color picker tool.',
                                icon: '🖌️'
                            },
                            {
                                title: 'Contrast Checker',
                                description: 'Ensure your color combinations meet accessibility standards with our contrast analyzer.',
                                icon: '🔍'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={featureCardVariants}
                                whileHover="hover"
                                className="p-6 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden"
                            >
                                <motion.div
                                    className="text-4xl mb-4"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h4 className="text-xl font-bold text-primary mb-3">{feature.title}</h4>
                                <p className="text-secondary">{feature.description}</p>

                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0"
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
            
            <div className="container mx-auto px-4 my-8">
                <AdSense adSlot="1234567890" adFormat='auto' />
                <AdSense adSlot="0987654321" adFormat="rectangle" />
            </div>
            <Footer />

            
      
        </div>
    );
}