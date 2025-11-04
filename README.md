![MasterHead](https://raw.githubusercontent.com/reddevil212/colorsforyou/refs/heads/main/src/app/opengraph-image.png)

# Colors For You 🎨

A modern, feature-rich web application for creating, exploring, and managing color palettes. Built with Next.js 15 and featuring smooth animations, multiple color tools, and an extensive palette gallery.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://colorsforyou.web.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## ✨ Features

### 🎨 Palette Creator
- **Manual Creation**: Hand-pick individual colors with an intuitive color picker
- **Color Harmony Generator**: Create harmonious palettes using color theory
  - Complementary
  - Analogous
  - Triadic
  - Monochromatic
  - Split-complementary
- **Gradient Generator**: Create smooth color gradients between two colors
- **Lock Colors**: Lock specific colors while regenerating others
- **Export Options**: Export palettes as JSON or CSS variables
- **Save & Load**: Save palettes to local storage and reload them later

### 🖼️ Image Palette Extractor
- **Smart Color Extraction**: Upload images and extract dominant colors
- **Multiple Extraction Modes**:
  - Balanced: Representative colors from the entire image
  - Vibrant: High saturation, bold colors
  - Muted/Pastel: Soft, low saturation colors
- **Flexible Output**: Extract 3-8 colors from any image
- **Instant Preview**: See extracted palettes in real-time
- **Export & Edit**: Export extracted palettes or send them to the Creator

### 📚 Palette Gallery
- Browse **100+ pre-made color palettes**
- Organized by categories:
  - Warm, Cool, Earth tones
  - Pastel, Bold, Vibrant
  - Dark, Neutral, Vintage
  - Tech, Urban, Tropical
  - And more...
- Search and filter by tags
- One-click copy for all colors
- Mark favorites for quick access

### 🌗 Theme Support
- **Dark/Light Mode**: Toggle between themes
- **Persistent Preference**: Theme choice saved across sessions
- **Dynamic UI**: All components adapt to current theme
- **Smooth Transitions**: Animated theme switching

### 🎭 Interactive UI
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dynamic Borders**: Adaptive dotted borders that respond to theme changes
- **Intuitive Navigation**: Clean header with easy-to-access tools

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** 

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/reddevil212/colorsforyou.git
   cd colorsforyou
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.3 | React framework with App Router & Static Export |
| **React** | 19.0.0 | UI library |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| **Framer Motion** | 12.15.0 | Animation library |
| **Firebase** | 11.8.1 | Hosting and deployment |

## 📁 Project Structure

```
colorsforyou/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.js            # Home page
│   │   ├── layout.js          # Root layout with theme provider
│   │   ├── globals.css        # Global styles
│   │   ├── about/             # About page
│   │   ├── colors/            # Color tools page
│   │   ├── contacts/          # Contact page
│   │   ├── creator/           # Palette creator tool
│   │   ├── home/              # Home page component
│   │   ├── image-palette/     # Image color extractor
│   │   ├── palette/           # Palette gallery
│   │   └── more/              # Additional tools
│   ├── components/
│   │   ├── footer/            # Footer component
│   │   ├── header/            # Navigation header
│   │   ├── loader/            # Loading component
│   │   └── theme/             # Theme provider & context
│   ├── context/
│   │   └── LoadingContext.js  # Loading state management
│   └── data/
│       └── palettes.json      # Pre-made palette collection (100+ palettes)
│            
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
└── package.json               # Dependencies and scripts
```

## 🎯 Key Pages & Routes

- `/` - Home page with featured tools
- `/creator` - Interactive palette creation tool
- `/palette` - Browse 100+ pre-made palettes
- `/image-palette` - Extract colors from images
- `/colors` - Color tools and utilities
- `/about` - About the application
- `/contacts` - Contact information

## 🔧 Configuration

### Next.js Configuration

The app uses **static export** for optimal performance:
- `output: 'export'` - Generates static HTML
- `trailingSlash: true` - Ensures proper routing
- `images.unoptimized: true` - Required for static export

### Firebase Deployment

Deploy to Firebase Hosting:
```bash
npm run deploy
```

This runs:
1. `next build` - Builds the static export
2. `firebase deploy --only hosting:colorsforyou` - Deploys to Firebase

## 💾 Local Storage

The application uses browser local storage for:
- **Saved Palettes**: Store custom and extracted palettes
- **Theme Preference**: Remember user's dark/light mode choice
- **Favorite Palettes**: Mark and save favorite color combinations

## 🎨 Color Features

### Palette Creator Features
- 5-color palette editor
- Real-time color preview
- Lock/unlock individual colors
- Multiple creation modes (Manual, Harmony, Gradient)
- Copy individual colors or entire palette
- Export as JSON or CSS custom properties
- Save unlimited palettes to local storage

### Image Extractor Features
- Drag & drop or file upload
- Support for PNG, JPG, GIF (up to 5MB)
- 3-8 color extraction
- Three extraction algorithms:
  - Balanced (representative sampling)
  - Vibrant (high saturation focus)
  - Muted (low saturation, pastel)
- Canvas-based color quantization
- HSL color space analysis

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Test on multiple browsers and devices
- Ensure accessibility standards are met
- Update documentation as needed

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run export` | Export static site |
| `npm run deploy` | Build and deploy to Firebase |

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by [reddevil212](https://github.com/reddevil212)

## 🔗 Links

- **Live Demo**: [https://colorsforyou.web.app](https://colorsforyou.web.app)
- **Repository**: [https://github.com/reddevil212/colorsforyou](https://github.com/reddevil212/colorsforyou)

## 🙏 Acknowledgments

- Color theory and harmony algorithms
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- The open-source community

---

**Made for designers, developers, and color enthusiasts** 🎨✨

