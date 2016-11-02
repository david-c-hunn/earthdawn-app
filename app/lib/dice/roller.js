'use strict';

class Roller {
    constructor(container) {
        this.container = container;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.dice = [];
        this.world = null;
        this.timeStep = 1 / 60;
        this.result = 'Throw the dice and find out.';
        this.xAxisVector = new CANNON.Vec3(1, 0, 0);
        this.yAxisVector = new CANNON.Vec3(0, 1, 0);
        this.zAxisVector = new CANNON.Vec3(0, 0, 1);

        this.initThree();
        this.initCannon();

        this.render();
    }

    // Returns a promise object that resolves when the dice
    // are finished rolling.
    // @direction is a vector indicating the direction the dice
    //            will be thrown.
    throwDice(direction) {
        this.result = 'It\'s still up to chance';
        var self = this;

        var promise = new Promise(function(resolve, reject) {
            var iterations = 0;

            self.applyForce(direction);
            window.requestAnimationFrame(animate);

            function animate(timestamp) {
                self.updatePhysics();
                self.render();

                if (iterations++ < 200) {
                    window.requestAnimationFrame(animate);
                } else {
                    self.updateResult();

                    // resolve the result of the throw of the dice
                    resolve(self.result);
                }
            }
        });

        return promise;
    }

    clearDice() {
        var self = this;
        // remove each die from the world and from the scene
        this.dice.forEach(function(die, index, array) {
            die.removeFromWorld(self.world);
            die.removeFromScene(self.scene);
        });
        // clear the dice array
        this.dice.length = 0;
        this.render()
    }

    addDie(sides) {
        var die = new dice.Die({numSides: sides});
        this.dice.push(die);
        die.body.position.set(
            this.random(-200, 200), this.random(-200, 200), 35);
        die.addToScene(this.scene);
        die.addToWorld(this.world);
        die.updatePhysics();
        this.render();
    }

    updatePhysics() {
        // Step the physics world
        this.world.step(this.timeStep);
        this.dice.forEach(function(die, index, array) { die.updatePhysics(); })
    };

    render() { this.renderer.render(this.scene, this.camera); }

    updateResult() {
        var self = this;
        var total = 0;

        this.result = '';
        this.dice.forEach(function(die, index, array) {
            if (index == 0) {
                self.result = die.value().toString();
            } else {
                self.result += ' + ' + die.value().toString();
            }
            total += die.value();
        });
        this.result += ' = ' + total.toString();
    }

    buildCannonWall() {
        var shape = new CANNON.Plane();
        var body = new CANNON.Body({mass: 0});
        body.addShape(shape);
        return body;
    }

    initCannon() {
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;
        var k = 1.3

                this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82 * 800);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        // Create ground plane
        var ground = this.buildCannonWall();
        ground.quaternion.setFromAxisAngle(this.xAxisVector, 0);
        this.world.add(ground);

        // west wall
        var left = this.buildCannonWall();
        left.quaternion.setFromAxisAngle(this.yAxisVector, Math.PI / 2);
        left.position.set(-width * k, 0, 0);
        this.world.add(left);

        // north wall
        var top = this.buildCannonWall();
        top.quaternion.setFromAxisAngle(this.xAxisVector, Math.PI / 2);
        top.position.set(0, height * k, 0);
        this.world.add(top);

        // east wall
        var right = this.buildCannonWall();
        right.quaternion.setFromAxisAngle(this.yAxisVector, -Math.PI / 2);
        right.position.set(width * k, 0, 0);
        this.world.add(right);

        // south wall
        var bottom = this.buildCannonWall();
        bottom.quaternion.setFromAxisAngle(this.xAxisVector, -Math.PI / 2);
        bottom.position.set(0, -height * k, 0);
        this.world.add(bottom);
    }

    buildWall(width, height) {
        var geometry = new THREE.PlaneBufferGeometry(width, height, 6, 6);
        var material = new THREE.MeshPhongMaterial(
            {color: 0xdfdfdf, shininess: 5, shading: THREE.FlatShading});
        var plane = new THREE.Mesh(geometry, material);
        // plane.receiveShadow = true;
        return plane;
    }

    initThree() {
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
        this.camera.position.z = 1500;

        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(width * 4, height * 4),
            new THREE.MeshPhongMaterial(
                {color: 0xffffff, shininess: 0, shading: THREE.FlatShading}));
        plane.receiveShadow = true;
        this.scene.add(plane);

        var amblight =
            new THREE.AmbientLight(0x404040, 2.5);  // soft white light
        this.scene.add(amblight);

        // 0xdfdfdf

        // var leftWall = this.buildWall(0.75 * height, 1.3 * height);
        // leftWall.quaternion.setFromAxisAngle(
        //     new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        // leftWall.position.set(-width * 0.65, 0, 0);
        // this.scene.add(leftWall);

        // var rightWall = this.buildWall(0.75 * height, 1.3 * height)
        // rightWall.quaternion.setFromAxisAngle(
        //     new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        // rightWall.position.set(width * 0.65, 0, 0);
        // this.scene.add(rightWall);

        // var topWall = this.buildWall(1.3 * width, 0.75 * height)
        // topWall.quaternion.setFromAxisAngle(
        //     new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        // topWall.position.set(0, height * 0.65, 0);
        // this.scene.add(topWall);

        // var bottomWall = this.buildWall(1.3 * width, 0.75 * height)
        // bottomWall.quaternion.setFromAxisAngle(
        //     new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        // bottomWall.position.set(0, -height * 0.65, 0);
        // this.scene.add(bottomWall);

        var light = new THREE.SpotLight(0xefdfd5, 2.0);
        var mw = Math.max(width, height);

        light.position.set(-mw / 2, mw / 2, mw * 2);
        light.target.position.set(0, 0, 0);
        light.distance = mw * 5;
        light.castShadow = true;
        light.shadow.camera.near = mw / 10;
        light.shadow.camera.far = mw * 5;
        light.shadow.camera.fov = 50;
        light.shadow.bias = 0.01;
        light.shadow.darkness = 0.5;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({antialias: true});

        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;  // THREE.PCFShadowMap;
        this.renderer.setClearColor(0xffffff, 1);
        this.container.appendChild(this.renderer.domElement);
    }

    applyForce(direction) {
        var self = this;

        this.dice.forEach(function(die, index, array) {

            var worldPoint = new CANNON.Vec3(0, 0, 1);
            var impulse = new CANNON.Vec3(
                direction.x + self.random(-20, 20),
                direction.y + self.random(-20, 20), 0);

            die.body.angularDamping = 0.5;
            die.body.linearDamping = 0.7;

            die.body.applyImpulse(impulse, worldPoint);

            die.body.velocity.set(
                direction.x + self.random(-20, 20),
                direction.y + self.random(-20, 20),
                0);

            die.body.angularVelocity.set(
                direction.x + self.random(-20, 20),
                direction.y + self.random(-20, 20), self.random(-20, 20));

            // another type of dampening?
        });
    }

    random(min, max) {
        var absMin = Math.abs(min);
        var rn = Math.random() * (max + absMin) - absMin;
        return rn
    }
}
