const distance = 0;
const distanceElement = document.getElementById('distance');

export const updateDistance = (d) => {
    distanceElement.textContent = d.toFixed(1) + 'm 📏';
}

const battery = 100;
const batteryElement = document.getElementById('battery');

export const updateBattery = (b) => {
    batteryElement.textContent = '🔋 ' + b.toFixed(1) + '%';
}