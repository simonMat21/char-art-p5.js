var vid;
let img;
let originalImg; // Store original image
var vs = 5; //only even numbers
let ts = 10;
let Cset = "$#;,."; //"$#;,."

let vsSlider, tsSlider, csetInput;
let dropZone, fileInput;
let downloadButton;
let imageLoaded = false;

function preload() {
  // Don't try to load default image in preload - handle it in setup instead
}

function setup() {
  // Start with a default canvas size
  createCanvas(1200, 1000);
  pixelDensity(1);

  // Setup drag and drop functionality first
  setupDragAndDrop();

  // Try to load default image after setup
  loadImage(
    "image.png",
    // Success callback
    (loadedImg) => {
      originalImg = loadedImg;
      resizeCanvasToImage();
      imageLoaded = true;
      hideDropZone();
      t();
    },
    // Error callback
    () => {
      console.log("No default image found, showing drop zone");
      showDropZone();
      t(); // Draw the "drop an image" message
    }
  );

  createUI();
}

function createUI() {
  // Create UI controls horizontally
  let vsTitle = createP("Pixel Size (vs):");
  vsTitle.position(10, 10);
  vsTitle.style("margin", "0px");
  vsTitle.style("display", "inline-block");
  vsSlider = createSlider(1, 15, vs, 0.2);
  vsSlider.position(120, 13);
  vsSlider.style("width", "150px");

  let tsTitle = createP("Text Size (ts):");
  tsTitle.position(300, 10);
  tsTitle.style("margin", "0px");
  tsTitle.style("display", "inline-block");
  tsSlider = createSlider(1, 30, ts, 1);
  tsSlider.position(400, 13);
  tsSlider.style("width", "150px");

  let csetTitle = createP("Character Set:");
  csetTitle.position(580, 10);
  csetTitle.style("margin", "0px");
  csetTitle.style("display", "inline-block");
  csetInput = createInput(Cset);
  csetInput.position(680, 13);
  csetInput.style("width", "150px");

  // Download button
  downloadButton = createButton("Download ASCII Art");
  downloadButton.position(850, 13);
  downloadButton.style("padding", "5px 10px");
  downloadButton.style("background-color", "#4CAF50");
  downloadButton.style("color", "white");
  downloadButton.style("border", "none");
  downloadButton.style("cursor", "pointer");
  downloadButton.mousePressed(downloadImage);

  // Add event listeners
  vsSlider.input(updateValues);
  tsSlider.input(updateValues);
  csetInput.input(updateValues);
}

function resizeCanvasToImage() {
  if (originalImg) {
    // Resize canvas to match original image dimensions
    resizeCanvas(originalImg.width, originalImg.height);

    // Create a copy of the original image and resize it for processing
    img = originalImg.get();
    img.resize(width / vs, height / vs);

    console.log(`Canvas resized to: ${width} x ${height}`);
  }
}

function downloadImage() {
  if (imageLoaded) {
    // Create filename with timestamp
    let timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let filename = `ascii-art-${timestamp}.png`;

    // Save the canvas as an image
    saveCanvas(filename);
  } else {
    alert("Please load an image first!");
  }
}

function updateValues() {
  vs = vsSlider.value();
  ts = tsSlider.value();
  Cset = csetInput.value();

  // Always resize from the original image
  if (originalImg) {
    img = originalImg.get(); // Create fresh copy
    img.resize(width / vs, height / vs);
    t();
  }
}

function setupDragAndDrop() {
  // Add a small delay to ensure DOM is ready
  setTimeout(() => {
    dropZone = document.getElementById("drop-zone");
    fileInput = document.getElementById("file-input");

    if (!dropZone || !fileInput) {
      console.error("Drop zone elements not found!");
      return;
    }

    // Click to select file
    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    // Drag and drop events
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          handleFile(file);
        } else {
          alert("Please drop an image file");
        }
      }
    });

    console.log("Drag and drop setup complete");
  }, 100);
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    // Load the image using p5.js
    loadImage(e.target.result, (loadedImg) => {
      originalImg = loadedImg;
      resizeCanvasToImage();
      imageLoaded = true;
      hideDropZone();
      t();
    });
  };
  reader.readAsDataURL(file);
}

function showDropZone() {
  console.log("Showing drop zone");
  if (dropZone) {
    dropZone.classList.remove("hidden");
  } else {
    console.error("Drop zone element not found when trying to show");
  }
}

function hideDropZone() {
  console.log("Hiding drop zone");
  if (dropZone) {
    dropZone.classList.add("hidden");
  } else {
    console.error("Drop zone element not found when trying to hide");
  }
}

function t() {
  background(0);

  // Only process if we have an image
  if (!imageLoaded || !img) {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Drop an image to start", width / 2, height / 2);
    return;
  }

  loadPixels();
  img.loadPixels();
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var ind = (x + y * img.width) * 4; //very very important
      var r = img.pixels[ind + 0];
      var g = img.pixels[ind + 1];
      var b = img.pixels[ind + 2];
      var bright = (r + g + b) / 3;
      rectMode(CENTER);

      //for black & white
      //fill(bright);

      //-------------------------------------------
      //letter artwork
      if (Cset.length > 0) {
        q = floor(map(bright, 0, 255, Cset.length, 0));
        fill(255);
        noStroke();
        //fill(r,g,b);

        //Cset="*^,.;
        //Cset="01";
        //Cset=['00','01','11']

        //Cset='@&$#*'
        // Cset=['hallo','hi','i']
        textSize(ts); //close this for the others
        text(Cset[q], x * vs + 2, y * vs + 8);
      }

      //-------------------------------------------
      // textSize(15);
      // fill(bright)
      // text("rdj",x*vs+2,y*vs+8);
    }
  }
}
