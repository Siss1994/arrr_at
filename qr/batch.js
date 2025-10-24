// Configuration
const MAX_ITEMS = 100;

// State
let batchItems = [];
let batchResults = [];

// DOM Elements
const batchItemsContainer = document.getElementById('batch-items');
const addItemBtn = document.getElementById('add-item-btn');
const generateBatchBtn = document.getElementById('generate-batch-btn');
const batchResultsContainer = document.getElementById('batch-results-container');
const batchResultsDiv = document.getElementById('batch-results');
const downloadAllBtn = document.getElementById('download-all-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const batchSize = document.getElementById('batch-size');
const batchFormat = document.getElementById('batch-format');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addBatchItem(); // Start with one item
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addItemBtn.addEventListener('click', addBatchItem);
    generateBatchBtn.addEventListener('click', generateBatch);
    downloadAllBtn.addEventListener('click', downloadAll);
}

// Add batch item
function addBatchItem() {
    if (batchItems.length >= MAX_ITEMS) {
        alert(`Maximum ${MAX_ITEMS} items allowed`);
        return;
    }

    const itemId = Date.now();
    batchItems.push(itemId);

    const itemDiv = document.createElement('div');
    itemDiv.className = 'batch-item';
    itemDiv.dataset.id = itemId;
    itemDiv.innerHTML = `
        <input type="text" placeholder="Name" class="item-name" style="width: 150px;">
        <input type="text" placeholder="URL or Text" class="item-content" style="flex: 1;">
        <button class="remove-item">Remove</button>
    `;

    batchItemsContainer.appendChild(itemDiv);

    // Add remove handler
    const removeBtn = itemDiv.querySelector('.remove-item');
    removeBtn.addEventListener('click', () => removeBatchItem(itemId));

    updateAddButtonState();
}

// Remove batch item
function removeBatchItem(itemId) {
    batchItems = batchItems.filter(id => id !== itemId);
    const itemDiv = document.querySelector(`.batch-item[data-id="${itemId}"]`);
    if (itemDiv) {
        itemDiv.remove();
    }
    updateAddButtonState();
}

// Update add button state
function updateAddButtonState() {
    addItemBtn.disabled = batchItems.length >= MAX_ITEMS;
}

// Get batch data
function getBatchData() {
    const items = [];
    const itemDivs = document.querySelectorAll('.batch-item');

    itemDivs.forEach(div => {
        const name = div.querySelector('.item-name').value.trim();
        const content = div.querySelector('.item-content').value.trim();

        if (content) {
            items.push({
                name: name || `qr-${items.length + 1}`,
                content: content
            });
        }
    });

    return items;
}

// Show/hide loading
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Generate batch (Client-side)
async function generateBatch() {
    const items = getBatchData();

    if (items.length === 0) {
        alert('Please add at least one item with content');
        return;
    }

    showLoading(true);
    batchResults = [];

    try {
        const size = parseInt(batchSize.value);
        const format = batchFormat.value;

        for (const item of items) {
            try {
                if (format === 'png') {
                    // Generate PNG
                    const canvas = document.createElement('canvas');
                    await QRCode.toCanvas(canvas, item.content, {
                        width: size,
                        margin: 4,
                        errorCorrectionLevel: 'M'
                    });

                    const dataURL = canvas.toDataURL('image/png');
                    batchResults.push({
                        success: true,
                        name: item.name,
                        format: 'png',
                        data: dataURL,
                        canvas: canvas
                    });
                } else {
                    // Generate SVG
                    const svgString = await QRCode.toString(item.content, {
                        type: 'svg',
                        width: size,
                        margin: 4,
                        errorCorrectionLevel: 'M'
                    });

                    batchResults.push({
                        success: true,
                        name: item.name,
                        format: 'svg',
                        data: svgString
                    });
                }
            } catch (error) {
                batchResults.push({
                    success: false,
                    name: item.name,
                    error: error.message
                });
            }
        }

        displayResults();
        showLoading(false);
    } catch (error) {
        console.error('Error generating batch:', error);
        alert('Failed to generate batch QR codes. Please try again.');
        showLoading(false);
    }
}

// Display results
function displayResults() {
    batchResultsDiv.innerHTML = '';

    batchResults.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'batch-result-item';

        if (result.success) {
            if (result.format === 'png') {
                const img = document.createElement('img');
                img.src = result.data;
                img.alt = result.name;

                resultDiv.appendChild(img);
            } else {
                // SVG
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(result.data, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;
                resultDiv.appendChild(svgElement);
            }

            const nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = result.name;
            resultDiv.appendChild(nameDiv);

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn-download';
            downloadBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
            `;
            downloadBtn.onclick = () => downloadSingle(index);
            resultDiv.appendChild(downloadBtn);
        } else {
            resultDiv.innerHTML = `
                <div style="color: var(--danger-color); padding: 2rem;">
                    <strong>${result.name}</strong><br>
                    Error: ${result.error}
                </div>
            `;
        }

        batchResultsDiv.appendChild(resultDiv);
    });

    batchResultsContainer.style.display = 'block';
    batchResultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Download single QR code
function downloadSingle(index) {
    const result = batchResults[index];
    if (!result || !result.success) return;

    const format = result.format;
    const filename = `${result.name}.${format}`;

    if (format === 'png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = result.data;
        link.click();
    } else {
        // SVG
        const blob = new Blob([result.data], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Download all
async function downloadAll() {
    if (batchResults.length === 0) return;

    // Download each file individually with delay
    for (let i = 0; i < batchResults.length; i++) {
        if (batchResults[i].success) {
            downloadSingle(i);
            await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between downloads
        }
    }

    alert('All QR codes downloaded! Check your downloads folder.');
}
