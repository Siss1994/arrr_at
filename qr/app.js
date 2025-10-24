// State
let currentType = 'text';
let currentQRCode = null;
let currentQRDataURL = null;

// DOM Elements
const typeButtons = document.querySelectorAll('.type-btn');
const contentForms = document.querySelectorAll('.content-form');
const generateBtn = document.getElementById('generate-btn');
const qrPreview = document.getElementById('qr-preview');
const downloadPngBtn = document.getElementById('download-png');
const downloadSvgBtn = document.getElementById('download-svg');
const downloadPdfBtn = document.getElementById('download-pdf');
const loadingOverlay = document.getElementById('loading-overlay');
const sizeInput = document.getElementById('qr-size');
const sizeValue = document.getElementById('size-value');
const marginInput = document.getElementById('qr-margin');
const marginValue = document.getElementById('margin-value');
const useLogoCheckbox = document.getElementById('use-logo');
const logoOptions = document.getElementById('logo-options');
const logoSizeInput = document.getElementById('logo-size');
const logoSizeValue = document.getElementById('logo-size-value');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateSizeValue();
    updateMarginValue();
    updateLogoSizeValue();
});

// Event Listeners
function setupEventListeners() {
    // Type selection
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            switchContentForm(currentType);
        });
    });

    // Generate button
    generateBtn.addEventListener('click', generateQRCode);

    // Download buttons
    downloadPngBtn.addEventListener('click', () => downloadQRCode('png'));
    downloadSvgBtn.addEventListener('click', () => downloadQRCode('svg'));
    downloadPdfBtn.addEventListener('click', () => downloadQRCode('pdf'));

    // Range inputs
    sizeInput.addEventListener('input', updateSizeValue);
    marginInput.addEventListener('input', updateMarginValue);
    logoSizeInput.addEventListener('input', updateLogoSizeValue);

    // Logo checkbox
    useLogoCheckbox.addEventListener('change', () => {
        logoOptions.style.display = useLogoCheckbox.checked ? 'block' : 'none';
    });
}

// Switch content form based on type
function switchContentForm(type) {
    contentForms.forEach(form => {
        form.classList.remove('active');
        if (form.dataset.form === type || (type === 'url' && form.dataset.form === 'text')) {
            form.classList.add('active');
        }
    });
}

// Update value displays
function updateSizeValue() {
    sizeValue.textContent = sizeInput.value;
}

function updateMarginValue() {
    marginValue.textContent = marginInput.value;
}

function updateLogoSizeValue() {
    logoSizeValue.textContent = logoSizeInput.value;
}

// Get form data based on type
function getFormData() {
    switch (currentType) {
        case 'text':
        case 'url':
            return {
                content: document.getElementById('text-content').value
            };

        case 'email':
            return {
                email: document.getElementById('email-address').value,
                subject: document.getElementById('email-subject').value,
                body: document.getElementById('email-body').value
            };

        case 'phone':
            return {
                phone: document.getElementById('phone-number').value
            };

        case 'sms':
            return {
                phone: document.getElementById('sms-number').value,
                message: document.getElementById('sms-message').value
            };

        case 'wifi':
            return {
                ssid: document.getElementById('wifi-ssid').value,
                password: document.getElementById('wifi-password').value,
                encryption: document.getElementById('wifi-encryption').value,
                hidden: document.getElementById('wifi-hidden').checked
            };

        case 'vcard':
            return {
                name: document.getElementById('vcard-name').value,
                phone: document.getElementById('vcard-phone').value,
                email: document.getElementById('vcard-email').value,
                organization: document.getElementById('vcard-org').value,
                website: document.getElementById('vcard-website').value
            };

        case 'location':
            return {
                latitude: document.getElementById('location-lat').value,
                longitude: document.getElementById('location-lng').value
            };

        default:
            return {};
    }
}

// Generate QR data string based on type
function generateQRData(type, data) {
    switch (type) {
        case 'url':
        case 'text':
            return data.content;

        case 'email':
            return `mailto:${data.email}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;

        case 'phone':
            return `tel:${data.phone}`;

        case 'sms':
            return `sms:${data.phone}?body=${encodeURIComponent(data.message || '')}`;

        case 'wifi':
            return `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid};P:${data.password};H:${data.hidden ? 'true' : 'false'};;`;

        case 'vcard':
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTEL:${data.phone || ''}\nEMAIL:${data.email || ''}\nORG:${data.organization || ''}\nURL:${data.website || ''}\nEND:VCARD`;

        case 'location':
            return `geo:${data.latitude},${data.longitude}`;

        default:
            return data.content;
    }
}

