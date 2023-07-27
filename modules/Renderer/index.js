var renderer = new THREE.WebGLRenderer({
	antialias: true,
	powerPreference: "high-performance"
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.gammaFactor = 2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrentLights = false;

renderer.toneMapping = THREE.noToneMapping;
renderer.toneMappingExposure = 1;

renderer.maxMorphTargets = 8;
renderer.maxMorphNormals = 4;

renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType("local");

document.body.append(renderer.domElement);

AR.Renderer = renderer;