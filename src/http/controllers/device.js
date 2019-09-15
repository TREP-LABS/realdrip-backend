import deviceModel from '../../db/deviceModel';
import { check, validationResult } from 'express-validator';

const validation = (method) => {
    switch (method) {
      case 'verifyDevice': {
        return [ check('deviceId').not().isEmpty().withMessage('deviceId can\'t be empty') ]
      }
    }
  }
const verifyDevice  = async (req, res)=>{
    console.log(req.body.deviceId);  
    let errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: false,
        message: "DeviceId can't be empty",
        errors: errors.array() 
      });
    }
    // Get the device ID from the request body 
    let deviceId = req.body.deviceId;
    // Check if device exits on firebase. returns passed or failed 
    let verification = await deviceModel.verifyDevice(deviceId);
    // check the value returned by the verification  
    if (verification === "passed") {
      deviceModel.connect.then(
        (client)=>{
          // Checking if device has previously been verified.
          deviceModel.read(client, "devices", {deviceId:deviceId}, (Response, connection)=> {
            if (Response.length >= 1 ) {
              connection.close();
              return res.status(422).json({
                device_id : deviceId,
                status: "failed",
                message: "Device already verified"
              });
            }else if ( Response.length == 0 ) {
              // If device has not been previously 
              // Add device as been verified then return appropiate resonse
              deviceModel.connect.then(
                  (db, client)=>{
                    deviceModel.create(db, [{deviceId : deviceId}], (result, connection)=>{
                      connection.close();
                      return res.status(201).json({
                        device : result,
                        status: "Passed",
                        message: "Device verified successfully"
                      });
                   })
                }).catch((err)=>{
                  console.log(err);    
                });
            } 
          })
        })
    }
}
module.exports = {verifyDevice, validation};