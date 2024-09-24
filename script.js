import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InfiniteExtendingWorld } from './World.js'
import { Car } from './Car.js';
import { updateDistance, updateBattery } from './UI.js';

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

const BATTERY_RATIO = 0.004;
let battery = 100;

function animate(time) {
    const dt = time - lastTime;
    lastTime = time;
    controls.update()
    world.move(dt);

    if (currentDir) {
        car.drive(currentDir, dt);
    } else {
        car.drive(0, dt)
    }

    car.lights(lights);
    if (time - blackoutStart < blackoutTime) {
        world.setLight(false);
    } else if (Math.random() < 0.003) {
        blackoutTime = Math.random() < 0.33 ? BLACKOUT_TIME_LONG : BLACKOUT_TIME_SHORT;
        blackoutStart = time;
    } else {
        world.setLight(true);
    }
    world.setRatio(Math.sqrt(time/10000000))
    //world.setRatio(0.01)
    renderer.render(scene, camera);

    if (lights) battery -= BATTERY_RATIO * dt;

    updateDistance(time / 100);
    updateBattery(battery);
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

    console.log(event.which)

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
    console.log(event.which)
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

document.body.addEventListener('keydown', handleKeydown);
document.body.addEventListener('keyup', handleKeyup);

init();