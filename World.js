import * as THREE from 'three';
import { getRandom } from './Random.js'
import { Street } from './Street.js';
import { Police } from './Police.js';
import { CollisionDetector } from './CollisionDetector.js';


class Bush extends THREE.Group {
    constructor(size) {
        super();
        const bush = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.5 * size, size), new THREE.MeshStandardMaterial({ color: 0x007700 }));
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * size, 0.05 * size, size / 2), new THREE.MeshStandardMaterial({ color: 0x993300 }));
        bush.position.set(0, size / 3 * 2, 0);
        trunk.position.set(0, 0, 0)
        this.add(trunk);
        this.add(bush)
    }
}

class World extends THREE.Group {
    constructor(length, policeProbability,seed) {
        super()

        const TREE_COUNT = 100;
        this.POLICE_RANGE = 1;
        this.SIREN_POLICE_RANGE = 30;

        const random = getRandom(seed);
        const street = new Street(length);

        this.polices = [];

        const terrain = new THREE.Mesh(new THREE.PlaneGeometry(length, length), new THREE.MeshStandardMaterial({ color: 0x3dba6b }));
        terrain.rotation.x = -Math.PI / 2;

        for (let i = 0; i < TREE_COUNT; i++) {
            let x = random() * (length / 2 - 4) + 4;
            let y = random() * length - length / 2;
            let dir = random() - 0.5 > 0 ? 1 : -1;
            const size = 1 + random() * 3;
            const b = new Bush(size);
            b.position.set(dir * x, 0, y);
            this.add(b);
            CollisionDetector.add(b,size/2);
        }

        for (let i = 0; i < length / 10; i++) {
            if (random() < policeProbability) {
                const police = new Police();
                if (random() < 0.5) {
                    police.rotation.y = Math.PI / 2 * 0.8;
                    police.position.x = +0.5;
                } else {
                    police.rotation.y = -Math.PI / 2 * 0.8;
                    police.position.x = -0.5;
                }
                police.position.z = i * length / 10 - length / 2 + length / 20;
                this.polices.push(police);
                this.add(police);
                CollisionDetector.add(police,0.5);
            }
        }



        this.add(terrain)

        this.add(street);
        this.street = street;
    }

    setLight(on) {
        this.street.setLight(on);
    }

    isPoliceWatching(car) {
        let found = false;
        for(let i=0; i<this.polices.length; i++) {
            const p = this.polices[i];
            let dz = car.position.z - p.position.z - this.position.z;
            
            this.polices[i].siren((dz < this.SIREN_POLICE_RANGE) && dz >= 0);

            if(dz < this.POLICE_RANGE && dz > 0) {
                found = true;
            }
        }

        return found;
    }
}

class InfiniteExtendingWorld extends THREE.Group {

    constructor(policeProbability) {
        super()

        const seed = Math.floor(Math.random()*100000);

        this.RATIO = 0.01;
        this.WORLD_LENGTH = 100;
        this.SUBLENGTH = this.WORLD_LENGTH;

        this.world = new World(this.WORLD_LENGTH, policeProbability,seed);
        CollisionDetector.setWorld(this.world);
        this.nextWorld = new World(this.WORLD_LENGTH, policeProbability,seed);
        this.nextWorld.position.z = -this.WORLD_LENGTH;

        this.light = new THREE.AmbientLight(0xffffff, 0.8);
        this.add(this.world);
        this.add(this.nextWorld);

        this.add(this.light);
    }

    move(dt) {
        const ds = dt * this.RATIO
        this.world.position.z += ds;
        this.nextWorld.position.z += ds;
        if (this.world.position.z > this.SUBLENGTH) {
            this.world.position.z = 0;
            this.nextWorld.position.z = -this.WORLD_LENGTH;
        }
    }

    isPoliceWatching(car) {
        return this.world.isPoliceWatching(car);
    }

    setLight(on) {
        if (on) {
            this.light.intensity = 0.45;
        } else {
            this.light.intensity = 0.12;
        }
        this.world.setLight(on);
        this.nextWorld.setLight(on);
    }

    setRatio(ratio) {
        if(ratio < 0) ratio = 0; 
        this.RATIO = ratio;
    }

    getRatio() {
        return this.RATIO;
    }
}


export { InfiniteExtendingWorld };