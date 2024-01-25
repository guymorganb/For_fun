/**
 * JavaScript Class to move the mouse
 */
import { mouse, straightTo, Point  } from '@nut-tree/nut-js'
import { error } from 'selenium-webdriver';
// (50, 50, 650, 660, 400, 20, 1, 1, 20, 10, 5)
class mouseMover {
    constructor(startX, startY, endX, endY, speed, amplitude, frequency, initialDelay, finalDelay, finalArcHeight, arcDelay){
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.speed = speed || 400;
        this.amplitude = amplitude || 20;
        this.frequency =frequency || 1;
        this.initialDelay = initialDelay || 1;
        this.finalDelay = finalDelay || 20;
        this.finalArcHeight = finalArcHeight || 10;
        this.arcDelay = arcDelay || 5;
        this.coordinates = [];
    }
    lerp(v0, v1, t){
        return (1 - t) * v0 + t * v1;
    }
    sleep(miliseconds){
        return new Promise(resolve => setTimeout(resolve, miliseconds));
    }
    async calculate(){
            var distanceX = this.endX - this.startX;
            var distanceY = this.endY - this.startY;
            // calculate the distance
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            // calculate the anlge of the line
            var angle = Math.atan2(distanceY, distanceX);
            // number of steps changes the speed
            var steps = this.speed;
            var increment = distance / steps;
            var step = 0;
            var newX = this.startX;
            var newY = this.startY;
            for (let step = 0; step <= steps; step++) {
                var t = increment * step;
                var position = ((step / steps) * (2 * Math.PI) * this.frequency) - (Math.PI / 2);
                var currentAmplitude = this.amplitude * (step / steps);
                let newX = this.startX + t * Math.cos(angle) + currentAmplitude * Math.sin(position);
                let newY = this.startY + t * Math.sin(angle) + currentAmplitude * Math.cos(position);
                this.coordinates.push({ x: newX, y: newY });
                var delay = this.lerp(this.initialDelay, this.finalDelay, step / steps);
                await this.sleep(delay);
            }
                // Second phase: arced line
                var arcCenterX = (this.endX + newX) / 2;
                var arcCenterY = Math.min(newY, this.endY) - this.finalArcHeight;
                var arcRadius = Math.sqrt(Math.pow(this.endX - arcCenterX, 2) + Math.pow(this.endY - arcCenterY, 2));
                var startAngle = Math.atan2(newY - arcCenterY, newX - arcCenterX);
                var endAngle = Math.atan2(this.endY - arcCenterY, this.endX - arcCenterX);
    
                await this.#drawArc(arcCenterX, arcCenterY, arcRadius, startAngle, endAngle, this.arcDelay);
                return;
    }
    async #drawArc(centerX, centerY, radius, startAngle, endAngle, delay){
        for (let t = 0; t <= 1; t += 0.01) {
            var currentAngle = this.lerp(startAngle, endAngle, t);
            var finalX = centerX + radius * Math.cos(currentAngle);
            var finalY = centerY + radius * Math.sin(currentAngle);
            // push final arc segment to the array
            this.coordinates.push({ x: finalX, y: finalY });
            await this.sleep(delay);
        }
    }
    async travel(speed){
        if(this.coordinates.length === 0){
            console.error("Coodinates must be calculated first")
            return;
        }
        if(speed < 100 || speed > 2000){
            console.error('Speed must be between 100-2000')
            return;
        }
        mouse.config.mouseSpeed = speed;
        for(let coordinate of this.coordinates){
            let focus = new Point(coordinate.x, coordinate.y)
            await mouse.move(straightTo(focus.x, focus.y))
        }
    }
}