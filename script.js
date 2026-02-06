var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.display = "block";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";

var context = canvas.getContext("2d");
var stars = 500;
var colorrange = [0, 60, 240];
var starArray = [];

// Get audio element and click to start element
const backgroundMusic = document.getElementById("backgroundMusic");
const clickToStart = document.getElementById("clickToStart");
var animationStarted = false;

// Start animation and music on click
document.addEventListener('click', function startEverything() {
    if (!animationStarted) {
        animationStarted = true;
        if (clickToStart) {
            clickToStart.style.display = 'none';
            clickToStart.remove(); // Actually remove it from DOM
        }
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
        console.log('Animation and music started!');
    }
});

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    var opacity = Math.random();
    starArray.push({ x, y, radius, hue, sat, opacity });
}

var frameNumber = 0;
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;

// Don't use baseFrame - we'll just clear with fillRect instead

function drawStars() {
    for (var i = 0; i < stars; i++) {
        var star = starArray[i];

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
        context.fill();
    }
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

const valentinePrompt = document.getElementById("valentinePrompt");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const questionText = document.getElementById("questionText");
var acceptedValentine = false;
var acceptOpacity = 0;
var noButtonInitialized = false;

// Image slideshow variables
var imageOpacity1 = 0;
var imageOpacity2 = 0;
var imageTimer = 0;
var currentImages = { img1: null, img2: null };
var imageState = 'fadeIn'; // 'fadeIn', 'hold', 'fadeOut'
var imageList = [
    'pictures/017BBC7B-9799-4925-B30F-256A3C9D6F90.JPG',
    'pictures/A4FAC85B-882F-4A02-B7B0-6B2CB9E91843.jpg',
    'pictures/DSCN0292.JPG',
    'pictures/IMG_1742.jpg',
    'pictures/IMG_1751.jpg',
    'pictures/IMG_5567.JPG',
    'pictures/IMG_5973.jpg',
    'pictures/IMG_6945.JPG',
    'pictures/IMG_7143.JPG',
    'pictures/IMG_7156.jpg',
    'pictures/IMG_7381.JPG',
    'pictures/IMG_7450.jpg',
    'pictures/IMG_7605.JPG',
    'pictures/IMG_8067.JPG',
    'pictures/lp_image.jpg'
];
var shuffledImages = [];
var imageIndex = 0;

// Shuffle function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize shuffled array when page loads
window.addEventListener('DOMContentLoaded', function() {
    shuffledImages = shuffleArray(imageList);
    console.log('Shuffled images:', shuffledImages.length, 'images loaded');
});

function getRandomPosition(isLeftHalf, imgWidth, imgHeight) {
    const margin = 50;
    const halfWidth = (canvas.width / 2) - margin * 2;
    
    let x, y;
    if (isLeftHalf) {
        x = margin + Math.random() * (halfWidth - imgWidth);
    } else {
        x = (canvas.width / 2) + margin + Math.random() * (halfWidth - imgWidth);
    }
    y = margin + Math.random() * (canvas.height - imgHeight - margin * 2);
    
    return { x, y };
}

var noButtonInitialized = false;

// Yes button handler
yesButton.addEventListener("click", () => {
    console.log('Yes button clicked! Setting acceptedValentine to true');
    acceptedValentine = true;
    // Don't set frameNumber to 99999 - keep animation running
    questionText.style.display = "none";
    yesButton.style.display = "none";
    noButton.style.display = "none";
    valentinePrompt.style.display = "none";
    
    // Hide cat gif if it's showing
    const gifOverlay = document.getElementById('catGifOverlay');
    if (gifOverlay) {
        gifOverlay.style.display = 'none';
    }
    
    // Ensure images are shuffled
    if (shuffledImages.length === 0) {
        shuffledImages = shuffleArray(imageList);
    }
    
    // Load first set of images from shuffled array
    console.log('Loading first images:', shuffledImages[imageIndex % shuffledImages.length]);
    currentImages.img1 = new Image();
    currentImages.img1.src = shuffledImages[imageIndex % shuffledImages.length];
    imageIndex++;
    
    currentImages.img2 = new Image();
    currentImages.img2.src = shuffledImages[imageIndex % shuffledImages.length];
    imageIndex++;
    
    // Reshuffle when we've gone through all images
    if (imageIndex >= shuffledImages.length) {
        shuffledImages = shuffleArray(imageList);
        imageIndex = 0;
    }
});

// No button handler - show cat gif
noButton.addEventListener("click", () => {
    // Create or show the gif overlay
    let gifOverlay = document.getElementById('catGifOverlay');
    if (!gifOverlay) {
        gifOverlay = document.createElement('div');
        gifOverlay.id = 'catGifOverlay';
        gifOverlay.style.position = 'fixed';
        gifOverlay.style.top = '50%';
        gifOverlay.style.left = '50%';
        gifOverlay.style.transform = 'translate(-50%, -50%)';
        gifOverlay.style.zIndex = '9999';
        gifOverlay.style.pointerEvents = 'none';
        
        const gifImg = document.createElement('img');
        gifImg.src = 'cat-shaking.gif';
        gifImg.style.maxWidth = '80vw';
        gifImg.style.maxHeight = '80vh';
        gifImg.style.width = 'auto';
        gifImg.style.height = 'auto';
        
        gifOverlay.appendChild(gifImg);
        document.body.appendChild(gifOverlay);
    } else {
        gifOverlay.style.display = 'block';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        gifOverlay.style.display = 'none';
    }, 3000);
});

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

