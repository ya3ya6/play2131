import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import gsap from "gsap";
import { SpotLight, Vector3, Vector4 } from "three";

// CONSTANT
// const btn = document.querySelector("#btn");
// const loading = document.querySelector(".loading");
// const loadingTxt = document.querySelector(".loading-text");
const footer = document.querySelector(".footer");
const header = document.querySelector(".header");
let animationCheck = true;
let animationCount = 0;
let objects = [];

const speed = 2;
const speedGsap = 1 / speed;

// btn.style.display = "none";

const animationConfigs = [
  {
    lightColor: {
      r: 0.2980392156862745,
      g: 0.8588235294117647,
      b: 1,
    },
    floorColor: {
      r: 0.023529411764705882,
      g: 0.07450980392156863,
      b: 0.19607843137254902,
    },
    metalness: 1,
  },
  {
    lightColor: {
      r: 0.051,
      g: 1,
      b: 0.53,
    },
    floorColor: {
      r: 0.004,
      g: 0.018,
      b: 0.029,
    },
    metalness: 0.3,
  },
  {
    lightColor: {
      r: 0.03,
      g: 0.591,
      b: 1,
    },
    floorColor: {
      r: 0.003,
      g: 0.019,
      b: 0.059,
    },
    metalness: 0,
  },
  {
    lightColor: {
      r: 0.29,
      g: 0.284,
      b: 1,
    },
    floorColor: {
      r: 0.045,
      g: 0.023,
      b: 0.059,
    },
    metalness: 0,
  },
  {
    lightColor: {
      r: 0.681,
      g: 0.468,
      b: 1,
    },
    floorColor: {
      r: 0.048,
      g: 0.016,
      b: 0.047,
    },
    metalness: 0,
  },
  {
    lightColor: {
      r: 0.933,
      g: 0.571,
      b: 1,
    },
    floorColor: {
      r: 0.048,
      g: 0.026,
      b: 0.046,
    },
    metalness: 0,
  },
  {
    lightColor: {
      r: 0.933,
      g: 0.571,
      b: 1,
    },
    floorColor: {
      r: 0.048,
      g: 0.02,
      b: 0.039,
    },
    metalness: 0,
  },
];

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const guiCamera = gui.addFolder('camera')

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const group = new THREE.Group();

/**
 * Models
 */

let firstTime = true;
let mixer = null;
let wolfeAnimation = null;
let objectsAnimation = [];
let flipingAnimation = null;
let moonAnimation = null;
let objectsAction = [];
let objectsActionCheck = false;
let moonMove = null;
let moon = null;
let runCheck = false;
let runningAction = null;
let runningAction3 = null;
let flipingAction = null;
let headMoveingAction = null;
let wolfe = null;
let objRun = [false, false, false, false, false, false, false];

let forward = true;

