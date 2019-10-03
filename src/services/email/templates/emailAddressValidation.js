export default ({ name, confirmationUrl }) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css?family=Sawarabi+Gothic&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Sawarabi Gothic', sans-serif; }
    p { margin: 0; }
    .container {
      display: flex;
      justify-content: center;
    }
    .content {
      width: 500px;
      margin-left: auto;
      margin-right: auto;  
    }
    .logo { text-align: center; }
    .user-name { 
      text-transform: capitalize;
      font-weight: bold;
    }
    .info {
      padding: 0 50px;
      text-align: center;
    }
    .confirmation-btn {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .confirmation-btn a {
      padding: 6px 40px 6px 40px;
      background-color: #0cd891;
      color: #fff;
      letter-spacing: 1px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
    }
    .confirmation-btn:hover {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    .mistake-note {
      margin-top: 10px;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="logo">
        <img src="https://github.com/TREP-LABS/realdrip-fronend/blob/master/public/assets/img/logo/realdrip.png?raw=true" alt="logo" />
      </div>
      <div class="info">
        <p>Hi <span class="user-name">${name}</span>, thanks for signing up on the RealDrip platform. We need you to confirm your medical center email
          to proceed with the registration, thanks.
        </p>
        <br/>
        <p>
            Click on the button below to confirm your email address.
        </p>
        <div class="confirmation-btn">
          <a href=${confirmationUrl}>Confirm Email Address</a>
        </div>
        <p>Just incase the button above does not work, copy and past the url below to a browser tab:</p>
        <a href=${confirmationUrl} class="url">${confirmationUrl}</a>
        <p class="mistake-note">If you received this email by mistake, simply delete it. Thanks.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
