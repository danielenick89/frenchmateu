import * as THREE from 'three';

const getCube = (a,b,c,color,std=true) => {
    const m = std ? new THREE.MeshStandardMaterial({color}) : new THREE.MeshBasicMaterial({color})
    return new THREE.Mesh(new THREE.BoxGeometry(a,b,c), m);
} 

const getSphere = (a,color,std=true) => {
    const m = std ? new THREE.MeshStandardMaterial({color}) : new THREE.MeshBasicMaterial({color})
    return new THREE.Mesh(new THREE.SphereGeometry(a,15,15), m);        
} 

export { getCube, getSphere }