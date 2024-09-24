import * as THREE from 'three';



class LampPost extends THREE.Group {
    constructor(height) {
        super()
        const pg = new THREE.CylinderGeometry(0.1, 0.1, height);
        const pm = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const pole = new THREE.Mesh(pg, pm);
        pole.position.y = height/2;

        this.lamp = new THREE.Mesh(new THREE.SphereGeometry(0.5,10,10), new THREE.MeshBasicMaterial({color: 0xffff00}));
        this.lamp.position.y = height;
        this.add(this.lamp);

        this.light = new THREE.PointLight(0xffff88,100,50);
        this.light.position.set(0,0,height);

        this.add(this.light);
        this.add(pole);
    }

    setLight(on) {
        if(on) {
            this.lamp.material.color.setHex(0xffff00);
            this.light.intensity = 100;
        } else {
            this.lamp.material.color.setHex(0x222200);
            this.light.intensity = 0;
        }
    }
}

class Street extends THREE.Group {
    constructor(length) {
        super()
        this.posts = [];
        const g = new THREE.BoxGeometry(5, 0.2, length);
        const m = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const street = new THREE.Mesh(g, m);
        //street.receiveShadow = true;

        const clg = new THREE.BoxGeometry(0.1, 0.2, 1);
        const clm = new THREE.MeshStandardMaterial({ color: 0xffffff });
        for (let i = 0; i < length/2; i++) {
            const cl = new THREE.Mesh(clg, clm);
            cl.position.set(0,0.05,length/2 - 1 -i*2);
            this.add(cl);
        }

        const POLE_DISTANCE = 25;

        for (let i = 0; i < length/POLE_DISTANCE; i++) {
            const post = new LampPost(3.5);
            const side = i%2*2-1;
            post.position.set(side*3.5,0,length/2-i*POLE_DISTANCE);
            this.add(post);
            this.posts.push(post);
        }

        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.2,length),clm);
        const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.2,length),clm);

        l1.position.set(-2,0.05,0);
        l2.position.set(2,0.05,0);

        this.add(l1);
        this.add(l2);

        this.add(street)
    }

    setLight(on) {
        this.posts.forEach(e=>e.setLight(on));
    }
}

export { Street }