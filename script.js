


const colorPicker = document.getElementById('color-picker')
const colorHex = document.getElementById('color-hex')
const generateBtn = document.getElementById('generate-btn')





// pick color
colorPicker.addEventListener('change', e=>{
    const selectedColor = e.target.value
    colorHex.value = selectedColor

})



