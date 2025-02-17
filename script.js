document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateBtn');
    const colorPicker = document.getElementById('colorPicker');
    const colorHexInput = document.getElementById('colorHex');
    const schemeType = document.getElementById('schemeType');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const hslValues = document.getElementById('hslValues');
    const rgbValues = document.getElementById('rgbValues');
    const cmykValues = document.getElementById('cmykValues');

    if (!generateButton || !colorPicker || !colorHexInput || !schemeType || !colorSwatches.length) {
        console.error("Some required elements are missing from the DOM.");
        return;
    }

    colorPicker.addEventListener('input', function() {
        colorHexInput.value = colorPicker.value.toUpperCase();
    });

    colorHexInput.addEventListener('input', function() {
        if (/^#[0-9A-Fa-f]{6}$/.test(colorHexInput.value)) {
            colorPicker.value = colorHexInput.value;
        }
    });

    generateButton.addEventListener('click', async function() {
        const colorHex = colorHexInput.value.replace('#', '');
        const schemeMode = schemeType.value;

        try {
            // Get color information
            const colorInfoResponse = await fetch(`https://www.thecolorapi.com/id?hex=${colorHex}`);
            if (!colorInfoResponse.ok) {
                throw new Error('Failed to fetch color information.');
            }
            const colorInfo = await colorInfoResponse.json();
            
            // Display color information
            hslValues.textContent = `H: ${colorInfo.hsl.h}° S: ${colorInfo.hsl.s}% L: ${colorInfo.hsl.l}%`;
            rgbValues.textContent = `R: ${colorInfo.rgb.r} G: ${colorInfo.rgb.g} B: ${colorInfo.rgb.b}`;
            cmykValues.textContent = `C: ${colorInfo.cmyk.c}% M: ${colorInfo.cmyk.m}% Y: ${colorInfo.cmyk.y}% K: ${colorInfo.cmyk.k}%`;

            // Get color scheme
            const colorSchemeResponse = await fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${schemeMode}&count=5`);
            if (!colorSchemeResponse.ok) {
                throw new Error('Failed to fetch color scheme.');
            }
            const colorScheme = await colorSchemeResponse.json();
            
            // Update color swatches
            colorScheme.colors.forEach((color, index) => {
                if (colorSwatches[index]) {
                    colorSwatches[index].style.backgroundColor = color.hex.value;
                    
                    // Fix the selection of the hex text inside each color swatch
                    let hexTextElement = colorSwatches[index].querySelector('.color-hex');
                    if (hexTextElement) {
                        hexTextElement.textContent = color.hex.value;
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    });
});
