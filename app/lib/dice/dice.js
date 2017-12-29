'use strict';

var dice = (function() {
    var labels = [
        ' ',  '0',  '1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
    ];
    var shading = THREE.FlatShading;
    var mass = {4: 300, 6: 300, 8: 340, 10: 350, 12: 350, 20: 400};

    function getOption(options, option) {
        if (options) {
            if (options.hasOwnProperty(option)) {
                return options[option];
            }
        }
    }

    function calcTextureSize(approx) {
        return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
    }

    function chamferGeometry(vectors, faces, chamfer) {
        var chamfer_vectors = [];
        var chamfer_faces = [];
        var corner_faces = new Array(vectors.length);

        for (var i = 0; i < vectors.length; ++i) {
            corner_faces[i] = [];
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var center_point = new THREE.Vector3();
            var face = new Array(fl);

            for (var j = 0; j < fl; ++j) {
                var vv = vectors[ii[j]].clone();
                center_point.add(vv);
                corner_faces[ii[j]].push(
                    face[j] = chamfer_vectors.push(vv) - 1);
            }
            center_point.divideScalar(fl);
            for (var j = 0; j < fl; ++j) {
                var vv = chamfer_vectors[face[j]];

                vv.subVectors(vv, center_point)
                    .multiplyScalar(chamfer)
                    .addVectors(vv, center_point);
            }
            face.push(ii[fl]);
            chamfer_faces.push(face);
        }
        for (var i = 0; i < faces.length - 1; ++i) {
            for (var j = i + 1; j < faces.length; ++j) {
                var pairs = [], lastm = -1;

                for (var m = 0; m < faces[i].length - 1; ++m) {
                    var n = faces[j].indexOf(faces[i][m]);

                    if (n >= 0 && n < faces[j].length - 1) {
                        if (lastm >= 0 && m != lastm + 1)
                            pairs.unshift([i, m], [j, n]);
                        else
                            pairs.push([i, m], [j, n]);
                        lastm = m;
                    }
                }
                if (pairs.length != 4) continue;
                chamfer_faces.push([
                    chamfer_faces[pairs[0][0]][pairs[0][1]],
                    chamfer_faces[pairs[1][0]][pairs[1][1]],
                    chamfer_faces[pairs[3][0]][pairs[3][1]],
                    chamfer_faces[pairs[2][0]][pairs[2][1]], -1
                ]);
            }
        }
        for (var i = 0; i < corner_faces.length; ++i) {
            var cf = corner_faces[i], face = [cf[0]], count = cf.length - 1;

            while (count--) {
                for (var m = faces.length; m < chamfer_faces.length; ++m) {
                    var index = chamfer_faces[m].indexOf(face[face.length - 1]);

                    if (index >= 0 && index < 4) {
                        if (--index == -1) index = 3;
                        var next_vertex = chamfer_faces[m][index];
                        if (cf.indexOf(next_vertex) >= 0) {
                            face.push(next_vertex);
                            break;
                        }
                    }
                }
            }
            face.push(-1);
            chamfer_faces.push(face);
        }
        return {vertices: chamfer_vectors, faces: chamfer_faces};
    }

    function makeGeometry(vertices, faces, radius, tab, af) {
        var geom = new THREE.Geometry();

        for (var i = 0; i < vertices.length; ++i) {
            var vertex = vertices[i].multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var aa = Math.PI * 2 / fl;

            for (var j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(
                    ii[0], ii[j + 1], ii[j + 2],
                    [
                      geom.vertices[ii[0]], geom.vertices[ii[j + 1]],
                      geom.vertices[ii[j + 2]]
                    ],
                    0, ii[fl] + 1));
                geom.faceVertexUvs[0].push([
                    new THREE.Vector2(
                        (Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                    new THREE.Vector2(
                        (Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 /
                            (1 + tab)),
                    new THREE.Vector2(
                        (Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                        (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))
                ]);
            }
        }
        geom.computeFaceNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

        return geom;
    }

    function normalize(vertices) {
        var normal = new Array(vertices.length);

        for (var i = 0; i < vertices.length; ++i) {
            normal[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
        }
        return normal;
    }

    function createGeometry(vertices, faces, radius, tab, af, chamfer) {
        var chamGeo = chamferGeometry(normalize(vertices), faces, chamfer);
        var geom =
            makeGeometry(chamGeo.vertices, chamGeo.faces, radius, tab, af);
        return geom;
    }

    function calcTextureSize(approx) {
        return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
    }

    function dieMaterial(
        size, margin, specular, shininess, dieColor, labelColor) {
        function createTextTexture(text, color, back_color) {
            if (text == undefined) {
                return null;
            }

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var ts = calcTextureSize(size + size * 2 * margin) * 2;

            canvas.width = canvas.height = ts;
            context.font = ts / (1 + 2 * margin) + 'pt Arial';
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = color;
            context.fillText(text, canvas.width / 2, canvas.height / 2);

            var texture = new THREE.Texture(canvas);

            texture.needsUpdate = true;

            return texture;
        }

        var materials = [];

        for (var i = 0; i < labels.length; ++i) {
            var textTexture =
                createTextTexture(labels[i], labelColor, dieColor);

            var phongMat = new THREE.MeshPhongMaterial({
                specular: specular,
                color: dieColor,
                shininess: shininess,
                shading: shading,
                map: textTexture
            });

            materials.push(phongMat);
        }

        return materials;
    }

    function d4Material(size, margin) {
        function createD4Text(text, color, back_color) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var ts = calcTextureSize(size + margin) * 2;

            canvas.width = canvas.height = ts;
            context.font = (ts - margin) / 1.5 + 'pt Arial';
            context.fillStyle = back_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = color;

            for (var i in text) {
                context.fillText(
                    text[i], canvas.width / 2, canvas.height / 2 - ts * 0.3);
                context.translate(canvas.width / 2, canvas.height / 2);
                context.rotate(Math.PI * 2 / 3);
                context.translate(-canvas.width / 2, -canvas.height / 2);
            }
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }
        var materials = [];
        var labels =
            [[], [0, 0, 0], [2, 4, 3], [1, 3, 4], [2, 1, 4], [1, 2, 3]];

        for (var i = 0; i < labels.length; ++i) {
            var textTexture = createD4Text(labels[i], labelColor, dieColor);

            var phongMat = new THREE.MeshPhongMaterial({
                specular: specular,
                color: dieColor,
                shininess: shininess,
                shading: shading,
                map: textTexture
            });

            materials.push(phongMat);
        }

        return materials;
    }

    function vertices(numSides) {
        let retval = null;

        switch (numSides) {
            case 4:
                retval = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
                break;
            case 6:
                retval = [
                    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
                ];
                break;
            case 8:
                retval = [
                    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1],
                    [0, 0, -1]
                ];
                break;
            case 10:
                var a = Math.PI * 2 / 10, k = Math.cos(a), h = 0.105, v = -1;
                retval = [];
                for (var i = 0, b = 0; i < 10; ++i, b += a) {
                    retval.push(
                        [Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
                }
                retval.push([0, 0, -1]);
                retval.push([0, 0, 1]);
                break;
            case 12:
                let p = (1 + Math.sqrt(5)) / 2;
                let q = 1 / p;
                retval = [
                    [0, q, p],  [0, q, -p],  [0, -q, p],  [0, -q, -p],
                    [p, 0, q],  [p, 0, -q],  [-p, 0, q],  [-p, 0, -q],
                    [q, p, 0],  [q, -p, 0],  [-q, p, 0],  [-q, -p, 0],
                    [1, 1, 1],  [1, 1, -1],  [1, -1, 1],  [1, -1, -1],
                    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
                ];
                break;
            case 20:
                var t = (1 + Math.sqrt(5)) / 2;
                retval = [
                    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t],
                    [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1],
                    [-t, 0, -1], [-t, 0, 1]
                ];
                break;
            default:
                throw new Error('Error: invalid numSides value: ' + numSides);
        }

        return retval;
    }

    function faces(numSides) {
        switch (numSides) {
            case 4:
                return [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
            case 6:
                return [
                    [0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
                    [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]
                ];
            case 8:
                return [
                    [0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4],
                    [1, 3, 4, 5], [1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8]
                ];
            case 10:
                return [
                    [5, 7, 11, 0], [4, 2, 10, 1], [1, 3, 11, 2], [0, 8, 10, 3],
                    [7, 9, 11, 4], [8, 6, 10, 5], [9, 1, 11, 6], [2, 0, 10, 7],
                    [3, 5, 11, 8], [6, 4, 10, 9], [1, 0, 2, -1], [1, 2, 3, -1],
                    [3, 2, 4, -1], [3, 4, 5, -1], [5, 4, 6, -1], [5, 6, 7, -1],
                    [7, 6, 8, -1], [7, 8, 9, -1], [9, 8, 0, -1], [9, 0, 1, -1]
                ];
            case 12:
                return [
                    [2, 14, 4, 12, 0, 1], [15, 9, 11, 19, 3, 2],
                    [16, 10, 17, 7, 6, 3], [6, 7, 19, 11, 18, 4],
                    [6, 18, 2, 0, 16, 5], [18, 11, 9, 14, 2, 6],
                    [1, 17, 10, 8, 13, 7], [1, 13, 5, 15, 3, 8],
                    [13, 8, 12, 4, 5, 9], [5, 4, 14, 9, 15, 10],
                    [0, 12, 8, 10, 16, 11], [3, 19, 7, 17, 1, 12]
                ];
            case 20:
                return [
                    [0, 11, 5, 1], [0, 5, 1, 2],   [0, 1, 7, 3],
                    [0, 7, 10, 4], [0, 10, 11, 5], [1, 5, 9, 6],
                    [5, 11, 4, 7], [11, 10, 2, 8], [10, 7, 6, 9],
                    [7, 1, 8, 10], [3, 9, 4, 11],  [3, 4, 2, 12],
                    [3, 2, 6, 13], [3, 6, 8, 14],  [3, 8, 9, 15],
                    [4, 9, 5, 16], [2, 4, 11, 17], [6, 2, 10, 18],
                    [8, 6, 7, 19], [9, 8, 1, 20]
                ];
            default:
                throw new Error('Error: invalid numSides value: ' + numSides);
        }
    }

    function createMesh(
        numSides, scale, specular, shininess, dieColor, labelColor) {
        var geo, mat;

        switch (numSides) {
            case 4:
                geo = createGeometry(
                    vertices(4), faces(4), scale, -0.1, Math.PI * 7 / 6, 0.96);
                mat = new THREE.MeshFaceMaterial(
                    d4Material(scale / 2, scale * 2));
                break;
            case 6:
                geo = createGeometry(
                    vertices(6), faces(6), scale, 0.1, Math.PI / 4, 0.96);
                mat = new THREE.MeshFaceMaterial(dieMaterial(
                    scale / 2, 1.0, specular, shininess, dieColor, labelColor));
                break;
            case 8:
                geo = createGeometry(
                    vertices(8), faces(8), scale, 0, -Math.PI / 4 / 2, 0.965);
                mat = new THREE.MeshFaceMaterial(dieMaterial(
                    scale / 2, 1.2, specular, shininess, dieColor, labelColor));
                break;
            case 10:
                geo = createGeometry(
                    vertices(10), faces(10), scale, 0, Math.PI * 6 / 5, 0.945);
                mat = new THREE.MeshFaceMaterial(dieMaterial(
                    scale / 2, 1.0, specular, shininess, dieColor, labelColor));
                break;
            case 12:
                geo = createGeometry(
                    vertices(12), faces(12), scale, 0.2, -Math.PI / 4 / 2,
                    0.968);
                mat = new THREE.MeshFaceMaterial(dieMaterial(
                    scale / 2, 1.0, specular, shininess, dieColor, labelColor));
                break;
            case 20:
                geo = createGeometry(
                    vertices(20), faces(20), scale, -0.2, -Math.PI / 4 / 2,
                    0.955);
                mat = new THREE.MeshFaceMaterial(dieMaterial(
                    scale / 2, 1.0, specular, shininess, dieColor, labelColor));
                break;
            default:
                throw new Error('Error: invalid numSides value: ' + numSides);
        }
        var mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;

        return mesh;
    }

    function createBody(vertices, faces, radius, mass) {
        var shape = createShape(normalize(vertices), faces, radius);
        var body = new CANNON.Body({mass: mass});
        body.addShape(shape);
        return body;
    }

    function createShape(vertices, faces, radius) {
        var cv = new Array(vertices.length), cf = new Array(faces.length);

        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
        }
        for (var i = 0; i < faces.length; ++i) {
            cf[i] = faces[i].slice(0, faces[i].length - 1);
        }

        return new CANNON.ConvexPolyhedron(cv, cf);
    }

    function distance(pos1, pos2) {
        var d = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + 
            Math.pow(pos1.y - pos2.y, 2) +
            Math.pow(pos1.z - pos2.z, 2));

        return d;
    }

    class Die {
        constructor(options) {
            this.numSides = getOption(options, 'numSides') || 4;
            var scale = getOption(options, 'scale') || 150;
            var specular = getOption(options, 'specular') || 0x172022;
            var dieColor = getOption(options, 'dieColor') || 0xf0f0f0;
            var shininess = getOption(options, 'shininess') || 40;
            var labelColor = getOption(options, 'labelColor') || '#aaaaaa';
            this.mesh = createMesh(
                this.numSides, scale, specular, shininess, dieColor,
                labelColor);
            this.body = createBody(
                vertices(this.numSides), faces(this.numSides), scale,
                mass[this.numSides]);
        }

        // returns the current value of the die. For example, if the die has
        // six sides, this is the value on the face facing upwards.
        value() {
            var axis = new THREE.Vector3(0, 0, this.numSides == 4 ? -1 : 1);
            var closestFace, closestAngle = Math.PI * 2;
            var numFaces = this.mesh.geometry.faces.length;

            for (var i = 0; i < numFaces; ++i) {
                var face = this.mesh.geometry.faces[i];

                if (face.materialIndex == 0) {
                    continue;
                }

                var angle = face.normal.clone()
                                .applyQuaternion(this.body.quaternion)
                                .angleTo(axis);

                if (angle < closestAngle) {
                    closestAngle = angle;
                    closestFace = face;
                }
            }

            return closestFace.materialIndex - 1;
        }

        addToWorld(world) { world.add(this.body); }

        removeFromWorld(world) { world.removeBody(this.body); }

        addToScene(scene) { scene.add(this.mesh); }

        removeFromScene(scene) { scene.remove(this.mesh); }

        updatePhysics() {
            var delta = distance(this.mesh.position, this.body.position);
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);
            return delta;
        }
    }

    return {Die: Die};
})();
