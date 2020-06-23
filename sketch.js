

var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;
var k = 1;
var c = 1;
function setup() {
  canvas = createCanvas(1300, 600);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);

  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var IncreaseStroke = select('#IncreaseStroke');
  IncreaseStroke.mousePressed(increasestroke);

  var decreaseStroke = select('#decreaseStroke');
  decreaseStroke.mousePressed(decreasestroke);

  // var config = {
  //   apiKey: [YOUR_API_KEY],
  //   authDomain: 'my-not-awesome-project.firebaseapp.com',
  //   databaseURL: 'https://my-not-awesome-project.firebaseio.com',
  //   storageBucket: 'my-not-awesome-project.appspot.com',
  //   messagingSenderId: '583703514528'
  // };
    // Your web app's Firebase configuration
 
    // Initialize Firebase
  //   firebase.initializeApp(firebaseConfig);
  // // firebase.initializeApp(config);


  // var firebaseConfig = {
  //   apiKey: "AIzaSyBDXx7GV2vZlesFRdd-ebCYF8tkqsoMAQU",
  //   authDomain: "awesome-2e9f8.firebaseapp.com",
  //   databaseURL: "https://awesome-2e9f8.firebaseio.com",
  //   projectId: "awesome-2e9f8",
  //   storageBucket: "awesome-2e9f8.appspot.com",
  //   messagingSenderId: "1029384111532",
  //   appId: "1:1029384111532:web:feed06e46ed00af5282609"
  // };
  var firebaseConfig = {
    apiKey: "AIzaSyBDXx7GV2vZlesFRdd-ebCYF8tkqsoMAQU",
    authDomain: "awesome-2e9f8.firebaseapp.com",
    databaseURL: "https://awesome-2e9f8.firebaseio.com",
    projectId: "awesome-2e9f8",
    storageBucket: "awesome-2e9f8.appspot.com",
    messagingSenderId: "1029384111532",
    appId: "1:1029384111532:web:feed06e46ed00af5282609"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(00);

  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  stroke(255);
  strokeWeight(k);
 noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function saveDrawing() {
  var ref = database.ref('drawings');
  var data = {
    name: 'Kal',
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }
}

function gotData(data) {
  // clear the listing
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    //console.log(key);
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    var perma = createA('?id=' + key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing(key) {
  //console.log(arguments);
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    //console.log(drawing);
  }
}

function clearDrawing() {
  drawing = [];
}
function increasestroke(){
 k = k+1;
}
function decreasestroke(){
  k = k-1;
 }