function drawText() {
    // Don't draw any text until animation has started
    if (!animationStarted) {
        return;
    }
    
    // Skip original text animations if Valentine was accepted
    if (acceptedValentine) {
        // Draw images with fade in/out effect FIRST
        if (imageState === 'fadeIn') {
            imageOpacity1 += 0.01;
            imageOpacity2 += 0.01;
            if (imageOpacity1 >= 0.8) {
                imageOpacity1 = 0.8;
                imageOpacity2 = 0.8;
                imageState = 'hold';
                imageTimer = 0;
                console.log('Images loaded and faded in, holding...');
            }
        } else if (imageState === 'hold') {
            imageTimer++;
            if (imageTimer > 180) { // Hold for 3 seconds (60fps * 3)
                imageState = 'fadeOut';
                imageTimer = 0;
                console.log('Hold complete, starting fade out...');
            }
        } else if (imageState === 'fadeOut') {
            imageOpacity1 -= 0.01;
            imageOpacity2 -= 0.01;
            if (imageOpacity1 <= 0) {
                console.log('Images faded out, loading new images...');
                
                // Reset positions for new images
                currentImages.pos1 = undefined;
                currentImages.pos2 = undefined;
                
                // Load next images from shuffled array
                const newImg1 = new Image();
                newImg1.src = shuffledImages[imageIndex % shuffledImages.length];
                console.log('Loading image 1:', shuffledImages[imageIndex % shuffledImages.length]);
                imageIndex++;
                
                const newImg2 = new Image();
                newImg2.src = shuffledImages[imageIndex % shuffledImages.length];
                console.log('Loading image 2:', shuffledImages[imageIndex % shuffledImages.length]);
                imageIndex++;
                
                currentImages.img1 = newImg1;
                currentImages.img2 = newImg2;
                
                // Reshuffle when we've gone through all images
                if (imageIndex >= shuffledImages.length) {
                    shuffledImages = shuffleArray(imageList);
                    imageIndex = 0;
                    console.log('Reshuffled images');
                }
                
                // Reset opacities and go back to fadeIn
                imageOpacity1 = 0;
                imageOpacity2 = 0;
                imageState = 'fadeIn';
                imageTimer = 0;
            }
        }
        
        // ALWAYS draw the images regardless of opacity
        if (currentImages.img1 && currentImages.img1.complete && currentImages.img1.naturalWidth > 0) {
            const maxWidth = canvas.width / 3;
            const maxHeight = canvas.height / 3;
            const scale1 = Math.min(maxWidth / currentImages.img1.width, maxHeight / currentImages.img1.height, 1);
            const imgWidth1 = currentImages.img1.width * scale1;
            const imgHeight1 = currentImages.img1.height * scale1;
            
            if (!currentImages.pos1) {
                currentImages.pos1 = getRandomPosition(true, imgWidth1, imgHeight1);
            }
            
            context.globalAlpha = Math.max(imageOpacity1, 0);
            context.drawImage(currentImages.img1, currentImages.pos1.x, currentImages.pos1.y, imgWidth1, imgHeight1);
            context.globalAlpha = 1.0;
        }
        
        if (currentImages.img2 && currentImages.img2.complete && currentImages.img2.naturalWidth > 0) {
            const maxWidth = canvas.width / 3;
            const maxHeight = canvas.height / 3;
            const scale2 = Math.min(maxWidth / currentImages.img2.width, maxHeight / currentImages.img2.height, 1);
            const imgWidth2 = currentImages.img2.width * scale2;
            const imgHeight2 = currentImages.img2.height * scale2;
            
            if (!currentImages.pos2) {
                currentImages.pos2 = getRandomPosition(false, imgWidth2, imgHeight2);
            }
            
            context.globalAlpha = Math.max(imageOpacity2, 0);
            context.drawImage(currentImages.img2, currentImages.pos2.x, currentImages.pos2.y, imgWidth2, imgHeight2);
            context.globalAlpha = 1.0;
        }
        
        // ALWAYS draw acceptance message OVER the images
        var fontSize = Math.min(30, window.innerWidth / 24);
        context.font = fontSize + "px Comic Sans MS";
        context.textAlign = "center";
        context.shadowColor = "rgba(45, 45, 255, 1)";
        context.shadowBlur = 8;
        
        context.fillStyle = `rgba(45, 45, 255, ${acceptOpacity})`;
        context.fillText("I knew you would say yes! 🎉💕", canvas.width/2, canvas.height/2);
        
        if(acceptOpacity < 1){
            acceptOpacity = acceptOpacity + 0.01;
        }
        
        context.shadowColor = "transparent";
        context.shadowBlur = 0;
        
        return; // Skip rest of function
    }
    
    var fontSize = Math.min(30, window.innerWidth / 24); // Adjust font size based on screen width
    var lineHeight = 8;

    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    
    // glow effect
    context.shadowColor = "rgba(45, 45, 255, 1)";
    context.shadowBlur = 8;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    if(frameNumber < 250){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("everyday day I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    //fades out the text by decreasing the opacity
    if(frameNumber >= 250 && frameNumber < 500){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("everyday day I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    //needs this if statement to reset the opacity before next statement on canvas
    if(frameNumber == 500){
        opacity = 0;
    }
    if(frameNumber > 500 && frameNumber < 750){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;

        if (window.innerWidth < 600) {           //shortens long sentence for mobile screens
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 750 && frameNumber < 1000){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        
        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity - 0.01;
    }

    if(frameNumber == 1000){
        opacity = 0;
    }
    if(frameNumber > 1000 && frameNumber < 1250){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1250 && frameNumber < 1500){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 1500){
        opacity = 0;
    }
    if(frameNumber > 1500 && frameNumber < 1750){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1750 && frameNumber < 2000){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;
        context.fillText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2000){
        opacity = 0;
    }
    if(frameNumber > 2000 && frameNumber < 2250){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know and love you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know and love you", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2250 && frameNumber < 2500){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know and love you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know and love you", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2500){
        opacity = 0;
    }
    if(frameNumber > 2500 && frameNumber < 99999){
        context.fillStyle = `rgba(45, 45, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["I love you so much Manasvi, more than", "all the time and space in the universe can contain"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("I love you so much Manasvi, more than all the time and space in the universe can contain", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    
    if(frameNumber >= 2750 && frameNumber < 99999){
        context.fillStyle = `rgba(45, 45, 255, ${secondOpacity})`;


        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and I can't wait to spend all the time in", "the world to share that love with you foreva"], canvas.width / 2, (canvas.height/2 + 60), fontSize, lineHeight);
        } else {
            context.fillText("and I can't wait to spend all the time in the world to share that love with you foreva!", canvas.width/2, (canvas.height/2 + 50));
        }

        secondOpacity = secondOpacity + 0.01;
    }

    if(frameNumber >= 3000 && frameNumber < 99999 && !acceptedValentine){
        context.fillStyle = `rgba(45, 45, 255, ${thirdOpacity})`;
        context.fillText("Happy Valentine's Day <3", canvas.width/2, (canvas.height/2 + 120));
        thirdOpacity = thirdOpacity + 0.01;

        if (valentinePrompt.style.display !== "block") {
            valentinePrompt.style.display = "block";
        }
    }   

     // Reset the shadow effect after drawing the text
     context.shadowColor = "transparent";
     context.shadowBlur = 0;
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
}

function draw() {
    // Clear the canvas with a dark background
    context.fillStyle = "#111";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    updateStars();
    drawText();

    // Only increment frame number if animation has started
    if (animationStarted && frameNumber < 99999) {
        frameNumber++;
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    
    // Reinitialize stars on resize
    starArray = [];
    for (var i = 0; i < stars; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var radius = Math.random() * 1.2;
        var hue = colorrange[getRandom(0, colorrange.length - 1)];
        var sat = getRandom(50, 100);
        var opacity = Math.random();
        starArray.push({ x, y, radius, hue, sat, opacity });
    }
});

window.requestAnimationFrame(draw);
