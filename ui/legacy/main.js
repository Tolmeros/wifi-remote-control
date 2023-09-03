/* -------------------------------------------------------------------------- */
// On document ready
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function() {
  trim.loadFromLocalStorage();
});

/* ------------------------------------------------------------------------------------------ */
// Config
/* ------------------------------------------------------------------------------------------ */
if (typeof config == "undefined") {
  config = function() {}
}


/* ------------------------------------------------------------------------------------------ */
// Tools
/* ------------------------------------------------------------------------------------------ */
if (typeof tools == "undefined") {
  tools = function() {}
}

tools.cicleCoordsToScuareCoords = function(x, y) {
  // Transform to scuare
  let u2 = x * x;
  let v2 = y * y;
  let twosqrt2 = 2.0 * Math.sqrt(2.0);
  let subtermx = 2.0 + u2 - v2;
  let subtermy = 2.0 - u2 + v2;
  let termx1 = subtermx + x * twosqrt2;
  let termx2 = subtermx - x * twosqrt2;
  let termy1 = subtermy + y * twosqrt2;
  let termy2 = subtermy - y * twosqrt2;
  if ( termx1 < 0) { termx1 = 0}
  if ( termx2 < 0) { termx2 = 0}
  if ( termy1 < 0) { termy1 = 0}
  if ( termy2 < 0) { termy2 = 0}
  u = 0.5 * Math.sqrt(termx1) - 0.5 * Math.sqrt(termx2);
  v = 0.5 * Math.sqrt(termy1) - 0.5 * Math.sqrt(termy2);
  if ( u > 1) { u = 1}
  if ( u < -1) { u = -1}
  if ( v > 1) { v = 1}
  if ( v < -1) { v = -1}
  return [u, v]
}


/* ------------------------------------------------------------------------------------------ */
// Touch Controls
/* ------------------------------------------------------------------------------------------ */
if (typeof touch == "undefined") {
  touch = function() {}
}

touch.control1 = nipplejs.create({
    mode: 'dynamic',
    zone: document.getElementById('control1'),
    color: 'blue',
    size: 150,
    maxNumberOfNipples: 1,
    multitouch: true
});

touch.control1.nippleid = 0

touch.control1.on('added', function (evt, nipple) {
  nipple.on('start move end dir plain', function (evt) {
    touch.control1.nippleid = evt.target.id;
  });
});

touch.control2 = nipplejs.create({
    mode: 'dynamic',
    zone: document.getElementById('control2'),
    color: 'blue',
    size: 150,
    maxNumberOfNipples: 1,
    multitouch: true
});

touch.control2.nippleid = 0

touch.control2.on('added', function (evt, nipple) {
  nipple.on('start move end dir plain', function (evt) {
    touch.control2.nippleid = evt.target.id;
  });
});

/* ------------------------------------------------------------------------------------------ */
// Gamepad
/* ------------------------------------------------------------------------------------------ */
if (typeof gamepad == "undefined") {
  gamepad = function() {}
}

gamepad.buttonFadeTime = 200
gamepad.isEnabled = false

document.getElementById("btnJoystick").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    if (gamepad.isEnabled == false) {
      console.log("Gamepad Enabled")
      gamepad.enabled();
    } else {
      console.log("Gamepad Disabled")
      gamepad.disable();
    }
  }
});

