import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import emailAddressValidation from './templates/emailAddressValidation';
import newWardUser from './templates/newWardUser';
import config from '../config';

const mailgunOptions = {
  auth: {
    api_key: config.mailgun.apiKey,
    domain: config.mailgun.domain,
  },
};

const emailClient = nodemailer.createTransport(mailgunTransport(mailgunOptions));

const sendEmailAddresValidation = (user, confirmationUrl) => emailClient.sendMail({
  from: config.email.noReply,
  to: config.environment === 'test' ? config.email.testEmail : user.email,
  subject: 'Please verify your email address',
  html: emailAddressValidation({ name: user.name, confirmationUrl }),
});

const sendNewWardUserNotification = (user, loginUrl) => {
  const { name, email, password } = user;
  return emailClient.sendMail({
    from: config.email.noReply,
    to: config.environment === 'test' ? config.email.testEmail : user.email,
    subject: 'Please verify your email address',
    html: newWardUser({
      name, email, password, loginUrl,
    }),
  });
};

export default {
  emailClient,
  sendNewWardUserNotification,
  sendEmailAddresValidation,
};
