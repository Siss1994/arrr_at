# QR Code Generator - arrr.at

Professional QR code generator with advanced customization features.

## Features

### QR Code Types
- **Text/URL** - Plain text or website links
- **Email** - Email with subject and body
- **Phone** - Direct phone call
- **SMS** - Text message with pre-filled content
- **WiFi** - WiFi network credentials
- **vCard** - Digital business card
- **Location** - Geographic coordinates

### Customization
- **Colors** - Custom foreground and background colors
- **Size** - Adjustable from 100px to 1000px
- **Error Correction** - L/M/Q/H levels
- **Logo** - Add custom logo to QR code center
- **Margin** - Adjustable white space

### Output Formats
- **PNG** - High-quality raster image
- **SVG** - Scalable vector graphics
- **PDF** - Print-ready document

### Additional Features
- **QR Scanner** - Scan QR codes using device camera
- **Batch Generation** - Create up to 100 QR codes at once
- **No Watermarks** - Clean, professional output
- **100% Free** - All features available for commercial use

## Technical Stack

### Frontend
- Pure HTML5, CSS3, JavaScript
- Responsive design
- No framework dependencies

### Backend API
- Node.js + Express
- QR generation: `qrcode` (MIT License)
- Image processing: `jimp` (MIT License)
- PDF generation: `pdfkit` (MIT License)

### License
All components use MIT License - **fully commercial-friendly**

## API Documentation

### Generate QR Code
```bash
POST /api/qr/generate
Content-Type: application/json

{
  "type": "text",
  "data": { "content": "Hello World" },
  "format": "png",
  "size": 300,
  "color": {
    "dark": "#000000",
    "light": "#FFFFFF"
  },
  "errorCorrectionLevel": "M",
  "margin": 4
}
```

### Generate with Logo
```bash
POST /api/qr/generate-with-logo
Content-Type: multipart/form-data

logo: <file>
options: <JSON string>
data: <JSON string>
```

### Generate PDF
```bash
POST /api/qr/generate-pdf
Content-Type: application/json

{
  "type": "url",
  "data": { "content": "https://arrr.at" },
  "size": 300,
  "title": "My QR Code"
}
```

### Batch Generate
```bash
POST /api/qr/batch-generate
Content-Type: application/json

{
  "items": [
    { "name": "QR1", "type": "text", "data": { "content": "Item 1" } },
    { "name": "QR2", "type": "url", "data": { "content": "https://example.com" } }
  ],
  "format": "png",
  "size": 300
}
```

## Usage

### Access the App
Visit: `http://arrr.at/qr/` (or `https://arrr.at/qr/` with SSL)

### Pages
- `/qr/` - Main generator
- `/qr/scanner.html` - QR scanner
- `/qr/batch.html` - Batch generator

## Installation

### Backend Setup
```bash
cd /home/arrr/qr-generator-api
npm install
npm start
```

### Service Management
```bash
# Start service
sudo systemctl start qr-generator-api

# Stop service
sudo systemctl stop qr-generator-api

# View logs
tail -f /home/arrr/qr-generator-api/logs/output.log
```

## Privacy & Security
- No data collection
- All processing happens server-side
- QR scanner works entirely in browser
- No external API calls
- No user tracking

## Commercial Use
✅ **100% Free for Commercial Use**
- All libraries use MIT License
- No attribution required
- Use for business, products, marketing
- Modify and redistribute freely

## Support
For issues or questions, visit [arrr.at](https://arrr.at)

---

© 2025 arrr.at | Made with ❤️ for the community