const setTimeoutAnimation = (cb, time) => {
  let time_ = 0;
  let previousTime = Date.now();
  let isAfterFocus = false;
  const tick = () => {
    if(document.hidden){
      isAfterFocus = true;
      previousTime = Date.now();
      return requestAnimationFrame(tick);
    }
    let dt = Date.now() - previousTime;
    if(dt > 1000 / 20){
      dt = 1000 / 20;
    }
    previousTime = Date.now();
    time_ += dt;
    if(time_ >= time){
      return cb();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}


const loadingManager = new THREE.LoadingManager(
  () => {
    if (firstTime) {
      console.log("loaded");
      firstTime = false;
      // loadingTxt.style.display = "none";
      // btn.style.display = "block";

      document.querySelector('#btn__up').addEventListener('click', () => {
        gotoNextOrPrevItem(false);
      });

      document.querySelector('#btn__down').addEventListener('click', () => {
        gotoNextOrPrevItem(true);
      });

      // btn.addEventListener('click', () => {

      // loading.classList.add("end");
      // setTimeout(() => {
      //   btn.style.display = "none";
      // }, 600 * speedGsap);
      sound.play();

      setTimeoutAnimation(() => {
        moonMove.play();
        obj2();
      }, 10000 * speedGsap);

      setTimeoutAnimation(() => {
        footer.classList.add("active");
        header.classList.add("active");
        runCheck = true;
        // runningAction.play();
       
        runningAction.timeScale = 0.53;
        setTimeoutAnimation(() => {
          runningAction.play();          
        }, 1500);

        // runningAction.timeScale = 0.53;
        // setTimeout(() => {
        //   runningAction.play();          
        // }, 1400);
        runningAction.repetitions = 1;


        // runningAction.repetitions = 1;
        // runningAction.repetitions = 13;
        // runningAction.setLoop(8)
        console.log(runningAction);
      }, 14000 * speedGsap);
      // setTimeout(() => {
      //     runningAction.stopFading()
      //     console.log(runningAction);
      // }, 11000);

      gsap.to(pointLight, {
        ease: "none",
        delay: 12.6 * speedGsap,
        duration: 1 * speedGsap,
        power: 10000,
      });
      gsap.to(pointLight3BackLeftSide, {
        ease: "none",
        delay: 13.6 * speedGsap,
        duration: 2 * speedGsap,
        power: 4000,
      });

      // gsap.to(
      //     pointLight4.position, {
      //     ease: "none",
      //     duration: 1.3,
      //     delay: 5,
      //     // x: 0.98,
      //     y: 1.6,
      // }
      // )
      gsap.to(pointLight4, {
        ease: "none",
        delay: 10.6 * speedGsap,
        duration: 1.6 * speedGsap,
        power: 12,
      });
      gsap.to(spotLight, {
        ease: "none",
        delay: 10.4 * speedGsap,
        duration: 4 * speedGsap,
        intensity: 70,
      });
      gsap.to(pointLight2FrontLeft, {
        ease: "none",
        delay: 15.6 * speedGsap,
        duration: 2 * speedGsap,
        power: 10000,
      });
      // gsap.to(
      //     pointLight1, {
      //     ease: "none",
      //     delay: 8.2,
      //     duration: 1,
      //     power: 10000
      // }
      // )
      gsap.to(floor.material, {
        ease: "none",
        duration: 4 * speedGsap,
        delay: 19.6 * speedGsap,
        roughness: 1,
        metalness: 1,
        // color: '#061332',

        onComplete: () => {
          camera.updateProjectionMatrix();
        },
      });
      gsap.to(floor.material.color, {
        ease: "none",
        duration: 4 * speedGsap,
        delay: 19.6 * speedGsap,
        r: 0.023529411764705882,
        g: 0.07450980392156863,
        b: 0.19607843137254902,
        // color: '#061332',

        onComplete: () => {
          camera.updateProjectionMatrix();
        },
      });
      gsap.to(camera.position, {
        ease: "power4.inOut",
        duration: 4 * speedGsap,
        delay: 15.6 * speedGsap,
        x: 5.212,
        y: 3.9951,
        z: 4.8923,
        onComplete: () => {
          camera.updateProjectionMatrix();
        },
      });
      gsap.to(camera.rotation, {
        ease: "power4.inOut",
        duration: 4 * speedGsap,
        delay: 15.6 * speedGsap,
        x: -0.65973,
        y: 0.69115,
        z: 0.439822,
        onComplete: () => {
          camera.updateProjectionMatrix();
        },
      });
      window.camera = camera;
      gsap.to(camera, {
        ease: "power4.inOut",
        delay: 15.6 * speedGsap,
        duration: 4 * speedGsap,
        fov: 100,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });
      gsap.to(objects[0].position, {
        ease: "none",
        delay: 19.8 * speedGsap,
        duration: 6 * speedGsap,
        x: 0,
        z: 0,
      });
      // })
    }
  },

  () => {
    console.log("progress");
  }
);

const castShadowTrue = (objects) => {
  if (objects.children.length > 0) {
    objects.children.forEach((object) => {
      object.castShadow = true;
      object.receiveShadow = true;
      castShadowTrue(object);
    });
  }
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

gltfLoader.load("/models/Character/wolfe.glb", (gltf) => {
  gltf.scene.rotateY(Math.PI * -0.4);
  gltf.scene.position.x = -0.559289;
  gltf.scene.position.z = 1.47182;
  gltf.scene.position.y = 0;

  castShadowTrue(gltf.scene);

  wolfe = gltf.scene;

  scene.add(gltf.scene);

  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();

  // walkingAction.play()

  // Animation
  wolfeAnimation = new THREE.AnimationMixer(gltf.scene);
  // wolfeAnimation.timeScale=1/10;

  console.log(
    "🚀 ~ file: script.js ~ line 350 ~ gltfLoader.load ~ wolfeAnimation",
    wolfeAnimation
  );
  runningAction = wolfeAnimation.clipAction(gltf.animations[2]);
  runningAction3 = wolfeAnimation.clipAction(gltf.animations[2]);
  runningAction3.repetitions = 0;

  headMoveingAction = wolfeAnimation.clipAction(gltf.animations[1]);
  headMoveingAction.repetitions = 0;

  flipingAnimation = new THREE.AnimationMixer(gltf.scene);
  flipingAction = flipingAnimation.clipAction(gltf.animations[0]);
  flipingAction.repetitions = 0;

  window.wolfe = wolfe;

  flipingAnimation.addEventListener("finished", function (e) {
    console.log("🚀 ~ file: script.js ~ flipingAnimation ~ finished");

    console.log("🚀 ~ file: script.js ~ line 360 ~ forward", forward);
    if (forward) {
      wolfe.rotateY(-Math.PI);
      nextItem();
    } else {
      wolfe.rotateY(-Math.PI);
      previousItem();
    }
  });



});

// ===================== add animation
const hadelAnimation = (gltf) => {
  let arrAnimation = [];
  let arrAction = [];
  for (let index = 0; index < gltf.animations.length; index++) {
    let thisObjectsAnimation = new THREE.AnimationMixer(gltf.scene);
    let thisObjectsAction = thisObjectsAnimation.clipAction(
      gltf.animations[index]
    );
    thisObjectsAction.repetitions = 0;
    arrAnimation.push(thisObjectsAnimation);
    arrAction.push(thisObjectsAction);
  }
  objectsAnimation = [...objectsAnimation, arrAnimation];
  objectsAction = [...objectsAction, arrAction];
};

// ============================================
//  Start load object number 1
// ============================================

// const obj1 = () => {
if (objRun[0] === false) {
  objRun[0] = true;
  gltfLoader.load("/models/Character/Nyfits.gltf", (gltf) => {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.x = 8;
    gltf.scene.position.z = -1;
    gltf.scene.position.y = 0;
    gltf.scene.children[0].castShadow = true;
    gltf.scene.children[0].receiveShadow = true;

    gltf.scene.children[0].children[0].children[0].castShadow = true;
    gltf.scene.children[0].children[0].children[1].castShadow = true;
    gltf.scene.children[0].children[0].children[2].castShadow = true;
    gltf.scene.children[0].children[0].children[3].castShadow = true;
    gltf.scene.children[0].children[0].children[4].castShadow = true;
    gltf.scene.children[0].children[0].children[5].castShadow = true;
    gltf.scene.children[0].children[0].children[6].castShadow = true;
    gltf.scene.children[0].children[0].children[7].castShadow = true;
    gltf.scene.children[0].children[0].children[8].castShadow = true;
    gltf.scene.children[0].children[0].children[9].castShadow = true;

    gltf.scene.children[0].children[1].castShadow = true;

    gltf.scene.children[0].children[2].castShadow = true;

    gltf.scene.children[0].children[2].receiveShadow = true;

    hadelAnimation(gltf);

    objects = [...objects, gltf.scene];
    scene.add(gltf.scene);
  });
}
// };

// ============================================
//  End load object number 1
// ============================================

// ============================================
//  Start load object number 2
// ============================================
const obj2 = () => {
  if (objRun[1] === false) {
    objRun[1] = true;
    gltfLoader.load("/models/Character/Defi-Dashboard-2.gltf", (gltf) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.x = 8;
      gltf.scene.position.z = -1;
      gltf.scene.position.y = 0;
      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;

      // gltf.scene.children[0].children[2].position.y = 0.1204251;

      gltf.scene.children[0].children[0].children[0].castShadow = true;
      gltf.scene.children[0].children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[1].children[0].castShadow = true;
      gltf.scene.children[0].children[1].children[1].castShadow = true;
      gltf.scene.children[0].children[1].children[2].castShadow = true;
      gltf.scene.children[0].children[2].castShadow = true;

      hadelAnimation(gltf);

      objects = [...objects, gltf.scene];
      scene.add(gltf.scene);

      obj3();
    });
  }
};

// ============================================
//  End load object number 2
// ============================================

// ============================================
//  Start load object number 3
// ============================================
const obj3 = () => {
  if (objRun[2] === false) {
    gltfLoader.load("/models/Character/Defi-Yield.gltf", (gltf) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.x = 8;
      gltf.scene.position.z = -1;
      gltf.scene.position.y = 0;

      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;

      gltf.scene.children[0].children[0].castShadow = true;
      console.log(
        "🚀 ~ file: script.js ~ line 494 ~ gltfLoader.load ~ gltf.scene.children[0].children[0]",
        gltf.scene.children[0].children[0]
      );
      gltf.scene.children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[0].children[0].castShadow = true;
      // gltf.scene.children[0].children[0].children[0].castShadow = true;
      //   gltf.scene.children[0].children[2].castShadow = true;

      hadelAnimation(gltf);

      objects = [...objects, gltf.scene];
      scene.add(gltf.scene);

      obj4();
    });
  }
};

// ============================================
//  End load object number 3
// ============================================

// ============================================
//  Start load object number 4
// ============================================
const obj4 = () => {
  if (objRun[3] === false) {
    gltfLoader.load("/models/Character/Infinity-Skies.gltf", (gltf) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.x = 8;
      gltf.scene.position.z = -1;
      gltf.scene.position.y = 0;

      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;

      gltf.scene.children[0].children[0].castShadow = true;
      gltf.scene.children[0].children[0].receiveShadow = true;
      gltf.scene.children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[1].receiveShadow = true;

      hadelAnimation(gltf);

      objects = [...objects, gltf.scene];
      scene.add(gltf.scene);
      obj5();
    });
  }
};