gamepad.enabled = function() {
  document.getElementById("btnJoystick").style.backgroundColor = ui.btnActiveColor;
  document.getElementById("joystick1").style.display = 'inherit';
  document.getElementById("joystick2").style.display = 'inherit';
  gamepad.isEnabled = true;

  if (config.gamepadAxis12FeedbackStyle === 'Circle') {
    document.getElementById("joystick1").style.borderRadius = "75px";
  }
  if (config.gamepadAxis12FeedbackStyle === 'Square') {
    document.getElementById("joystick1").style.borderRadius = "8px";
  }
  if (config.gamepadAxis12FeedbackStyle === 'PowerStick') {
    document.getElementById("joystick1").style.borderRadius = "8px";
    document.getElementById("joystickFeedback1").style.left = "50%";
    document.getElementById("joystickFeedback1").style.top = "100%";
  }

  if (config.gamepadAxis34FeedbackStyle === 'Circle') {
    document.getElementById("joystick2").style.borderRadius = "75px";
  }
  if (config.gamepadAxis34FeedbackStyle === 'Square') {
    document.getElementById("joystick2").style.borderRadius = "8px";
  }
  if (config.gamepadAxis34FeedbackStyle === 'PowerStick') {
    document.getElementById("joystick2").style.borderRadius = "8px";
    document.getElementById("joystickFeedback2").style.left = "50%";
    document.getElementById("joystickFeedback2").style.top = "100%";
  }
}

gamepad.disable = function() {
  document.getElementById("btnJoystick").style.backgroundColor = ui.btnInactiveColor;
  document.getElementById("joystick1").style.display = 'none';
  document.getElementById("joystick2").style.display = 'none';
  gamepad.isEnabled = false;
}

joypad.on('connect', e => {
  const { id } = e.gamepad;
  console.log(`${id} connected!`);
});

joypad.on('button_press', e => {
  if (ui.areBtnsLocked  == false) {
    if (gamepad.isEnabled) {
      const { buttonName } = e.detail;
      console.log(`${buttonName} was pressed!`);
      
      // -----------------------------------------
      if (buttonName == config.gamepadPanel1BottomTrimPlus) {
        trim.plusControl1BottomVal();
      }
      if (buttonName == config.gamepadPanel1BottomTrimMinus) {
        trim.minusControl1BottomVal();
      }
      if (buttonName == config.gamepadPanel1TopTrimMinus) {
        trim.minusControl1TopVal();
      }
      if (buttonName == config.gamepadPanel1TopTrimPlus) {
        trim.plusControl1TopVal();
      }
      // -----------------------------------------
      if (buttonName == config.gamepadPanel3BottomTrimPlus) {
        trim.plusControl3BottomVal();
      }
      if (buttonName == config.gamepadPanel3BottomTrimMinus) {
        trim.minusControl3BottomVal();
      }
      if (buttonName == config.gamepadPanel3TopTrimMinus) {
        trim.minusControl3TopVal();
      }
      if (buttonName == config.gamepadPanel3TopTrimPlus) {
        trim.plusControl3TopVal();
      }
      
    }
  }
});

gamepad.axisToCSS = function(x,y, style) {
  if (style === 'Circle') {
    x = ((x * 100)/2)+50;
    y = ((y * 100)/2)+50;
    return [x, y];
  }
  if (style === 'Square') {  
    // Transform to scuare
    let u = tools.cicleCoordsToScuareCoords(x, y)[0];
    let v = tools.cicleCoordsToScuareCoords(x, y)[1];
    
    // Transform to CSS
    u = ((u * 100)/2)+50;
    v = ((v * 100)/2)+50;
    return [u, v];
  }
  if (style === 'PowerStick') {
    // Transform to scuare
    let u = tools.cicleCoordsToScuareCoords(x, y)[0];
    let v = tools.cicleCoordsToScuareCoords(x, y)[1];
    
    // Transform to CSS
    u = ((u * 100)/2)+50;
    v = ((v * 100))+100;
    if ( v > 100){
      v = 100;
    }
    return [u, v];
  }
}; 

