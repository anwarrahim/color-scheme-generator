


const colorPicker = document.getElementById('color-picker')
const colorHex = document.getElementById('color-hex')
const generateBtn = document.getElementById('generate-btn')




let selectedColor = ''
// pick color
colorPicker.addEventListener('change', e=>{
    selectedColor = e.target.value
    colorHex.value = selectedColor
    getValuefromInput(selectedColor)
})

console.log(selectedColor)

generateBtn.addEventListener('click', ()=>{
 
   function getValuefromInput(){
    
   }

})