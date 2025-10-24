// Configuration
const API_BASE_URL = '/api/qr';

// State
let currentType = 'text';
let currentQRData = null;
let currentFormat = 'png';

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

// Generate QR Code
async function generateQRCode() {
    const data = getFormData();

    if (!validateFormData(data)) {
        alert('Please fill in all required fields');
        return;
    }

    showLoading(true);

    try {
        const useLogo = useLogoCheckbox.checked;
        const logoFile = document.getElementById('logo-file').files[0];

        if (useLogo && !logoFile) {
            alert('Please select a logo file');
            showLoading(false);
            return;
        }

        const options = {
            type: currentType,
            data: data,
            size: parseInt(sizeInput.value),
            color: {
                dark: document.getElementById('fg-color').value,
                light: document.getElementById('bg-color').value
            },
            errorCorrectionLevel: document.getElementById('error-level').value,
            margin: parseInt(marginInput.value)
        };

        let imageData;

        if (useLogo) {
            // Generate with logo
            const formData = new FormData();
            formData.append('logo', logoFile);
            formData.append('options', JSON.stringify(options));
            formData.append('data', JSON.stringify(data));

            const response = await fetch(`${API_BASE_URL}/generate-with-logo`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to generate QR code with logo');
            }

            const blob = await response.blob();
            imageData = URL.createObjectURL(blob);
        } else {
            // Generate without logo
            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...options, format: 'png' })
            });

            if (!response.ok) {
                throw new Error('Failed to generate QR code');
            }

            const blob = await response.blob();
            imageData = URL.createObjectURL(blob);
        }

        // Display preview
        qrPreview.innerHTML = `<img src="${imageData}" alt="QR Code">`;
        currentQRData = { options, imageData };

        // Enable download buttons
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        downloadPdfBtn.disabled = false;

        showLoading(false);
    } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Failed to generate QR code. Please try again.');
        showLoading(false);
    }
}

// Download QR Code
async function downloadQRCode(format) {
    if (!currentQRData) {
        alert('Please generate a QR code first');
        return;
    }

    showLoading(true);

    try {
        const data = getFormData();
        const options = {
            type: currentType,
            data: data,
            size: parseInt(sizeInput.value),
            color: {
                dark: document.getElementById('fg-color').value,
                light: document.getElementById('bg-color').value
            },
            errorCorrectionLevel: document.getElementById('error-level').value,
            margin: parseInt(marginInput.value)
        };

        let blob;
        let filename;

        if (format === 'png') {
            // Use current preview image
            const img = qrPreview.querySelector('img');
            if (img) {
                const response = await fetch(img.src);
                blob = await response.blob();
                filename = 'qrcode.png';
            }
        } else if (format === 'svg') {
            // Generate SVG
            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...options, format: 'svg' })
            });

            if (!response.ok) {
                throw new Error('Failed to generate SVG');
            }

            blob = await response.blob();
            filename = 'qrcode.svg';
        } else if (format === 'pdf') {
            // Generate PDF
            const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...options, title: 'QR Code' })
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            blob = await response.blob();
            filename = 'qrcode.pdf';
        }

        // Download file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showLoading(false);
    } catch (error) {
        console.error('Error downloading QR code:', error);
        alert('Failed to download QR code. Please try again.');
        showLoading(false);
    }
}
