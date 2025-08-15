var vid;
let img;
let originalImg; // Store original image
var vs = 5; //only even numbers
let ts = 10;
let Cset = "$#;,."; //"$#;,."

let vsSlider, tsSlider, csetInput;

function preload() {
  originalImg = loadImage("image.png");
}

function setup() {
  createCanvas(1200, 1000);
  pixelDensity(1);

  // Create a copy of the original image.
  img = originalImg.get();
  img.resize(width / vs, height / vs);

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

  // Add event listeners
  vsSlider.input(updateValues);
  tsSlider.input(updateValues);
  csetInput.input(updateValues);

  t();
}

function updateValues() {
  vs = vsSlider.value();
  ts = tsSlider.value();
  Cset = csetInput.value();

  // Always resize from the original image
  img = originalImg.get(); // Create fresh copy
  img.resize(width / vs, height / vs);

  t();
}

function t() {
  background(0);
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
