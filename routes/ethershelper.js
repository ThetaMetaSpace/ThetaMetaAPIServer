const express = require("express");
const recordRoutes = express.Router();
const ct = require("../contract.js");

recordRoutes.get("/ethers/name", async (req, res) => {
  res.send(await ct.getName());
});
recordRoutes.post("/ethers/recover", async (req, res) => {
  let signed = req.body.signed;
  let raw = req.body.raw;
  let userAddress = ct.getUserAddress(raw, signed);
  console.log(userAddress);
  res.send(userAddress);
});
//==
recordRoutes.post("/ethers/sign", async (req, res) => {
  let pk = req.body.pk;
  let raw = req.body.raw;
  let signed = await ct.sign(raw, pk);
  console.log(signed);
  res.send(signed.signature);
});

recordRoutes.post("/ethers/signtx", async (req, res) => {
  try {
    let pk = req.body.pk;
    let tx = req.body.tx;
    let signed = await ct.signTransaction(tx, pk);
    console.log(signed);
    res.send(await ct.sendTx(signed.rawTransaction));
  } catch (e) {
    res.send(e);
  }
});

module.exports = recordRoutes;