gamepad.joypadLoop = function() {
  if (gamepad.isEnabled) {
    let axisValues = false;
    let i;
    for (i = 0; i < 10; i++) {
      if (typeof joypad.instances[i] !== "undefined") { 
        axisValues = joypad.instances[i].axes; 
        break;
      };
    }
    if (axisValues !== false){
      /* -- Stick 1 -- */
      if (config.gamepadAxis12FeedbackStyle === 'Circle') {
        const tmpAxisToCSSValue = gamepad.axisToCSS(
          axisValues[0],
          axisValues[1],
          'Circle'
        );
        const element = document.getElementById("joystickFeedback1");
        element.style.left = tmpAxisToCSSValue[0] + "%";
        element.style.top = tmpAxisToCSSValue[1] + "%";
      }
      if (config.gamepadAxis12FeedbackStyle === 'Square') {
        const tmpAxisToCSSValue = gamepad.axisToCSS(
          axisValues[0],
          axisValues[1],
          'Square'
        );
        const element = document.getElementById("joystickFeedback1");
        element.style.left = tmpAxisToCSSValue[0] + "%";
        element.style.top = tmpAxisToCSSValue[1] + "%";
      }
      if (config.gamepadAxis12FeedbackStyle === 'PowerStick') {
        const tmpAxisToCSSValue = gamepad.axisToCSS(
          axisValues[0],
          axisValues[1],
          'PowerStick'
        );
        const element = document.getElementById("joystickFeedback1");
        element.style.left = tmpAxisToCSSValue[0] + "%";
        element.style.top = tmpAxisToCSSValue[1] + "%";
      }      
      /* -- Stick 2 -- */
      if (config.gamepadAxis34FeedbackStyle === 'Circle') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Circle')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Circle')[1] + "%";  
      }
      if (config.gamepadAxis34FeedbackStyle === 'Square') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Square')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'Square')[1] + "%";  
      }
      if (config.gamepadAxis34FeedbackStyle === 'PowerStick') {
        document.getElementById("joystickFeedback2").style.left = gamepad.axisToCSS(axisValues[2], axisValues[3], 'PowerStick')[0] + "%";
        document.getElementById("joystickFeedback2").style.top = gamepad.axisToCSS(axisValues[2], axisValues[3], 'PowerStick')[1] + "%";  
      }
    }
  };
}; 
setInterval(gamepad.joypadLoop, 33);

/* ------------------------------------------------------------------------------------------ */
// UI
/* ------------------------------------------------------------------------------------------ */
if (typeof ui == "undefined") {
  ui = function() {}
}

ui.btnActiveColor = 'blue'
ui.btnInactiveColor = "rgb(41, 41, 61)";
ui.btnDisableColor = "rgb(16, 14, 35)";

ui.buttonAnimation = function(id) {
  document.getElementById(id).style.backgroundColor = ui.btnActiveColor;
  setInterval(function(){
    document.getElementById(id).style.backgroundColor = ui.btnInactiveColor;
  }, gamepad.buttonFadeTime);
}; 

/* UI Lock */
ui.areBtnsLocked = false;

ui.unlockBtns = function() {
  ui.areBtnsLocked = true;
}

ui.lockBtns = function() {
  ui.areBtnsLocked = false;
}

document.getElementById("btnLockMenu").addEventListener("click", function() {
  if (ui.areBtnsLocked  == false) {
    console.log("Buttons Loked");
    document.getElementById("btnLockMenu").style.backgroundColor = ui.btnActiveColor;
    ui.unlockBtns();
  } else {
    console.log("Buttons Unlocked");
    document.getElementById("btnLockMenu").style.backgroundColor = ui.btnInactiveColor;
    ui.lockBtns();
  }
});

/* UI Lock  */
ui.fullscreen = false;

ui.openFullscreen = function() {
  let elem = document.documentElement;
  ui.fullscreen = true
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

ui.closeFullscreen = function() {
  // let elem = document.documentElement;
  ui.fullscreen = false;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
} 

document.getElementById("btnFullScreen").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    if (ui.fullscreen == false) {
      console.log("Open Fullscreen")
      document.getElementById("btnFullScreen").style.backgroundColor = ui.btnActiveColor
      ui.openFullscreen();
    } else {
      console.log("Close Fullscreen")
      document.getElementById("btnFullScreen").style.backgroundColor = ui.btnInactiveColor
      ui.closeFullscreen();
    }
  }
});

