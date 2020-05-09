const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const width = Math.round(window.innerWidth / 4);
const height = Math.round(window.innerHeight / 4);
let gameOfLife = Array(width).fill().map(() => Array(height).fill(0));
let gameOfLifeCopy = Array(width).fill().map(() => Array(height).fill(0));

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = width / 2;
camera.position.y = height / 2;
camera.position.z = 102;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const deadOrAlive = (x, y) => {
    let left = x - 1, right = x + 1, upper = y - 1, lower = y + 1;
    let count = 0;

    left = left < 0 ? width - 1 : left;
    right = right > width - 1 ? 0 : right;
    upper = upper < 0 ? height - 1 : upper;
    lower = lower > height - 1 ? 0 : lower;

    if (gameOfLife[left][upper]) count++;
    if (gameOfLife[x][upper]) count++;
    if (gameOfLife[right][upper]) count++;
    if (gameOfLife[left][y]) count++;
    if (gameOfLife[right][y]) count++;
    if (gameOfLife[left][lower]) count++;
    if (gameOfLife[x][lower]) count++;
    if (gameOfLife[right][lower]) count++;

    if (gameOfLife[x][y] == 0 && count == 3) gameOfLifeCopy[x][y] = 1;
    else if (gameOfLife[x][y] == 1 && (count == 3 || count == 2)) gameOfLifeCopy[x][y] = 1;
    else gameOfLifeCopy[x][y] = 0;
}

for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        gameOfLife[i][j] = Math.random() > 0.9 ? 1 : 0;
    }
}

const executeGame = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    window.addEventListener('resize', onWindowResize, false);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            deadOrAlive(i, j);
        }
    }

    gameOfLife = gameOfLifeCopy.map(inner => inner.slice());
    let vertices = [];

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (gameOfLife[i][j]) vertices.push(i, j, 0);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ size: 1, color: 0x444444 });

    const points = new THREE.Points(geometry, material);

    scene.add(points);

    renderer.render(scene, camera);
}

window.setInterval(executeGame, 50);