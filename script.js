const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputImage = document.getElementById('outputImage');

generateBtn.addEventListener('click', async () => {
    const userImgFile = document.getElementById('userImg').files[0];
    const userName = document.getElementById('userName').value.trim();

    const bgImage = new Image();
    bgImage.src = 'background.png'; 

    generateBtn.innerText = "തയാറാകുന്നു...";
    generateBtn.disabled = true;

    bgImage.onload = async () => {
        canvas.width = bgImage.naturalWidth;
        canvas.height = bgImage.naturalHeight;

        // 1. পচ্ছাতলം വരയ്ക്കുന്നു
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // ഫോട്ടോ വരയ്ക്കുന്ന ഭാഗം
        if (userImgFile) {
            const img = await loadImage(userImgFile);
            
            ctx.save();
            ctx.beginPath();
            
            let pX = canvas.width * 0.23;    
            let pY = canvas.height * 0.505;
            let pW = canvas.width * 0.115;
            let pH = canvas.height * 0.175;
            let radius = pW / 2; 

            ctx.moveTo(pX, pY + pH);
            ctx.lineTo(pX, pY + radius);
            ctx.arcTo(pX, pY, pX + radius, pY, radius);
            ctx.arcTo(pX + pW, pY, pX + pW, pY + radius, radius);
            ctx.lineTo(pX + pW, pY + pH);
            ctx.closePath();
            ctx.clip(); 

            ctx.drawImage(img, pX, pY, pW, pH); 
            ctx.restore();
        }

        // 2. പേര് ചേർക്കുന്ന ഭാഗം (മഞ്ഞ വരയ്ക്കുള്ളിൽ ഒതുക്കുന്നു)
        if (userName) {
            let textX = canvas.width * 0.58; 
            let textY = canvas.height * 0.735; 
            let maxWidth = canvas.width * 0.32; // മഞ്ഞ വരയുടെ പരമാവധി വീതി
            
            let fontSize = 42; // സാധാരണ വലിപ്പം
            ctx.font = bold ${fontSize}px Arial;
            
            // പേരിന്റെ നീളം മഞ്ഞ വരയേക്കാൾ കൂടുതലാണെങ്കിൽ വലിപ്പം കുറയ്ക്കുന്നു
            while (ctx.measureText(userName).width > maxWidth && fontSize > 20) {
                fontSize -= 2; // 2 പോയിന്റ് വീതം കുറയ്ക്കുന്നു
                ctx.font = bold ${fontSize}px Arial;
            }
            
            ctx.fillStyle = '#4a2c11'; 
            ctx.textAlign = 'center'; 
            ctx.fillText(userName, textX, textY); 
        }

        outputImage.src = canvas.toDataURL('image/png');
        downloadBtn.style.display = 'inline-block';
        
        generateBtn.innerText = "CREATE POSTER";
        generateBtn.disabled = false;
    };

    bgImage.onerror = () => {
        alert("background.png കണ്ടെത്താൻ കഴിഞ്ഞില്ല!");
        generateBtn.innerText = "CREATE POSTER";
        generateBtn.disabled = false;
    };
});

function loadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (f) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = f.target.result;
        };
        reader.readAsDataURL(file);
    });
}

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'muqaddima-poster.png';
    link.href = canvas.toDataURL();
    link.click();
});