document.getElementById("trimCol1TopLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl1TopVal();
  }
});
document.getElementById("trimCol1TopRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl1TopVal();
  }
});
document.getElementById("trimCol1BottomLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl1BottomVal();
  }
});
document.getElementById("trimCol1BottomRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl1BottomVal();
  }
});


document.getElementById("trimCol3TopLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl3TopVal();
  }
});
document.getElementById("trimCol3TopRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl3TopVal();
  }
});
document.getElementById("trimCol3BottomLeft").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.minusControl3BottomVal();
  }
});
document.getElementById("trimCol3BottomRight").addEventListener("click", function() {
  if (ui.areBtnsLocked == false) {
    trim.plusControl3BottomVal();
  }
});


/* ------------------------------------------------------------------------------------------ */
// TRIM
/* ------------------------------------------------------------------------------------------ */

if (typeof trim == "undefined") { trim = function() {} }

trim.control1TopVal = 0;
trim.control1BottomVal = 0;
trim.control3TopVal = 0;
trim.control3BottomVal = 0;
trim.step = 1;

trim.loadFromLocalStorage = function() {
  if (localStorage.getItem('control1TopVal') !== null) {
    trim.control1TopVal = Number(localStorage.getItem('control1TopVal'));
    document.getElementById("trimCol1TopLabel").innerHTML = trim.control1TopVal;
  }
  if (localStorage.getItem('control1BottomVal') !== null) {
    trim.control1BottomVal = Number(localStorage.getItem('control1BottomVal'));
    document.getElementById("trimCol1BottomLabel").innerHTML = trim.control1BottomVal;
  }
  if (localStorage.getItem('control1TopVal') !== null) {
    trim.control3TopVal = Number(localStorage.getItem('control3TopVal'));
    document.getElementById("trimCol3TopLabel").innerHTML = trim.control3TopVal;
  }
  if (localStorage.getItem('control3BottomVal') !== null) {
    trim.control3BottomVal = Number(localStorage.getItem('control3BottomVal'));
    document.getElementById("trimCol3BottomLabel").innerHTML = trim.control3BottomVal;
  }
} 

trim.plusControl1TopVal = function(val) {
  console.log("Panel 1 - Trim Top +");
  ui.buttonAnimation("trimCol1TopRight");

  trim.control1TopVal = trim.control1TopVal + trim.step;
  localStorage.setItem('control1TopVal', trim.control1TopVal);
  document.getElementById("trimCol1TopLabel").innerHTML = trim.control1TopVal;
}
trim.minusControl1TopVal = function(val) {
  console.log("Panel 1 - Trim Top -");
  ui.buttonAnimation("trimCol1TopLeft");
  
  trim.control1TopVal = trim.control1TopVal - trim.step;
  localStorage.setItem('control1TopVal', trim.control1TopVal);
  document.getElementById("trimCol1TopLabel").innerHTML = trim.control1TopVal;
}

trim.plusControl1BottomVal = function(val) {
  console.log("Panel 1 - Trim Bottom +");
  ui.buttonAnimation("trimCol1BottomRight");

  trim.control1BottomVal = trim.control1BottomVal + trim.step;
  localStorage.setItem('control1BottomVal', trim.control1BottomVal);
  document.getElementById("trimCol1BottomLabel").innerHTML = trim.control1BottomVal;
}
trim.minusControl1BottomVal = function(val) {
  console.log("Panel 1 - Trim Bottom -");
  ui.buttonAnimation("trimCol1BottomLeft"); 

  trim.control1BottomVal = trim.control1BottomVal - trim.step;
  localStorage.setItem('control1BottomVal', trim.control1BottomVal);
  document.getElementById("trimCol1BottomLabel").innerHTML = trim.control1BottomVal;
}

