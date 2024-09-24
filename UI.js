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

export const showBusted = (text) => {
    document.getElementById('busted').style.display = 'block';
    document.getElementById('busted').textContent = text;
}

export const toggleLightClass = (light) => {
    document.getElementsByClassName('center')[0].classList.toggle('on')
}