// ============================================
//  End load object number 4
// ============================================

// ============================================
//  Start load object number 5
// ============================================
const obj5 = () => {
  if (objRun[4] === false) {
    gltfLoader.load("/models/Character/NFT-History.gltf", (gltf) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.x = 8;
      gltf.scene.position.z = -1;
      gltf.scene.position.y = 0;
      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;

      gltf.scene.children[0].children[0].castShadow = true;
      gltf.scene.children[0].children[0].children[0].castShadow = true;

      gltf.scene.children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[1].receiveShadow = true;
      // gltf.scene.children[0].children[2].castShadow = true;

      hadelAnimation(gltf);

      scene.add(gltf.scene);
      objects = [...objects, gltf.scene];
      // scene.add(gltf.scene);
      obj6();
    });
  }
};

// ============================================
//  End load object number 5
// ============================================

// ============================================
//  Start load object number 6
// ============================================
const obj6 = () => {
  if (objRun[5] === false) {
    gltfLoader.load("/models/Character/Safemoon.gltf", (gltf) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.x = 8;
      gltf.scene.position.z = -1;
      gltf.scene.position.y = 0;

      gltf.scene.children[0].castShadow = true;
      gltf.scene.children[0].receiveShadow = true;

      gltf.scene.children[0].children[0].castShadow = true;
      gltf.scene.children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[1].children[0].castShadow = true;
      gltf.scene.children[0].children[1].children[1].castShadow = true;
      gltf.scene.children[0].children[1].children[2].castShadow = true;

      gltf.scene.children[0].children[2].castShadow = true;
      gltf.scene.children[0].children[2].receiveShadow = true;
      // gltf.scene.children[0].children[1].castShadow = true;
      // gltf.scene.children[0].children[2].castShadow = true;

      hadelAnimation(gltf);

      objects = [...objects, gltf.scene];
      scene.add(gltf.scene);
      obj7();
    });
  }
};