trim.plusControl3TopVal = function(val) {
  console.log("Panel 3 - Trim Top +");
  ui.buttonAnimation("trimCol3TopRight");

  trim.control3TopVal = trim.control3TopVal + trim.step;
  localStorage.setItem('control3TopVal', trim.control3TopVal);
  document.getElementById("trimCol3TopLabel").innerHTML = trim.control3TopVal;
}
trim.minusControl3TopVal = function(val) {
  console.log("Panel 3 - Trim Top -");
  ui.buttonAnimation("trimCol3TopLeft");

  trim.control3TopVal = trim.control3TopVal - trim.step;
  localStorage.setItem('control3TopVal', trim.control3TopVal);
  document.getElementById("trimCol3TopLabel").innerHTML = trim.control3TopVal;
}

trim.plusControl3BottomVal = function(val) {
  console.log("Panel 3 - Trim Bottom +");
  ui.buttonAnimation("trimCol3BottomRight");

  trim.control3BottomVal = trim.control3BottomVal + trim.step;
  localStorage.setItem('control3BottomVal', trim.control3BottomVal);
  document.getElementById("trimCol3BottomLabel").innerHTML = trim.control3BottomVal;
}
trim.minusControl3BottomVal = function(val) {
  console.log("Panel 3 - Trim Bottom -");
  ui.buttonAnimation("trimCol3BottomLeft");

  trim.control3BottomVal = trim.control3BottomVal - trim.step;
  localStorage.setItem('control3BottomVal', trim.control3BottomVal);
  document.getElementById("trimCol3BottomLabel").innerHTML = trim.control3BottomVal;
}

/* ------------------------------------------------------------------------------------------ */
// WebSocket
/* ------------------------------------------------------------------------------------------ */

var websocket = new WebSocket(config.websocketUrl, ['arduino']);

websocket.latencyTestLoopEvery = 500; //Miliseconds
websocket.latencyTestLoopEnabled = false;


websocket.onopen = function () {
    console.log("WebSocket Connected");
    websocket.latencyTestLoopEnabled = true;
};
websocket.onerror = function (error) {
    console.log('WebSocket Error ', error);
};
websocket.onmessage = function (e) {
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      console.log(e.data)
      console.error(error);
    }

    if (data.hasOwnProperty("wifiSignalPercentual")){
      if ( config.telemetryWifiSignalStyle == 'Percentual') {
        document.getElementById("panelSignal").innerHTML = data['wifiSignalPercentual'] + '%';
      } else {
        document.getElementById("panelSignal").innerHTML = data['wifiSignalDbm'];
      }
    }
    if (data.hasOwnProperty("voltage")){
      document.getElementById("panelVoltage").innerHTML = data['voltage'];
    }

    if (data.hasOwnProperty("serial")){
      let currentTime = Date.now().toString();
      let responceTime = data['serial'];
      let latency = Math.round((currentTime - responceTime));
      document.getElementById("panelLatency").innerHTML = latency;
    }
};
websocket.onclose = function () {
    console.log('WebSocket connection closed');
    websocket.latencyTestLoopEnabled = false;
};

websocket.latencyTestLoop  = function () {
  if (websocket.latencyTestLoopEnabled) {
    let currentTime = Date.now().toString();
    websocket.send(JSON.stringify({"serial": currentTime}))
  }
}
setInterval(websocket.latencyTestLoop, websocket.latencyTestLoopEvery)


/* ------------------------------------------------------------------------------------------ */
// Control
/* ------------------------------------------------------------------------------------------ */

if (typeof control == "undefined") {
  control = function() {}
}

control.loopEvery = 100;

