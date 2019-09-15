import deviceModel from '../db/deviceModel';

test('verifying device exits in Firebase', async () => {
    let verification = await deviceModel.verifyDevice('rd-2002');
    expect(verification).toBe("passed");
  });
  