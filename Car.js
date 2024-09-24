import * as THREE from 'three';
import { getCube, getSphere } from './Utils.js';


class Car extends THREE.Group {
    constructor() {
        super();

        this.DRIVE_RATE = 0.005;
        this.MAX_DRIVE = 5;
        this.STOP_ANIMATION_LENGTH = 1000;

        const carColor = 0xcf4d44

        // Create the car body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: carColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.receiveShadow = true;
        body.position.set(0, 0.25, 1)
        this.add(body);


        // Create the car wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2);
        const cerchioGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const cerchioMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            const cerchio = new THREE.Mesh(cerchioGeometry, cerchioMaterial);
            wheel.position.set(((i % 2) * 2 - 1)/2, 0, (Math.floor(i / 2) * 2)/2+0.5);
            cerchio.position.set(((i % 2) * 2 - 1)/2*1.15, 0, (Math.floor(i / 2) * 2)/2+0.5);
            wheel.rotation.set(0, 0, Math.PI / 2)
            cerchio.rotation.set(0, 0, Math.PI / 2)
            this.add(wheel);
            this.add(cerchio);
        }

        //create sphere
        const headGeometry = new THREE.SphereGeometry(0.2, 16, 10);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x423dba });

        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(-0.2, 0.6, 1)
        this.add(head);

        const a1 = getCube(0.8,0.05,0.05,carColor);
        const a2 = getCube(0.05,0.5,0.05,carColor);
        const a3 = getCube(.05,0.5,0.05,carColor);
        a1.position.set(0,0.8,0.6)
        a2.position.set(-0.4,0.575,0.6);
        a3.position.set(0.4,0.575,0.6);
        this.add(a1);
        this.add(a2);
        this.add(a3);
        const licencePlate = getCube(0.45,0.2,0.05,0xffffff);
        licencePlate.position.y = 0.2;
        this.add(licencePlate);

        const bf1 = getSphere(0.07,0xff0000,false);
        bf1.position.set(-0.35,0.35,2);
        const bf2 = getSphere(0.07,0xff0000,false);
        bf2.position.set(0.35,0.35,2);
        this.add(bf1);
        this.add(bf2);

        const f1 = getSphere(0.1,0xffff00,false);
        const fl1 = new THREE.SpotLight(0xffff00,3,6,Math.PI/4);
        f1.position.set(-0.35,0.35,0);
        fl1.position.set(-0.35,0.35,0);
        const f2 = getSphere(0.1,0xffff00,false);
        const fl2 = new THREE.SpotLight(0xffff00,3,6,Math.PI/4);
        f2.position.set(0.35,0.35,0);
        fl2.position.set(0.35,0.35,0);
        this.add(f1);
        this.add(f2);
        this.add(fl1);
        this.add(fl2);

        this.f1 = f1;
        this.f2 = f2;
        this.bf1 = bf1;
        this.bf2 = bf2;
        this.fl1 = fl1;
        this.fl2 = fl2;

        const s1 = getCube(0.2,0.1,0.02,carColor);
        s1.position.set(-0.6,0.5,0.5);
        const s2 = getCube(0.2,0.1,0.02,carColor);
        s2.position.set(0.6,0.5,0.5);
        this.add(s1);
        this.add(s2);

        this.stopStep = 0;
    }

    drive(dir,dt) {
        if(dir > 0) dir = 1;
        else if(dir < 0) dir = -1;
        this.position.x += this.DRIVE_RATE*dt*dir;
        this.rotation.y = -Math.PI/6*this.DRIVE_RATE*dt*dir*2;

        if(this.position.x > this.MAX_DRIVE) this.position.x = this.MAX_DRIVE;
        if(this.position.x < -this.MAX_DRIVE) this.position.x = -this.MAX_DRIVE;
    }

    lights(on) {
        if(on) {
            this.fl1.intensity = 3;
            this.fl2.intensity = 3;
            this.f1.material.color.setHex(0xffff00);
            this.f2.material.color.setHex(0xffff00);
            this.bf1.material.color.setHex(0xff0000);
            this.bf2.material.color.setHex(0xff0000);
        } else {
            this.fl1.intensity = 0;
            this.fl2.intensity = 0;
            this.f1.material.color.setHex(0x555500);
            this.f2.material.color.setHex(0x555500);
            this.bf1.material.color.setHex(0x550000);
            this.bf2.material.color.setHex(0x550000);

        }
    }

    stop(rate,dir,crashed) {
        if(rate>1) rate=1;
        
        this.rotation.y = -dir*Math.PI/(crashed?2:3)*(Math.pow(rate,1/3));
    }
}

export { Car }