// ============================================
//  End load object number 6
// ============================================
// ============================================
//  Start load object number 7
// ============================================
const obj7 = () => {
  gltfLoader.load("/models/Character/Defi-Dashboard.gltf", (gltf) => {
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.x = 8;
    gltf.scene.position.z = -1;
    gltf.scene.position.y = 0;

    gltf.scene.children[0].castShadow = true;
    gltf.scene.children[0].receiveShadow = true;

    gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.children[0].children[1].castShadow = true;
    gltf.scene.children[0].children[2].castShadow = true;
    gltf.scene.children[0].children[2].receiveShadow = true;

    hadelAnimation(gltf);

    objects = [...objects, gltf.scene];
    scene.add(gltf.scene);
  });
};

// ============================================
//  End load object number 7
// ============================================

gltfLoader.load("/models/Character/moon.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  // gltf.scene.castShadow = true
  // gltf.scene.children[0].castShadow = true
  moonAnimation = new THREE.AnimationMixer(gltf.scene);
  const moonAction = moonAnimation.clipAction(gltf.animations[0]);
  moonMove = moonAnimation.clipAction(gltf.animations[0]);
  // moonAction.play()
  moonAction.loop = THREE.LoopOnce;
  moonAction.clampWhenFinished = true;
  moon = gltf.scene.children[0];

  scene.add(gltf.scene);
  // group.add(gltf.scene)
  // obj1();
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({
    color: "#03040B",
    // metalness: -0.5,
    // roughness: 0.3,
    metalness: 0.4,
    roughness: 0.6,
    emissive: "black",
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const background = {
  modelcolor: "#061332",
};

// gui.addColor(background, 'modelcolor')
//     .name('Backgroud')
//     .onChange(() => {
//         floor.material.color.set(background.modelcolor)
//     })

/**
 * Lights
 */

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.03, 0, 1);
// scene.add(directionalLight)

// hemiLight

// const hemiLight = new THREE.HemisphereLight( 'white' , 'white' , 3)
//  scene.add(hemiLight)

//  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 0.2)
// scene.add(hemiLightHelper)

// Directional light
//  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
//  directionalLight.castShadow = true
//  directionalLight.shadow.camera.far = 2
//  directionalLight.shadow.mapSize.set(1024, 1024)
//  directionalLight.shadow.normalBias = 0
//  directionalLight.position.set(0, 2, -1.7)
//  directionalLight.position.set(-1.5, 3, -5)

//  scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
// scene.add(directionalLightHelper)

// Point light
// const pointLight = new THREE.PointLight(0xffffff, 20, 15, 6)
// pointLight.power = 800;
// pointLight.position.set(5, 4.3, -1.7)
// scene.add(pointLight)

const pointLight = new THREE.PointLight("#ffffff", 1);
pointLight.power = 0; // 10000;
pointLight.decay = 2.2;
pointLight.distance = 0;

pointLight.position.set(5.08963, 4.33107, -1.70544);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// Point light
// const pointLight1 = new THREE.PointLight("#ffffff", 1);
// pointLight.power = 10000;
// pointLight.decay = 2.2;
// pointLight.distance = 0;

// pointLight.position.set(5, 4, -1)
// scene.add(pointLight1)

// const pointLight1Helper = new THREE.PointLightHelper(pointLight1, 5);
// scene.add(pointLight1Helper);

// Point light
const pointLight2FrontLeft = new THREE.PointLight("#ffffff", 1);
pointLight2FrontLeft.power = 0; // 10000;
// pointLight2FrontLeft.power = 10000;
pointLight2FrontLeft.decay = 3;
pointLight2FrontLeft.distance = 0;

pointLight2FrontLeft.position.set(-1.74101, 3.2962, 4.16205);
scene.add(pointLight2FrontLeft);

const pointLight2FrontLeftHelper = new THREE.PointLightHelper(
  pointLight2FrontLeft,
  1
);
scene.add(pointLight2FrontLeftHelper);

// Point pointLight3BackLeftSide  // [4CDBFF, 40FFC1, 0BA3FF, 9491FF]
const pointLight3BackLeftSide = new THREE.PointLight("#9491FF", 1);
pointLight3BackLeftSide.power = 0; // 4000
pointLight3BackLeftSide.decay = 3;
pointLight3BackLeftSide.distance = 0;
pointLight3BackLeftSide.position.set(-2.54324, 3.56368, -1.1337);
scene.add(pointLight3BackLeftSide);

const pointLight3BackSideHeLeftlper = new THREE.PointLightHelper(
  pointLight3BackLeftSide,
  1
);
// scene.add(pointLight3BackSideHeLeftlper);

const pointLight4 = new THREE.PointLight("white", 1);
pointLight4.power = 0;
pointLight4.decay = 0.9;
pointLight4.distance = 30;
// pointLight4.position.set(-1.7, 0.6, -2)
// pointLight4.position.x = -2.3
pointLight4.position.y = 1.6;
// pointLight4.position.z = -9.5
scene.add(pointLight4);

const pointLight4Helper = new THREE.PointLightHelper(pointLight4, 0.2);
// scene.add(pointLight4Helper)

const spotLight = new THREE.SpotLight("white", 0, 0);
spotLight.intensity = 0;
spotLight.position.x = 0;
spotLight.position.z = -2;
spotLight.position.y = 0;
spotLight.target.position.x = -80;
spotLight.target.position.y = 200;
spotLight.target.position.z = -110;
const spotLightHelper = new THREE.DirectionalLightHelper(spotLight, 0.2);
scene.add(spotLight, spotLight.target);
spotLightHelper.update();

// Lights color

const light = {
  modelcolor: "#ffffff",
};

// gui.addColor(light, 'modelcolor')
//   .name('Light')
//   .onChange(() => {
//       pointLight.color.set(light.modelcolor)
//   })

const light2 = {
  modelcolor: "#FCFFE9",
};

// gui.addColor(light2, 'modelcolor')
//   .name('Light2')
//   .onChange(() => {
//       pointLight2FrontLeft.color.set(light2.modelcolor)
//   })

const light3 = {
  modelcolor: "#4CDBFF",
};

// gui.addColor(light3, 'modelcolor')
//   .name('Light3')
//   .onChange(() => {
//       pointLight3.color.set(light3.modelcolor)
//   })

// SHADOWS

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.radius = 16;
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = true;

pointLight2FrontLeft.shadow.mapSize.width = 1024;
pointLight2FrontLeft.shadow.mapSize.height = 1024;
pointLight2FrontLeft.shadow.radius = 16;
const pointLight2FrontLeftCameraHelper = new THREE.CameraHelper(
  pointLight2FrontLeft.shadow.camera
);
pointLight2FrontLeftCameraHelper.visible = false;

pointLight3BackLeftSide.castShadow = true;
pointLight3BackLeftSide.shadow.mapSize.width = 1024;
pointLight3BackLeftSide.shadow.mapSize.height = 1024;
pointLight3BackLeftSide.shadow.radius = 16;
const pointLight3BackSideCameraHeLeftlper = new THREE.CameraHelper(
  pointLight3BackLeftSide.shadow.camera
);
pointLight3BackSideCameraHeLeftlper.visible = false;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  80
);
// camera.position.set(5.212, 3.9951, 4.8923)
camera.position.set(1.9139, 0.67188, 5.0355);

// camera.rotation.x = -0.65973,
// camera.rotation.y =  0.691150,
// camera.rotation.z =  0.439822,

// camera.position.set(1.9139, 0.67188, 5.0355)

// guiCamera.add(camera.position, 'x').min(-20).max(20).step(0.5).name('PosX')
// guiCamera.add(camera.position, 'y').min(-20).max(20).step(0.5).name('PosY')
// guiCamera.add(camera.position, 'z').min(-20).max(20).step(0.5).name('PosZ')
// guiCamera.add(camera.rotation, 'x').min(-Math.PI/3).max(0).step(Math.PI / 100).name('RotateX')
// guiCamera.add(camera.rotation, 'y').min(0).max(Math.PI/3).step(Math.PI / 100).name('RotateY')
// guiCamera.add(camera.rotation, 'z').min(0).max(Math.PI/5).step(Math.PI / 100).name('RotateZ')
// camera.lookAt(Vector3, Vector3, Vector3)

// camera.rotateY(-0.346269 * Math.PI / 180)
// camera.rotateX(-91.4195 * Math.PI / 180)
// camera.rotateZ(-0.199846 * Math.PI / 180)

// camera.rotateY(12 * Math.PI / 180)
// camera.rotateX(-23 * Math.PI / 180)
// camera.rotateZ(0.00006 * Math.PI / 180)

camera.rotation.x = (0.2 * Math.PI) / 180;
camera.rotation.y = (14 * Math.PI) / 180;
camera.rotation.z = (-0.346 * Math.PI) / 180;

// camera.rotateX(0 * Math.PI / 180)
// camera.rotateY(-0.346 * Math.PI / 180)
// camera.rotateZ(-0.2 * Math.PI / 180)

camera.fov = 27;
camera.updateProjectionMatrix();

scene.add(camera);

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/models/Character/wolf-sound.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(false);
  sound.setVolume(0.5);
  sound.play();
});

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0.75, 0);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrolling = 0;

