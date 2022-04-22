const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db.js");
const ct = require("../contract.js");

recordRoutes.get("/alltokendata", (req, res) => {
  const db = dbo.getDb();
  if (db != undefined)
    db.collection("buildingdata")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  else res.send("DB not connected");
});
recordRoutes.get("/alltokendata/:id", (req, res) => {
  const db = dbo.getDb();
  if (db != undefined)
    db.collection("buildingdata")
      .find({ id: req.params.id })
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  else res.send("DB not connected");
});
recordRoutes.post("/uploadstx", async (req, res) => {
  const db = dbo.getDb();
  let signed = req.body.signed;
  let raw = req.body.raw;
  let lands = req.body.data;
  let userAddress = ct.getUserAddress(raw, signed);
  console.log(`${userAddress} start save ${lands.length} builds`);
  let result;
  try {
    for (let i = 0; i < lands.length; i++) {
      let land = lands[i];
      let ownerOfLand = await ct.ownerOf(land.landId);
      if (ownerOfLand == userAddress) {
        console.log("Run update for land " + land.landId);
        try {
          await db
            .collection("buildingdata")
            .updateOne(
              { id: land.landId },
              { $set: { id: land.landId, data: JSON.stringify(land.data) } },
              { upsert: true }
            );

          console.log("Land " + land.landId + " updated");
        } catch (err) {
          console.log("Land " + land.landId + " no updated");
        }
      }
    }
    result = "Success save " + lands.length + " lands";
  } catch (e) {
    result = "Error: " + JSON.stringify(e);
  }
  res.send(result);
});
module.exports = recordRoutes;
