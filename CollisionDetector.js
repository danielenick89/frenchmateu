const CollisionDetector = (() => {
    const objs = [];
    let world;

    function setWorld(w) {
        world = w;
    }

    function check(car) {

        for (const obj of objs) {
            let dz = car.position.z - obj.obj.position.z - world.position.z;
            let dx = car.position.x - obj.obj.position.x - world.position.x;

            const dist = Math.sqrt(dx*dx+dz*dz);

            if (dist < obj.range && dist > 0) {
                return true;
            }
        }
        return false;
    }

    function add(obj, range) {
        objs.push({
            obj,
            range
        })
    }

    return {
        add,
        check,
        setWorld
    }
})();


export { CollisionDetector }