function nextItem() {
  animationCount += 1;


  runningAction3.repetitions += 1;
  runningAction3.enabled = true;
  runningAction3.play();
  runningAction3.timeScale = 0.53;

  gsap.to(pointLight3BackLeftSide.color, {
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    ease: "none",
    r: animationConfigs[animationCount].lightColor.r,
    g: animationConfigs[animationCount].lightColor.g,
    b: animationConfigs[animationCount].lightColor.b,
    onComplete: () => {
      animationCheck = true;
      console.log(
        "🚀 ~ file: script.js ~ line 918 ~ nextanimationCount ~ animationCheck",
        animationCheck
      );
    },
  });
  gsap.to(floor.material, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    metalness: animationConfigs[animationCount].metalness,
  });
  gsap.to(floor.material.color, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    r: animationConfigs[animationCount].floorColor.r,
    g: animationConfigs[animationCount].floorColor.g,
    b: animationConfigs[animationCount].floorColor.b,
  });
  gsap.to(objects[animationCount - 1].position, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    x: -10,
    z: 2,
  });
  gsap.to(objects[animationCount].position, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    x: 0,
    z: 0,
  });
}

function previousItem(item) {
  animationCount -= 1;


  runningAction3.repetitions += 1;
  runningAction3.enabled = true;
  runningAction3.play();
  runningAction3.timeScale = 0.53;


    setTimeoutAnimation(() => {
      wolfe.rotateY(Math.PI);
      forward = true;
    }, 40 + 1000 * runningAction.time * (1 / runningAction3.timeScale) * speedGsap )


  // runningAction.repetitions += 1;
  // runningAction.enabled = true;
  // runningAction.play();

  gsap.to(pointLight3BackLeftSide.color, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    r: animationConfigs[animationCount].lightColor.r,
    g: animationConfigs[animationCount].lightColor.g,
    b: animationConfigs[animationCount].lightColor.b,
    onComplete: () => {
      animationCheck = true;
      console.log(
        "🚀 ~ file: script.js ~ line 964 ~ previousanimationCount ~ animationCheck",
        animationCheck
      );
    },
  });
  gsap.to(floor.material, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    metalness: animationConfigs[animationCount].metalness,
  });
  gsap.to(floor.material.color, {
    ease: "none",

    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    r: animationConfigs[animationCount].floorColor.r,
    g: animationConfigs[animationCount].floorColor.g,
    b: animationConfigs[animationCount].floorColor.b,
  });
  gsap.to(objects[animationCount + 1].position, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    x: 8,
    z: -1,
  });
  gsap.to(objects[animationCount].position, {
    ease: "none",
    duration: runningAction.time * (1 / runningAction3.timeScale) * speedGsap,
    x: 0,
    z: 0,
  });
}
const filipingFunc = () => {
  flipingAction.repetitions += 1;
  flipingAction.enabled = true;
  flipingAction.play();
};

