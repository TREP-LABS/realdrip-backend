export default ({
  name, email, password, loginUrl,
}) => `
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
      width: 600px;
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
      margin-top: 20px;
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
        <p>Hi <span class="user-name">${name}</span>, you have been assigned a Ward to manage by your hospital admin on the Realdrip plaform. <br /> These are your login credentials:
          <br />
          <span><b>Email:</b> ${email}</span>
          <br />
          <span><b>Password:</b> ${password}</span>
        </p>
        <br/>
        <p>
            Click on the button below to confirm login:
        </p>
        <div class="confirmation-btn">
          <a href=${loginUrl}>Login</a>
        </div>
        <p>Just incase the button above does not work, you can visit the login page here</p>
        <a href=${loginUrl} class="url">${loginUrl}</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
