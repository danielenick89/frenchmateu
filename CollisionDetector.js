const CollisionDetector = (() => {
    const objs = [];
    let worldDz = 0;

    function checkObj(car,obj) {
        let dz = car.position.z - obj.obj.position.z - obj.world.position.z;
        if(dz > 0){
            dz = Math.max(dz-worldDz,0);
        }

        let dx = car.position.x - obj.obj.position.x - obj.world.position.x;

        const dist = Math.sqrt(dx*dx+dz*dz);

        if (dist < obj.range && dist > 0) {
            return true;
        }
        return false;
    }

    function check(car) {

        for (const obj of objs) {
            if(checkObj(car,obj)) return true;
        }
        return false;
    }

    function add(obj, range, world) {
        objs.push({
            obj,
            range,
            world
        })
    }

    function setWorldDz(dz) {
        worldDz = dz;
    }

    return {
        add,
        check,
        setWorldDz
    }
})();


export { CollisionDetector }