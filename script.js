// DOM Elements
const colorPicker = document.getElementById('color-picker');
const colorHex = document.getElementById('color-hex');
const schemeType = document.getElementById('scheme-type');
const generateBtn = document.getElementById('generate-btn');
const colorSwatches = document.querySelectorAll('.color-swatch');
const hslValues = document.getElementById('hsl-values');
const rgbValues = document.getElementById('rgb-values');
const cmykValues = document.getElementById('cmyk-values');

// Function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Function to generate colors based on scheme type
function generateSchemeColors(baseColor, schemeType) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    let colors = [];
    switch(schemeType) {
        case 'analogous':
            colors = [
                hslToHex(hsl.h - 30, hsl.s, hsl.l),
                hslToHex(hsl.h - 15, hsl.s, hsl.l),
                baseColor,
                hslToHex(hsl.h + 15, hsl.s, hsl.l),
                hslToHex(hsl.h + 30, hsl.s, hsl.l)
            ];
            break;
        case 'monochromatic':
            colors = [
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 30)),
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
                baseColor,
                hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 15)),
                hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 30))
            ];
            break;
        case 'complementary':
            colors = [
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
                baseColor,
                hslToHex(hsl.h, Math.max(0, hsl.s - 30), hsl.l),
                hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 180) % 360, hsl.s, Math.min(100, hsl.l + 15))
            ];
            break;
        case 'triadic':
            colors = [
                baseColor,
                hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 120) % 360, hsl.s, Math.min(100, hsl.l + 15)),
                hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 240) % 360, hsl.s, Math.min(100, hsl.l + 15))
            ];
            break;
        case 'split-complementary':
            colors = [
                baseColor,
                hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 150) % 360, hsl.s, Math.min(100, hsl.l + 15)),
                hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 210) % 360, hsl.s, Math.min(100, hsl.l + 15))
            ];
            break;
    }
    return colors;
}

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { 
        h: Math.round(h * 360), 
        s: Math.round(s * 100), 
        l: Math.round(l * 100) 
    };
}

// HSL to Hex conversion
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Update hex input when color picker changes
colorPicker.addEventListener('input', (e) => {
    const hexColor = e.target.value.toUpperCase();
    colorHex.value = hexColor;
    updateColorInfo(hexColor);
});

// Update color picker when hex input changes
colorHex.addEventListener('input', (e) => {
    let hexColor = e.target.value;
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.slice(1);
    }
    if (/^[0-9A-Fa-f]{6}$/.test(hexColor)) {
        colorPicker.value = '#' + hexColor;
        updateColorInfo('#' + hexColor);
    }
});

// Generate color scheme when button is clicked
generateBtn.addEventListener('click', generateColorScheme);

// Function to generate color scheme
function generateColorScheme() {
    const baseColor = colorPicker.value;
    const mode = schemeType.value;
    
    // Generate colors using our local function
    const colors = generateSchemeColors(baseColor, mode);
    
    // Update color swatches
    colors.forEach((hexColor, index) => {
        if (index < colorSwatches.length) {
            const swatch = colorSwatches[index];
            const colorDisplay = swatch.firstElementChild;
            const hexDisplay = swatch.lastElementChild;
            
            colorDisplay.style.backgroundColor = hexColor;
            hexDisplay.textContent = hexColor.toUpperCase();
        }
    });
}

// Function to update color information
function updateColorInfo(hexColor) {
    const rgb = hexToRgb(hexColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Update HSL values
    hslValues.textContent = `H: ${hsl.h}° S: ${hsl.s}% L: ${hsl.l}%`;
    
    // Update RGB values
    rgbValues.textContent = `R: ${rgb.r} G: ${rgb.g} B: ${rgb.b}`;
    
    // Calculate CMYK
    const k = 1 - Math.max(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    const c = (1 - rgb.r / 255 - k) / (1 - k);
    const m = (1 - rgb.g / 255 - k) / (1 - k);
    const y = (1 - rgb.b / 255 - k) / (1 - k);
    
    // Update CMYK values
    cmykValues.textContent = `C: ${Math.round(c * 100)}% M: ${Math.round(m * 100)}% Y: ${Math.round(y * 100)}% K: ${Math.round(k * 100)}%`;
}

// Initialize with default color
window.addEventListener('load', () => {
    const defaultColor = '#000000';
    colorPicker.value = defaultColor;
    colorHex.value = defaultColor;
    updateColorInfo(defaultColor);
    generateColorScheme();
});

// Add click-to-copy functionality for color swatches
colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        const hexValue = swatch.querySelector('div:last-child').textContent;
        navigator.clipboard.writeText(hexValue).then(() => {
            swatch.style.transform = 'scale(0.95)';
            setTimeout(() => {
                swatch.style.transform = 'scale(1)';
            }, 200);
        });
    });
});