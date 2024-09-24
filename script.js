import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InfiniteExtendingWorld } from './World.js'
import { Car } from './Car.js';
import { updateDistance, updateBattery, showBusted, toggleLightClass } from './UI.js';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0, 10, 100);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

let lights = false;

const world = new InfiniteExtendingWorld(0.1);
const car = new Car();

let lastTime = 0;
let blackoutStart = -500;
let blackoutTime = null;
const BLACKOUT_TIME_SHORT = 100;
const BLACKOUT_TIME_LONG = 8000;

const STOP_ANIMATION_LENGTH = 2500;
let stopStep = 0;
let ratioToStop = null, directionToStop = null;

const BATTERY_RATIO = 0.004;
let battery = 100;
let lost = false;

function animate(time) {
    const dt = time - lastTime;
    lastTime = time;
    controls.update()
    world.move(dt);
    car.lights(lights);

    if (!lights && world.isPoliceWatching(car)) {
        lost = true;
    }

    if (time - blackoutStart < blackoutTime) {
        world.setLight(false);
    } else if (Math.random() < 0.003) {
        blackoutTime = Math.random() < 0.33 ? BLACKOUT_TIME_LONG : BLACKOUT_TIME_SHORT;
        blackoutStart = time;
    } else {
        world.setLight(true);
    }
    world.setRatio(Math.sqrt(time / 10000000))
    //world.setRatio(0)
    renderer.render(scene, camera);

    if (lost || battery <= 0) {
        stop(dt, battery <= 0);
    } else {

        if (currentDir) {
            car.drive(currentDir, dt);
        } else {
            car.drive(0, dt)
        }


        if (lights) battery -= BATTERY_RATIO * dt;

        updateDistance(time / 100);
        updateBattery(battery);
    }

}

const stop = function (dt, lowBattery) {
    showBusted(lowBattery ? "LOW BATTERY" : "ARRESTED");
    if (!ratioToStop) {
        ratioToStop = world.getRatio();
        directionToStop = car.position.x > 0 ? 1 : -1;
    }
    stopStep += dt;
    const rate = stopStep / STOP_ANIMATION_LENGTH;
    if (rate < 1) {
        camera.position.y = rate * 20
        camera.position.z = rate * 50;
    }
    car.drive(directionToStop, dt);
    car.stop(rate, directionToStop);
    world.setRatio(ratioToStop * (1 - rate));
    controls.target.copy(car.position);
    controls.autoRotate = true;
}

function popuplate() {
    car.position.set(0, 0.35, 27)
    scene.add(world);
    scene.add(car);
}

function init() {
    popuplate();
    camera.position.z = 31;
    camera.position.y = 2;
    controls.target.copy(car.position);

    renderer.setAnimationLoop(animate);
}

let currentDir = null;

const handleKeydown = (event) => {
    let dir = null;

    switch (event.which) {
        case 39:
            dir = 1;
            break;
        case 37:
            dir = -1;
            break;
        case 32:
            lights = !lights;
            break;
    }

    if (dir) {
        currentDir = dir;
    }
}

const handleKeyup = (event) => {
    switch (event.which) {
        case 39:
            if (currentDir == 1)
                currentDir = null;
            break;
        case 37:
            if (currentDir == -1)
                currentDir = null;
            break;
    }
}

const handleTouchStart = (event) => {
    switch (event.target.className.split(' ')[0]) {
        case 'left': currentDir = -1;
            break;
        case 'center':
            lights = !lights;
            toggleLightClass();
            break;
        case 'right': currentDir = 1;
            break;
    }
}

const handleTouchEnd = (event) => {
    if (event.touches.length == 0) {
        currentDir = null;
    }
}

document.body.addEventListener('keydown', handleKeydown);
document.body.addEventListener('keyup', handleKeyup);
document.getElementById('controls').addEventListener('touchstart', handleTouchStart);
document.getElementById('controls').addEventListener('touchend', handleTouchEnd);

init();