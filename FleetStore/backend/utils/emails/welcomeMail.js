// Import the necessary modules here
import nodemailer from 'nodemailer';
export const sendWelcomeEmail = async (user, WelcomeUser) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.STORFLEET_SMPT_MAIL,
      pass: process.env.STORFLEET_SMPT_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.STORFLEET_SMPT_MAIL,
    to: user.email,
    subject: 'Welcome to Our FleetStore',
    html: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f2f2f2;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
            }
    
            .container:hover {
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            }
    
            .header {
                text-align: center;
            }
    
            .logo {
                max-width: 150px;
                height: auto;
            }
    
            h1 {
                color: #333333;
            }
    
            .content {
                margin-top: 20px;
                color: #555555;
            }
    
            p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 15px;
            }
    
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #ff5e6c;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }
    
            .button:hover {
                background-color: #d93a4d;
                transform: scale(1.05);
            }
    
            /* Mobile Responsive Styles */
            @media only screen and (max-width: 600px) {
                .container {
                    padding: 15px;
                }
    
                .logo {
                    max-width: 100px;
                }
    
                .button {
                    display: block;
                    margin-top: 15px;
                }
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
                <h1>Welcome to Storefleet</h1>
            </div>
            <div class="content">
                <p>Hello, ${user.name}</p>
                <p>Thank you so much for registering with us. We are very excited to have you on board!</p>
                <p><a class="button" href="${WelcomeUser}">Get Started</a></p>
            </div>
        </div>
    </body>
    
    </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