control.loop = function () {
  let msgToController = {};
  let panel1Vertical = 0;
  let panel1Horizontal = 0;
  let panel3Vertical = 0;
  let panel3Horizontal = 0;

  // GET AXIS COORDS
  if (gamepad.isEnabled) {
    // GAMEPAD
    let axisValues = false
    let i;
    for (i = 0; i < 10; i++) {
      if (typeof joypad.instances[i] !== "undefined") { 
        axisValues = joypad.instances[i].axes;
        const axis01ScuareCoords = tools.cicleCoordsToScuareCoords(
          axisValues[0],
          axisValues[1]
        );
        panel1Vertical = axis01ScuareCoords[1];
        panel1Horizontal = axis01ScuareCoords[0];

        const axis23ScuareCoords = tools.cicleCoordsToScuareCoords(
          axisValues[2],
          axisValues[3]
        );
        panel3Vertical = axis23ScuareCoords[1];
        panel3Horizontal = axis23ScuareCoords[0];
        break;
      };
    }
  } else {
    // TOUCH!

    if (touch.control1.get(touch.control1.nippleid).frontPosition !== undefined) {
      let tmpControl1Get = touch.control1.get(touch.control1.nippleid);
      let tmpSize = touch.control1.options.size;
      let y = (tmpControl1Get.frontPosition['y'] * 100) / tmpSize;
      let x = (tmpControl1Get.frontPosition['x'] * 100) / tmpSize;

      panel1Vertical = tools.cicleCoordsToScuareCoords((x/50), (y/50))[1];
      panel1Horizontal = tools.cicleCoordsToScuareCoords((x/50), (y/50))[0];
    }
    if (touch.control2.get(touch.control2.nippleid).frontPosition !== undefined) {
      let tmpControl2Get = touch.control2.get(touch.control2.nippleid);
      let tmpSize = touch.control2.options.size;
      let y = (tmpControl2Get.frontPosition['y'] * 100)/tmpSize;
      let x = (tmpControl2Get.frontPosition['x'] * 100)/tmpSize;

      panel3Vertical = tools.cicleCoordsToScuareCoords((x/50), (y/50))[1];
      panel3Horizontal = tools.cicleCoordsToScuareCoords((x/50), (y/50))[0];
    }
  }
  // You will get a value from 1 to -1.
  //console.log(panel1Horizontal, panel1Vertical, panel3Horizontal, panel3Vertical)
 
  //config.panel1type = 'DifferentialThrust';   // PitchYaw - Thrust - ThrustRoll - DifferentialThrust 
  if (config.panel1type == 'PitchYaw'){
    // Control (1 to -1) to servo (100% - 0%)
    let pitchServoValue = Math.round(((panel1Vertical + 1)/2)*100);
    let yawServoValue = Math.round(((panel1Horizontal + 1)/2)*100);
    // Trim ajustment
    pitchServoValue = pitchServoValue + trim.control1BottomVal;
    yawServoValue = yawServoValue + trim.control1TopVal;
    // Set msg to Controller
    msgToController['servo' + config.pitchServoNumber] = pitchServoValue;
    msgToController['servo' + config.yawServoNumber] = yawServoValue;
  }
  if (config.panel1type == 'Thrust'){
    msgToController = {
      ...msgToController,
      ...control.thrustControlToMsgToController(panel1Vertical),
    };
  }
  if (config.panel1type == 'ThrustRoll'){
    msgToController = {
      ...msgToController,
      ...control.thrustControlToMsgToController(panel1Vertical),
    };
    //Roll
    // Control (1 to -1) to servo (100% - 0%)
    let rollServoValue = Math.round(((panel1Horizontal + 1)/2)*100);
    // Trim ajustment
    rollServoValue = rollServoValue + trim.control1TopVal;
    // Set msg to Controller
    msgToController['servo' + config.rollServoNumber] = rollServoValue;
  }
  if (config.panel1type == 'DifferentialThrust'){
    msgToController = {
      ...msgToController,
      ...control.differentialThrustControlToMsgToController(
        panel1Vertical,
        panel1Horizontal
      ),
    };
  }
  // -----------------------------------------------------------------------------------------
  if (config.panel3type == 'PitchYaw'){
    // Control (1 to -1) to servo (100% - 0%)
    let pitchServoValue = Math.round(((panel3Vertical + 1)/2)*100);
    let yawServoValue = Math.round(((panel3Horizontal + 1)/2)*100);
    // Trim ajustment
    pitchServoValue = pitchServoValue + trim.control3BottomVal;
    yawServoValue = yawServoValue + trim.control3TopVal;
    // Set msg to Controller
    msgToController['servo' + config.pitchServoNumber] = pitchServoValue;
    msgToController['servo' + config.yawServoNumber] = yawServoValue;
  }
  if (config.panel3type == 'Thrust'){
    msgToController = {
      ...msgToController,
      ...control.thrustControlToMsgToController(panel3Vertical),
    };
  }
  if (config.panel3type == 'ThrustRoll'){
    msgToController = {
      ...msgToController,
      ...control.thrustControlToMsgToController(panel3Vertical),
    };
    //Roll
    // Control (1 to -1) to servo (100% - 0%)
    let rollServoValue = Math.round(((panel3Horizontal + 1)/2)*100);
    // Trim ajustment
    rollServoValue = rollServoValue + trim.control3TopVal;
    // Set msg to Controller
    msgToController['servo' + config.rollServoNumber] = rollServoValue;
  }
  if (config.panel3type == 'DifferentialThrust'){
    msgToController = {
      ...msgToController,
      ...control.differentialThrustControlToMsgToController(
        panel3Vertical,
        panel3Horizontal
      ),
    };
  }

  // move to server config ?
  msgToController['motor1orientation'] = config.motor1orientation;
  msgToController['motor2orientation'] = config.motor2orientation;
  
  msgToController['servo1maxValue'] = config.servo1maxValue;
  msgToController['servo2maxValue'] = config.servo2maxValue;
  msgToController['servo3maxValue'] = config.servo3maxValue;
  msgToController['servo4maxValue'] = config.servo4maxValue;

  //onsole.log(msgToController)
  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(msgToController))
  }
}

