const circle = document.querySelector('.pointer');
const circleRect = pointer.getBoundingClientRect();


var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");



function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 1, 2 * Math.PI); // Adjust the radius as needed
    ctx.fillStyle = "red"; // Set the color of the dot
    ctx.fill();
  }


  function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}

let coords = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawSineLine(speed, startX, startY, endX, endY, amplitude, frequency, initialDelay, finalDelay, finalArcHeight, arcDelay) {
    ctx.clearRect(0, 0, 700, 700);
    drawDot(50, 60);
    ctx.beginPath();

    var distanceX = endX - startX;
    var distanceY = endY - startY;
    var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    var angle = Math.atan2(distanceY, distanceX);

    var steps = speed;
    var increment = distance / steps;

    var newX = startX;
    var newY = startY;

    for (let step = 0; step <= steps; step++) {
        var t = increment * step;
        var position = ((step / steps) * (2 * Math.PI) * frequency) - (Math.PI / 2);

        var currentAmplitude = amplitude * (step / steps); // Gradually increasing amplitude

        if (step != 0) {
            newX = startX + t * Math.cos(angle) + currentAmplitude * Math.sin(position);
            newY = startY + t * Math.sin(angle) + currentAmplitude * Math.cos(position);
        }

        coords.push({ x: newX, y: newY });

        ctx.lineTo(newX, newY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        var delay = lerp(initialDelay, finalDelay, step / steps);

        console.log("x: " + newX, " y: " + newY);
        await sleep(delay);
    }

    // Second phase: arced line
    var arcCenterX = (endX + newX) / 2;
    var arcCenterY = Math.min(newY, endY) - finalArcHeight;
    var arcRadius = Math.sqrt(Math.pow(endX - arcCenterX, 2) + Math.pow(endY - arcCenterY, 2));
    var startAngle = Math.atan2(newY - arcCenterY, newX - arcCenterX);
    var endAngle = Math.atan2(endY - arcCenterY, endX - arcCenterX);

    await drawArc(arcCenterX, arcCenterY, arcRadius, startAngle, endAngle, arcDelay);
}

async function drawArc(centerX, centerY, radius, startAngle, endAngle, delay) {
    for (let t = 0; t <= 1; t += 0.01) {
        var currentAngle = lerp(startAngle, endAngle, t);
        var finalX = centerX + radius * Math.cos(currentAngle);
        var finalY = centerY + radius * Math.sin(currentAngle);

        coords.push({ x: finalX, y: finalY });

        ctx.lineTo(finalX, finalY);
        ctx.stroke();

        console.log("finx: " + finalX, " finy: " + finalY);
        await sleep(delay);
    }
}

async function print() {
    await drawSineLine(400, 650, 50, 50, 660, 20, 1, 1, 20, 10, 5);  // 100 is the height of the final arc
    for(let coord of coords){
        console.log('coords: ' + coord.x , coord.y)
    }
}

print();
  



  
  

  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
   // Adjust the delay value as needed
  


// draw 2 dots  y = startY + amplitude * Math.cos(frequency * x) + 1 * x - x / (2 * Math.tan(30 * Math.PI / 180));
// function drawDot(x, y) {
//     ctx.fillStyle = "red";      
//     ctx.fillRect(x, y, 5, 5); // changes size of dot
//   }
//   function setStartPoint() {
//     drawDot(50, 50);
//   }
//   function setEndPoint() {
//     drawDot(750, 250);
//   }
//   setStartPoint();
//   setEndPoint();

// draw a line slowly
// var lineLength = 0;
// var animationSpeed = 2;

// function drawLine() {
//   ctx.clearRect(0, 0, 500, 500);
//   ctx.beginPath();
//   ctx.moveTo(0, 0);
//   ctx.lineTo(lineLength, lineLength);
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 10;
//   ctx.stroke();

//   lineLength += animationSpeed;

//   if (lineLength <= 500) {
//     requestAnimationFrame(drawLine);
//   }
// }

// requestAnimationFrame(drawLine);

// function drawSineLine(startX, startY, endX, endY, amplitude, frequency, delay) {
//   ctx.clearRect(0, 0, 700, 700);
//   drawDot(50,50)
//   ctx.beginPath();

//   var distanceX = endX - startX;
//   var distanceY = endY - startY;
//   var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
//   var angle = Math.atan2(distanceY, distanceX);

//   var steps = distance * 2;  // doubled steps to make sine wave more smooth
//   var increment = distance / steps;

//   var step = 0;

//   function drawSegment() {
//       if (step <= steps) {

     
//         // console.log('t ' + t)
//         // console.log('distance ' + distance)
//           var t = increment * step;
//           var position = (step / steps) * (2 * Math.PI) * frequency; 
//           var newX = startX + t * Math.cos(angle) - amplitude * Math.sin(position);
//           var newY = startY + t * Math.sin(angle) + amplitude * Math.cos(position); 

//           ctx.lineTo(newX, newY);
//           ctx.strokeStyle = "black";
//           ctx.lineWidth = 2;
//           ctx.stroke();

//           step++;
//           setTimeout(drawSegment, delay);
//       }else {  // This makes sure that the final point is (endX, endY)
//         ctx.lineTo(endX, endY);
//         ctx.stroke();
//     }
//   }

//   drawSegment();
// }


// drawSineLine(650, 690, 50, 50, 15, 1);