// Validate form data
function validateFormData(data) {
    switch (currentType) {
        case 'text':
        case 'url':
            return data.content && data.content.trim() !== '';

        case 'email':
            return data.email && data.email.trim() !== '';

        case 'phone':
            return data.phone && data.phone.trim() !== '';

        case 'sms':
            return data.phone && data.phone.trim() !== '';

        case 'wifi':
            return data.ssid && data.ssid.trim() !== '';

        case 'vcard':
            return data.name && data.name.trim() !== '';

        case 'location':
            return data.latitude && data.longitude;

        default:
            return false;
    }
}

// Show/hide loading overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Generate QR Code using qr-code-styling (MIT License)
async function generateQRCode() {
    const data = getFormData();

    if (!validateFormData(data)) {
        alert('Please fill in all required fields');
        return;
    }

    showLoading(true);

    try {
        const qrData = generateQRData(currentType, data);
        const size = parseInt(sizeInput.value);
        const fgColor = document.getElementById('fg-color').value;
        const bgColor = document.getElementById('bg-color').value;
        const errorLevel = document.getElementById('error-level').value;
        const margin = parseInt(marginInput.value);
        const useLogo = useLogoCheckbox.checked;
        const logoFile = document.getElementById('logo-file').files[0];

        if (useLogo && !logoFile) {
            alert('Please select a logo file');
            showLoading(false);
            return;
        }

        // Prepare QR code options
        const options = {
            width: size,
            height: size,
            data: qrData,
            margin: margin,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: errorLevel
            },
            dotsOptions: {
                color: fgColor,
                type: 'square'
            },
            backgroundOptions: {
                color: bgColor
            }
        };

        // Add logo if selected
        if (useLogo && logoFile) {
            const logoSizePercent = parseInt(logoSizeInput.value) / 100;
            const reader = new FileReader();

            await new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    options.image = e.target.result;
                    options.imageOptions = {
                        hideBackgroundDots: true,
                        imageSize: logoSizePercent,
                        margin: 5
                    };
                    resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(logoFile);
            });
        }

        // Create QR code
        currentQRCode = new QRCodeStyling(options);

        // Display preview
        qrPreview.innerHTML = '';
        currentQRCode.append(qrPreview);

        // Store data URL for download
        currentQRDataURL = await currentQRCode.getRawData('png');

        // Enable download buttons
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        downloadPdfBtn.disabled = false;

        showLoading(false);
    } catch (error) {
        console.error('Error generating QR code:', error);
        alert(`Failed to generate QR code: ${error.message}`);
        showLoading(false);
    }
}

// Download QR Code
async function downloadQRCode(format) {
    if (!currentQRCode) {
        alert('Please generate a QR code first');
        return;
    }

    showLoading(true);

    try {
        if (format === 'png') {
            await currentQRCode.download({ name: 'qrcode', extension: 'png' });
        } else if (format === 'svg') {
            await currentQRCode.download({ name: 'qrcode', extension: 'svg' });
        } else if (format === 'pdf') {
            // Generate PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const size = parseInt(sizeInput.value);
            const pdfSize = 150; // 150mm size in PDF
            const x = (210 - pdfSize) / 2; // Center on A4 (210mm wide)
            const y = 50;

            // Add title
            pdf.setFontSize(20);
            pdf.text('QR Code', 105, 30, { align: 'center' });

            // Get PNG data and add to PDF
            const pngData = await currentQRCode.getRawData('png');
            const blob = new Blob([pngData], { type: 'image/png' });
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            pdf.addImage(dataUrl, 'PNG', x, y, pdfSize, pdfSize);

            // Add footer
            pdf.setFontSize(10);
            pdf.text(`Type: ${currentType}`, 105, y + pdfSize + 20, { align: 'center' });
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 105, y + pdfSize + 30, { align: 'center' });
            pdf.text('Generated with arrr.at/qr', 105, y + pdfSize + 40, { align: 'center' });

            pdf.save('qrcode.pdf');
        }

        showLoading(false);
    } catch (error) {
        console.error('Error downloading QR code:', error);
        alert(`Failed to download: ${error.message}`);
        showLoading(false);
    }
}