control.differentialThrustControlToMsgToController = function (panelVerticalValue, panelHorizontalValue) {
  let msgToController = {};
  let thrust = Math.round(((panelVerticalValue + 1))*100);
  if (thrust > 100){
    thrust = 100
  }
  thrust = Math.abs(thrust - 100);

  // Control (1 to -1) to servo (100% - 0%)
  let horizontal = Math.round(panelHorizontalValue*100);

  if (thrust > 0 ) {
    if ( horizontal >= 0 ) {
      horizontal = Math.abs(Math.abs(horizontal) - 100);
      msgToController['motor' + config.motorRigth] = thrust;
      msgToController['motor' + config.motorLeft] = Math.round(
        horizontal * thrust / 100
      );
    } else {
      horizontal = Math.abs(Math.abs(horizontal) - 100);
      msgToController['motor' + config.motorRigth] = Math.round(
        horizontal * thrust / 100)
      ;
      msgToController['motor' + config.motorLeft] = thrust;
    }
  } else {
    msgToController['motor1'] = 0;
    msgToController['motor2'] = 0;
  }
  return msgToController;
}

control.thrustControlToMsgToController = function (panelVerticalValue) {
  let msgToController = {};
  if (config.motorQuantity == 1){
    // Thrust - 1 Motor
    let thrustServoValue = Math.round(((panelVerticalValue + 1))*100);
    if (thrustServoValue > 100){ thrustServoValue = 100 };
    thrustServoValue = Math.abs(thrustServoValue - 100);
    msgToController['motor1'] = thrustServoValue;
  } else {
    // Thrust - 2 Motor
    let thrustServoValue = Math.round(((panelVerticalValue + 1))*100);
    if (thrustServoValue > 100){ thrustServoValue = 100 };
    thrustServoValue = Math.abs(thrustServoValue - 100);

    let motor1ServoValue = thrustServoValue + trim.control1TopVal;
    let motor2ServoValue = thrustServoValue + trim.control1BottomVal;

    if (motor1ServoValue > 100){ motor1ServoValue = 100 };
    if (motor2ServoValue > 100){ motor2ServoValue = 100 };
    msgToController['motor1'] = thrustServoValue;
    msgToController['motor2'] = thrustServoValue;
  }
  return msgToController;
}

setInterval(control.loop, control.loopEvery);


config.panel1type = 'DifferentialThrust';   // PitchYaw - Thrust - ThrustRoll - DifferentialThrust 
