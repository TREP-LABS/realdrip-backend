import deviceModel from '../../db/deviceModel';
import { check, validationResult } from 'express-validator';

const validation = () => {
    return [ 
        check('deviceId').not().isEmpty().withMessage('deviceId can\'t be empty'), 
        check('wardId').not().isEmpty().withMessage('wardId can\'t be empty') 
    ]
}
const RegisterDevice  = async (req, res)=>{
    let errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: false,
        message: "DeviceId and WardId are required",
        errors: errors.array() 
      });
    }
    // Get the device ID from the request body 
    let deviceId = req.body.deviceId;
    let wardId   = req.body.wardId;
    let hospitalId = 002; // To be otten from the logged in user.

          // Checking if device has previously been registered.
          deviceModel.read(client, "RegisteredDevices", {deviceId:deviceId}, (Response, client)=> {
            if (Response.length >= 1 ) {
              //if device  has been previously registered, update device with new parameters
              deviceModel.update(client, "RegisterDevice", {deviceId: deviceId}, data, (Response, client)=> {
                console.log(response);
                return res.status(201).json({
                  device_id : deviceId,
                  status: "failed",
                  message: "Device already Registered"
                });
              })
            }else if ( Response.length == 0 ) {
              // If device has not been previously registered.
              // Add device as been verified then return appropiate resonse
              deviceModel.connect.then(
                  (db, client)=>{
                    deviceModel.create(db, [
                      {
                        deviceId : deviceId,
                        wardId: wardId,
                        hospitalId: hospitalId
                      }
                    ], (result, connection)=>{
                      connection.close();
                      return res.status(201).json({
                        success : true,
                        message: "Device registered successfully",
                        data: [
                            {
                                deviceId: deviceId,
                                wardId: wardId,
                                
                            }
                        ]
                      });
                   })
                }).catch((err)=>{
                  console.log(err);    
                });
            } 
          })
}
module.exports = {verifyDevice, validation};