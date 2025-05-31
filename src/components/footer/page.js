'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useRouter } from 'next/navigation';

export default function Footer() {
    const router = useRouter();
    const { theme } = useTheme();
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'GitHub',
            url: 'https://github.com/reddevil212',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            url: 'https://api.whatsapp.com/send/?phone=917699958813&text=hi',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.947 7.947 0 0 0 8.034.002C3.594.002 0 3.586 0 8.012c0 1.41.369 2.767 1.068 3.966L0 16l4.107-1.077a8.009 8.009 0 0 0 3.92 1.01h.003c4.438 0 8.033-3.585 8.033-8.011 0-2.144-.83-4.162-2.462-5.596zM8.03 14.596h-.003a6.566 6.566 0 0 1-3.34-.918l-.239-.142-2.434.638.651-2.374-.155-.244a6.535 6.535 0 0 1-.995-3.474c0-3.623 2.95-6.57 6.578-6.57 1.756 0 3.405.683 4.645 1.922a6.524 6.524 0 0 1 1.933 4.643c-.002 3.623-2.95 6.569-6.641 6.569zm3.587-4.92c-.196-.098-1.152-.568-1.33-.632-.178-.066-.308-.098-.438.098s-.504.63-.618.76c-.114.13-.228.147-.424.049-.196-.098-.827-.305-1.574-.973-.582-.518-.975-1.157-1.089-1.353-.114-.196-.012-.302.086-.398.088-.087.196-.228.293-.342.098-.114.13-.196.196-.327.065-.13.032-.245-.016-.342-.049-.098-.438-1.057-.601-1.45-.158-.38-.319-.33-.438-.336l-.373-.007c-.13 0-.342.049-.52.245s-.683.668-.683 1.63.7 1.885.798 2.016c.098.13 1.38 2.102 3.346 2.947.468.202.832.322 1.116.412.469.149.895.128 1.233.078.376-.056 1.152-.47 1.316-.924.163-.455.163-.844.114-.924-.049-.08-.178-.13-.373-.228z" />
                </svg>
            )
        },
        {
            name: 'Instagram',
            url: 'https://instagram.com/itz__________sayan',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/sayan-pal-673b2227a',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
            )
        }
    ];

    const footerLinks = [
        {
            title: 'Tools',
            links: [
                { name: 'Palette Generator', href: '/creator' },
                { name: 'Color Picker', href: '/colors' },
                { name: 'Image to Palette', href: '/image-palette' },
                { name: 'Browse Palettes', href: '/palette' }
            ]
        },
        {
            title: 'More from me',
            links: [
                { name: 'Aximos UI', href: '/more/aximosui' },

            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contacts' },
               
            ]
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 15
            }
        }
    };

    return (
        <motion.footer
            className="border-t border-theme bg-white/5 dark:bg-black/5 backdrop-blur-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                type: "spring",
                damping: 20
            }}
        >
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Logo and description */}
                    <div className="lg:col-span-2">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.div variants={itemVariants} className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 flex items-center justify-center text-white font-bold text-xl">
                                    C
                                </div>
                                <h2 className="text-xl font-bold text-primary">ColorsForYou</h2>
                            </motion.div>

                            <motion.p variants={itemVariants} className="text-secondary mb-6">
                                Discover the perfect color palettes for your next project.
                                Our tools help designers and developers create beautiful color combinations.
                            </motion.p>

                            <motion.div variants={itemVariants}>
                                <div className="flex space-x-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 rounded-full transition-colors"
                                            onMouseEnter={() => setHoveredIcon(link.name)}
                                            onMouseLeave={() => setHoveredIcon(null)}
                                        >
                                            <motion.div
                                                animate={hoveredIcon === link.name ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                {link.icon}
                                            </motion.div>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Links sections */}
                    {footerLinks.map((section) => (
                        <motion.div
                            key={section.title}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.h4
                                variants={itemVariants}
                                className="font-semibold text-primary mb-4"
                            >
                                {section.title}
                            </motion.h4>
                            <motion.ul variants={itemVariants} className="space-y-2">
                                {section.links.map((link) => (
                                    <motion.li key={link.name} variants={itemVariants}>
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push(link.href);
                                            }}
                                            href={link.href}
                                            className="text-secondary hover:text-primary transition-colors inline-block cursor-pointer"
                                        >
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    ))}
                </div>
                
                {/* Copyright */}
                <motion.div
                    className="mt-10 pt-6 border-t border-theme text-center text-secondary text-sm"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.p variants={itemVariants}>
                        © {currentYear} ColorsForYou by Sayan Pal. All rights reserved.
                    </motion.p>

                    <motion.div variants={itemVariants} className="mt-2">
                      <code>  <span className="inline-flex items-center">
                            Made with
                            <motion.span
                                className="text-red-500 mx-1"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 1
                                }}
                            >
                                ❤️
                            </motion.span>
                            by  <Link href="https://github.com/reddevil212" target="_blank" className="ml-1 text-primary hover:underline">@reddevil212</Link>
                        </span></code>
                    </motion.div>
                </motion.div>
            </div>
        </motion.footer>
    );
}