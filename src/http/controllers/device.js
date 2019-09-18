import deviceService from '../../services/deviceServices/verify';
import { check, validationResult } from 'express-validator';

const validation = (method) => {
	switch (method) {
		case 'verifyDevice': {
			return [ check('deviceId').not().isEmpty().withMessage('deviceId can\'t be empty') ]
		}
	}
}
const verifyDevice  = async (req, res)=>{
		let errors = validationResult(req); 
		if (!errors.isEmpty()) {
			res.status(422).json({
				status: false,
				message: "DeviceId can't be empty",
				errors: errors.array() 
			});
		}
		let {deviceId} = req.body;
		let verification = await deviceService.verify(deviceId);
		switch (verification.status) {
			case 204:
					return res.status(422).json({
						status: false,
						message: "DeviceId already verified"
					});
				break;
			case 201:
					return res.status(201).json({
						status: false,
						message: "Device verified successfully"
					});
				break;
			case 404:
					return res.status(422).json({
						status: false,
						message: "Invalid device Id"
					});
				break;	
			default:
					return res.status(500).json({
						status: false,
						message: "Internal server error"
					});
				break;
		}
}
module.exports = {verifyDevice, validation};