let gotoNextOrPrevItem = isNext => {
  if (animationCheck) {
    if (isNext) {
      console.log("🚀 ~ Scrolling down");
      if (animationCount < 6) {
        animationCheck = false;
        console.log("🚀 ~ file: script.js ~ line 1006 ~ forward", forward);
        if (!forward) {
          forward = true;
          console.log("🚀 ~ file: script.js ~ Scrolling down ~ flipingAction");
          // filipingFunc();
          wolfe.rotateY(Math.PI);
          nextItem();
        } else {
          forward = true;
          console.log("🚀 ~ file: script.js ~ line 1018 ~ else");
          nextItem();
        }
      }
    } else {
      if (animationCount > 0) {
        console.log("🚀 ~ Scrolling up");
        animationCheck = false;
        console.log("🚀 ~ file: script.js ~ line 1021 ~ forward", forward);
        if (forward) {
          forward = false;
          console.log("🚀 ~ file: script.js ~ Scrolling up ~ flipingAction");
          // filipingFunc();
          wolfe.rotateY(-Math.PI);
          previousItem();
        } else {
          forward = false;
          console.log("🚀 ~ file: script.js ~ line 1035 ~ else");
          previousItem();
        }
      }
    }
  }
}

document.addEventListener("wheel", function (e) {
  e.preventDefault();
  gotoNextOrPrevItem(e.deltaY > 0);
});

