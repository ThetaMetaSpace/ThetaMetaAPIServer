const express = require("express");
const recordRoutes = express.Router();
const ct = require("../contract.js");

recordRoutes.get("/", async (req, res) => {
  res.send(">_ API V.01.00 is running");
});
recordRoutes.get("/update", async (req, res) => {
  ct.updateContract(address => {
  res.send("ContThetaMetaLand contractate to "+address);
    
  })
});
module.exports = recordRoutes;
