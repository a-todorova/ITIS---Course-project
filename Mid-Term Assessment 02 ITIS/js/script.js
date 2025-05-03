document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded!");  

//Temperature gauge
function drawTemperature(temp) {
  const tempCtx = document.getElementById("tempCanvas").getContext("2d");
  tempCtx.clearRect(0, 0, 300, 150);

  tempCtx.font = "18px Arial";
  tempCtx.fillStyle = "black";
  tempCtx.fillText(temp + "°C", 120, 20);
  //the Bars, 20 bars; every other to be taller
  for (let i = 0; i < 20; i++) {
    let height = 50 + (i % 2) * 30;
    tempCtx.fillStyle = i < (temp / 5) ? "red" : "white";
    tempCtx.strokeStyle = "red";
    tempCtx.fillRect(10 + i * 14, 120 - height, 10, height);
    tempCtx.strokeRect(10 + i * 14, 120 - height, 10, height);
  }
}

//Pressure gauge
function drawPressure(pressure) {
  const ctx = document.getElementById("pressureCanvas").getContext("2d");
  ctx.clearRect(0, 0, 300, 300);

  const centerX = 150;
  const centerY = 150;
  const radius = 120;

// Outer gray ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = 5;
  ctx.stroke();

// Black fence above the grey
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI); // 10px outer to the gray ring
  ctx.strokeStyle = "black";
  ctx.lineWidth = 7;
  ctx.stroke();

// Background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();

// Tick marks (from -180° to 0°)
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const startAngleDeg = -180;
  const endAngleDeg = 0;

  for (let i = 0; i <= 60; i++) {
    const angleDeg = startAngleDeg + (i / 60) * (endAngleDeg - startAngleDeg);
    const angle = (angleDeg * Math.PI) / 180;

    const outerX = centerX + radius * Math.cos(angle);  // horizontal direction
    const outerY = centerY + radius * Math.sin(angle);  // vertical direction
    //for the shorter tick marks
    const innerX = centerX + (radius - 10) * Math.cos(angle);
    const innerY = centerY + (radius - 10) * Math.sin(angle);
    //the label values
    const labelX = centerX + (radius - 25) * Math.cos(angle);
    const labelY = centerY + (radius - 25) * Math.sin(angle);

//Longer tick marks for major divisions(0, 10, 20, 30, 40, 50, 60)
    if (i % 10 === 0) {
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.lineWidth = 3;
      ctx.stroke();

//Add number labels
      ctx.fillText(i.toString(), labelX, labelY);
    } else {
//Shorter tick marks for minor divisions (between 0, 10, 20, 30 ...)
      const minorInnerX = centerX + (radius - 5) * Math.cos(angle);
      const minorInnerY = centerY + (radius - 5) * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(minorInnerX, minorInnerY);
      ctx.lineTo(outerX, outerY);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
//Calculate position for the "PSI" text directly below the 60 mark
  const psiX = centerX + (radius - 25) * Math.cos(0);
  const psiY = centerY + (radius - 25) * Math.sin(0);
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText("PSI", psiX, psiY + 15);

//White pointer
  const normalized = Math.max(900, Math.min(1100, pressure));
  const value = ((normalized - 900) / 200) * 60;
  const angle = (value / 60) * 2 * Math.PI - Math.PI / 2;
  const needleLength = radius - 30;
  const needleX = centerX + needleLength * Math.cos(angle);
  const needleY = centerY + needleLength * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(needleX, needleY);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.stroke();

//Center circle (logo only)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#666";
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.font = "16px Arial";
//Calculate the width and height of the text for positioning the ellipse
  const textWidth = ctx.measureText("FIT,").width;
  const textHeight = 16;
  const circlePadding = 6;
//Red elipse measurements
  const ellipseWidth = textWidth / 2 + circlePadding + 5;
  const ellipseHeight = textHeight + circlePadding + 4;
//The red circle around the text
  ctx.beginPath();
  ctx.ellipse(centerX - 0, centerY - 50, ellipseWidth, ellipseHeight, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fillText("  FIT", centerX + 10 - textWidth / 2, centerY - 55);
  ctx.fillText("  SSAI", centerX + 10 - textWidth / 2, centerY - 40);

  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("BOOST", centerX, centerY + 60);

  drawCurvedText(ctx, "eguaG ecnamrofreP hgiH", centerX, centerY, 110, Math.PI * 0.25, Math.PI * 0.75);
}

function drawCurvedText(ctx, text, centerX, centerY, radius, startAngle, endAngle) {
  text = text.toUpperCase();
  ctx.font = "bold 12px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = text.split('');
  const angleRange = endAngle - startAngle;
  const eachAngle = angleRange / (chars.length - 1);

  for (let i = 0; i < chars.length; i++) { //for the chars to be equally spaced
    const char = chars[i];
    const angle = startAngle + i * eachAngle;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2); // for bottom arc text to appear upright(if it was - downaward)
    ctx.scale(-1, -1); // flip vertically to fix mirror effect
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}

//CO detection bar
function drawCO(co) {
  const coCtx = document.getElementById("coCanvas").getContext("2d");
  coCtx.clearRect(0, 0, 300, 150);

  coCtx.font = "18px Arial";
  coCtx.fillStyle = "black";
  coCtx.fillText(co + ", ppm", 110, 20);
//horizontal base line
  coCtx.beginPath();
  coCtx.moveTo(30, 100);
  coCtx.lineTo(270, 100);
  coCtx.strokeStyle = "black";
  coCtx.lineWidth = 3;
  coCtx.stroke();

// CO bar
  const coLevel = Math.min(240, co / 10); // converts from 1000ppm to 100pixels
  coCtx.beginPath(); //the freen bar showing the actual level
  coCtx.moveTo(30, 100);
  coCtx.lineTo(30 + coLevel, 100);
  coCtx.strokeStyle = "green";
  coCtx.lineWidth = 6;
  coCtx.stroke();

// 11 Tick marks
  for (let i = 0; i <= 10; i++) {
    let x = 30 + i * 24;
    coCtx.beginPath();
    coCtx.moveTo(x, 95);
    coCtx.lineTo(x, 105);
    coCtx.strokeStyle = "black";
    coCtx.stroke();
  }
}
// Function to get random values (moved to the top for reusability)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Update values every 2 seconds 
setInterval(() => {
    const tempValue = getRandomValue(20, 40);
    const pressureValue = getRandomValue(900, 1100);
    const coValue = getRandomValue(0, 1000);
  
    drawTemperature(tempValue);     // Use the bar with vertical lines
    drawPressure(pressureValue);    // ✅ Use the ROUND GAUGE for the middle panel
    drawCO(coValue);                // Use the horizontal CO bar with ticks
  }, 2000);

});