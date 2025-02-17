// Color API endpoint
const colorApiBaseUrl = 'https://www.thecolorapi.com';

// DOM Elements
const colorPicker = document.getElementById('colorPicker');
const colorHex = document.getElementById('colorHex');
const schemeType = document.getElementById('schemeType');
const generateBtn = document.getElementById('generateBtn');
const colorSwatches = document.querySelectorAll('.color-swatch');
const hslValues = document.getElementById('hslValues');
const rgbValues = document.getElementById('rgbValues');
const cmykValues = document.getElementById('cmykValues');

// Initialize with a random color
window.addEventListener('load', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    updateColor(randomColor);
});

// Event Listeners
colorPicker.addEventListener('input', (e) => {
    updateColor(e.target.value);
});

colorHex.addEventListener('input', (e) => {
    const hex = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        updateColor(hex);
    }
});

generateBtn.addEventListener('click', generateColorScheme);

// Update color values and display
async function updateColor(hex) {
    colorPicker.value = hex;
    colorHex.value = hex;
    
    try {
        // Get color information from the API
        const response = await fetch(`${colorApiBaseUrl}/id?hex=${hex.replace('#', '')}`);
        const colorData = await response.json();
        
        // Update color information displays
        updateColorInfo(colorData);
        
        // Generate initial color scheme
        generateColorScheme();
    } catch (error) {
        console.error('Error fetching color data:', error);
    }
}

// Generate color scheme using the Color API
async function generateColorScheme() {
    const baseColor = colorPicker.value.replace('#', '');
    const mode = schemeType.value;
    const count = 5; // Number of colors in the scheme

    try {
        const response = await fetch(
            `${colorApiBaseUrl}/scheme?hex=${baseColor}&mode=${mode}&count=${count}`
        );
        const schemeData = await response.json();
        
        // Update color swatches
        updateColorSwatches(schemeData.colors);
    } catch (error) {
        console.error('Error generating color scheme:', error);
    }
}

// Update color swatches with new colors
function updateColorSwatches(colors) {
    colorSwatches.forEach((swatch, index) => {
        if (colors[index]) {
            const hex = colors[index].hex.value;
            swatch.style.backgroundColor = hex;
            swatch.querySelector('div:last-child').textContent = hex;
            
            // Add click-to-copy functionality
            swatch.onclick = () => {
                navigator.clipboard.writeText(hex)
                    .then(() => {
                        // Show feedback
                        const feedback = document.createElement('div');
                        feedback.textContent = 'Copied!';
                        feedback.className = 'absolute top-0 right-0 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded m-2';
                        swatch.appendChild(feedback);
                        setTimeout(() => feedback.remove(), 1000);
                    });
            };
        }
    });
}

// Update color information displays
function updateColorInfo(colorData) {
    // Update HSL Values
    hslValues.textContent = `H: ${colorData.hsl.h}° S: ${colorData.hsl.s}% L: ${colorData.hsl.l}%`;
    
    // Update RGB Values
    rgbValues.textContent = `R: ${colorData.rgb.r} G: ${colorData.rgb.g} B: ${colorData.rgb.b}`;
    
    // Calculate and update CMYK Values
    const cmyk = rgbToCmyk(
        colorData.rgb.r,
        colorData.rgb.g,
        colorData.rgb.b
    );
    cmykValues.textContent = `C: ${cmyk.c}% M: ${cmyk.m}% Y: ${cmyk.y}% K: ${cmyk.k}%`;
}

// RGB to CMYK conversion
function rgbToCmyk(r, g, b) {
    // Convert RGB to 0-1 range
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    // Find K (black)
    const k = 1 - Math.max(red, green, blue);
    
    // Calculate CMY
    const c = k === 1 ? 0 : Math.round(((1 - red - k) / (1 - k)) * 100);
    const m = k === 1 ? 0 : Math.round(((1 - green - k) / (1 - k)) * 100);
    const y = k === 1 ? 0 : Math.round(((1 - blue - k) / (1 - k)) * 100);
    
    return {
        c: c,
        m: m,
        y: y,
        k: Math.round(k * 100)
    };
}

// Add custom CSS to make color swatches interactive
const style = document.createElement('style');
style.textContent = `
    .color-swatch {
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    .color-swatch:hover {
        transform: scale(1.05);
    }
    .color-swatch:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);