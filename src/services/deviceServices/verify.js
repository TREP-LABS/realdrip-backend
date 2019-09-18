import deviceModel from '../../db/deviceModel';
const verify = async (deviceId)=> {
    let device = await deviceModel.getDevice(deviceId);
    if (device.exists()) {
        let alreadyVerified = await deviceModel.read("VerifiedDevices", {deviceId:deviceId});
        if (alreadyVerified.length >= 1) {
            return {status: 204};
        }else {
            await deviceModel.create('VerifiedDevices',[{
                deviceId: deviceId,
                verified_by: 'admin',
                date_verified: Date.now()
            }]);
            return {status: 201}
        }
    }else{
        return {status: 404};
    }
}
module.exports = {verify};