var raycaster;
var mouse = new THREE.Vector2(),
  INTERSECTED;
raycaster = new THREE.Raycaster();

document.addEventListener("mousedown", onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // find intersections
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    INTERSECTED = intersects[0].object;
    objects.forEach((el, ind) => {
      if (intersects.some((item) => item.object.uuid === el.children[0].uuid)) {
        for (let index = 0; index < objectsAnimation[ind].length; index++) {
          objectsAction[ind][index].repetitions += 1;
          objectsAction[ind][index].enabled = true;
          objectsAction[ind][index].play();
        }
      }
    });

    headMoveingAction.repetitions += 1;
    headMoveingAction.enabled = true;
    headMoveingAction.play();
  } else {
    INTERSECTED = null;
  }
}

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  spotLightHelper.update();

  if (moonAnimation && mixer) {
    moonAnimation.update(deltaTime * speed);
  }
  if (moon) {
    pointLight4.position.x = moon.position.x;
    pointLight4.position.z = moon.position.z;
    pointLight4.position.y = moon.position.y;
  }
  if (runCheck) {
    wolfeAnimation.update(deltaTime * speed);
    flipingAnimation.update(deltaTime * speed);
  }
  if (objectsAnimation) {
    for (let i = 0; i < objectsAnimation.length; i++) {
      for (let index = 0; index < objectsAnimation[i].length; index++) {
        objectsAnimation[i][index].update(deltaTime * speed);
      }
    }
  }

  // // Update controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();


window.addEventListener("focus", evt => {

  if(runningAction.shouldResume){
    // runningAction.time += 0.5;
    runningAction.paused = false;
    runningAction.shouldResume = false;
  }

});

window.addEventListener("blur", evt => {

  console.log(runningAction);
  if(runningAction.enabled){
    runningAction.paused = true;
    runningAction.shouldResume = true;
  }

});

