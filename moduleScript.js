function init() {
  updateNetioIP();
  requestStatus();
  script.setUpdateRate(1);
}

function moduleParameterChanged(param) {
  script.log(param.name + " parameter changed");

  if (param.isParameter()) {
    if (param.name === "ipAddress") {
      updateNetioIP();
    }
  }
}

function moduleValueChanged(value) {}

// Here are the callback functions for the commands

function changeState(output, state) {
  if (state) {
    actionString = "1";
  } else {
    actionString = "0";
  }
  var payload =
    '{"Outputs":[{"ID":"' +
    "" + output +
    '","Action":' +
    actionString +
    "}]}";
  var params = {};
  params.dataType = "json";
  params.extraHeaders = "Content-Type: text/plain";
  params.payload = payload;

  local.sendPOST("", params);
}

function requestStatus() {
  local.sendGET("", "json");
}

// Callback function for data received

function dataEvent(data, requestURL) {;
  // script.log(typeof(obj['params']['switch:0']['apower']));
  if (typeof data.Agent !== "undefined") {
    local.values.model.set(data.Agent.Model);
    local.values.version.set(data.Agent.Version);
    local.values.macAddress.set(data.Agent.MAC);
    local.values.jsonVer.set(data.Agent.JSONVer);
    local.values.time.set(data.Agent.Time);
  }

  if(typeof data.GlobalMeasure !== "undefined"){
    local.values.voltage_V_.set(data.GlobalMeasure.Voltage);
    local.values.frequency_Hz_.set(data.GlobalMeasure.Frequency);
    local.values.totalCurrent_mA_.set(data.GlobalMeasure.TotalCurrent);
    local.values.totalPowerFactor.set(data.GlobalMeasure.TotalPowerFactor);
    local.values.totalLoad_W_.set(data.GlobalMeasure.TotalLoad);
  }

  if(typeof data.Outputs !== "undefined"){
    local.values.output1.nameOf.set(data.Outputs[0].Name);
    local.values.output1.state.set(data.Outputs[0].State);
    local.values.output1.current_mA_.set(data.Outputs[0].Current);
    local.values.output1.load_W_.set(data.Outputs[0].Load);
    local.values.output1.powerFactor.set(data.Outputs[0].PowerFactor);

    local.values.output2.nameOf.set(data.Outputs[1].Name);
    local.values.output2.state.set(data.Outputs[1].State);
    local.values.output2.current_mA_.set(data.Outputs[1].Current);
    local.values.output2.load_W_.set(data.Outputs[1].Load);
    local.values.output2.powerFactor.set(data.Outputs[1].PowerFactor);

  }
}

// utility functions

function updateNetioIP() {
  var path = "http://" + local.parameters.ipAddress.get() + "/netio.json";
  local.parameters.baseAddress.set(path);
  requestStatus();
}

function update(deltaTime)
{
  script.log("Delta time : " + deltaTime);
  requestStatus();
}
