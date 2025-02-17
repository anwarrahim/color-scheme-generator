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
    let hex = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
    // Ensure hex is 6 characters long (excluding #)
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        updateColor(hex);
    }
});

generateBtn.addEventListener('click', generateColorScheme);

// Update color values and display using the Color API
async function updateColor(hex) {
    // Remove # if present for API call
    const cleanHex = hex.replace('#', '');
    colorPicker.value = '#' + cleanHex;
    colorHex.value = '#' + cleanHex;
    
    try {
        // Using the Color Identification API endpoint
        const response = await fetch(`${colorApiBaseUrl}/id?hex=${cleanHex}`);
        if (!response.ok) {
            throw new Error('Failed to fetch color data');
        }
        const colorData = await response.json();
        
        // Update color information displays
        updateColorInfo(colorData);
        
        // Generate initial color scheme
        generateColorScheme();
    } catch (error) {
        console.error('Error fetching color data:', error);
        alert('Failed to fetch color information. Please try again.');
    }
}

// Generate color scheme using the Color API's scheme endpoint
async function generateColorScheme() {
    const baseColor = colorPicker.value.replace('#', '');
    const mode = schemeType.value;
    const count = 5; // Number of colors in the scheme

    try {
        // Using the Generate Scheme API endpoint
        const response = await fetch(
            `${colorApiBaseUrl}/scheme?hex=${baseColor}&mode=${mode}&count=${count}`
        );
        if (!response.ok) {
            throw new Error('Failed to generate color scheme');
        }
        const schemeData = await response.json();
        
        // Update color swatches with the generated scheme
        if (schemeData && schemeData.colors) {
            updateColorSwatches(schemeData.colors);
        } else {
            throw new Error('Invalid color scheme data received');
        }
    } catch (error) {
        console.error('Error generating color scheme:', error);
        alert('Failed to generate color scheme. Please try again.');
    }
}

// Update color swatches with new colors
function updateColorSwatches(colors) {
    colorSwatches.forEach((swatch, index) => {
        if (colors[index]) {
            const hex = colors[index].hex.value;
            swatch.style.backgroundColor = hex;
            const hexText = swatch.querySelector('div:last-child');
            if (hexText) {
                hexText.textContent = hex;
            }
            
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
                    })
                    .catch(err => {
                        console.error('Failed to copy color:', err);
                        alert('Failed to copy color to clipboard');
                    });
            };
        }
    });
}

// Update color information displays
function updateColorInfo(colorData) {
    if (!colorData) return;

    // Update HSL Values
    if (colorData.hsl) {
        const { h, s, l } = colorData.hsl;
        hslValues.textContent = `H: ${h}° S: ${s} L: ${l}`;
    }

    // Update RGB Values
    if (colorData.rgb) {
        const { r, g, b } = colorData.rgb;
        rgbValues.textContent = `R: ${r} G: ${g} B: ${b}`;
        
        // Calculate and update CMYK Values
        if (colorData.cmyk) {
            const { c, m, y, k } = colorData.cmyk;
            cmykValues.textContent = `C: ${c} M: ${m} Y: ${y} K: ${k}`;
        }
    }
}

// Add custom CSS for interactive color swatches
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