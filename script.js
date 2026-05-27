const canvas = document.getElementById('posterCanvas');
const ctx = canvas.getContext('2d');

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputImage = document.getElementById('outputImage');

generateBtn.addEventListener('click', async () => {
    const userImgFile = document.getElementById('userImg').files[0];
    const userName = document.getElementById('userName').value;

    const bgImage = new Image();
    // നിങ്ങളുടെ ഫോൾഡറിലുള്ള പശ്ചാത്തല ചിത്രത്തിന്റെ പേര്
    bgImage.src = 'background.png'; 

    generateBtn.innerText = "തയാറാകുന്നു...";
    generateBtn.disabled = true;

    bgImage.onload = async () => {
        canvas.width = bgImage.naturalWidth;
        canvas.height = bgImage.naturalHeight;

        // 1. പശ്ചാത്തല ചിത്രം വരയ്ക്കുന്നു
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // 2. ആളുടെ ഫോട്ടോ വെള്ള ബോക്സിലേക്ക് കട്ട് ചെയ്ത് ചേർക്കുന്നു
        if (userImgFile) {
            const img = await loadImage(userImgFile);
            
            ctx.save();
            ctx.beginPath();
            // വെള്ള ബോക്സിന്റെ അളവുകൾ (X: 198, Y: 562, Width: 156, Height: 212)
            ctx.roundRect(198, 562, 156, 212, [60, 60, 0, 0]); 
            ctx.clip(); 

            ctx.drawImage(img, 198, 562, 156, 212); 
            ctx.restore();
        }

        // 3. പേര് ചേർക്കുന്നു
        if (userName) {
            ctx.font = 'bold 30px Arial'; 
            ctx.fillStyle = '#4a2c11'; 
            ctx.textAlign = 'center'; 
            ctx.fillText(userName, 605, 700); 
        }

        // ഫൈനൽ ഔട്ട്പുട്ട് ഇമേജ് സെറ്റ് ചെയ്യുന്നു
        outputImage.src = canvas.toDataURL('image/png');
        downloadBtn.style.display = 'inline-block';
        
        generateBtn.innerText = "CREATE POSTER";
        generateBtn.disabled = false;
    };

    bgImage.onerror = () => {
        alert("background.png ഫോൾഡറിൽ കണ്ടെത്താൻ കഴിഞ്ഞില്ല! ഫയൽ ഉണ്ടെന്ന് ഉറപ്പാക്കുക.");
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