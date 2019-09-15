import deviceModel from '../../db/deviceModel';
import { check, validationResult } from 'express-validator';

// Flow
// Validate request
// Verify device
// Return Response
let validation = (method) => {
    switch (method) {
      case 'verifyDevice': {
       return [
        check('deviceId').not().isEmpty().withMessage('deviceId can\'t be empty')
      ]
      }
    }
  }
let verifyDevice  = async (req, res)=>{
  console.log(req.body.deviceId);
  
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: false,
        message: "DeviceId can't be empty",
        errors: errors.array() 
      });
    }
    let deviceId = req.body.deviceId;   
    let verification = await deviceModel.verifyDevice(deviceId);
    if (verification === "passed") {
      deviceModel.connect.then(
        (client)=>{
          deviceModel.read(client, "devices", {deviceId:deviceId}, (Response, connection)=> {
            if (Response.length >= 1 ) {
              connection.close();
              return res.json({
                device_id : deviceId,
                status: "failed",
                message: "Device already verified"
              });
            }else if ( Response.length == 0 ) {
              deviceModel.connect.then(
                  (db, client)=>{
                    deviceModel.create(db, [{deviceId : deviceId}], (result, connection)=>{
                      connection.close();
                      return res.json({
                        device : result,
                        status: "Passed",
                        message: "Device verified successfully"
                      });
                   })
                }).catch((err)=>{
                  console.log("An error occured");    
                })
            } 
          })
        })
    }
}
module.exports = {verifyDevice, validation};