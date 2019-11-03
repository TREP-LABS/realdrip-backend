import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import emailAddressValidation from './templates/emailAddressValidation';
import newWardUser from './templates/newWardUser';
import newNurseUser from './templates/newNurseUser';
import config from '../config';

const mailgunOptions = {
  auth: {
    api_key: config.mailgun.apiKey,
    domain: config.mailgun.domain,
  },
};

const emailClient = nodemailer.createTransport(mailgunTransport(mailgunOptions));

const { NODE_ENV, ENFORCE_TEST_EMAILS } = process.env;
const enforceTestEmails = ENFORCE_TEST_EMAILS ? ENFORCE_TEST_EMAILS.toLocaleLowerCase() === 'true' : false;
if (NODE_ENV === 'test' && !enforceTestEmails) {
  emailClient.sendMail = ({ subject }) => {
    console.log(`"${subject}" email not sent because runtime is in test environment`);
    return Promise.resolve('');
  };
}

const sendEmailAddresValidation = (user, confirmationUrl) => emailClient.sendMail({
  from: config.email.noReply,
  to: user.email,
  subject: 'Please verify your email address',
  html: emailAddressValidation({ name: user.name, confirmationUrl }),
});

const sendNewWardUserNotification = (user, loginUrl) => {
  const { name, email, password } = user;
  return emailClient.sendMail({
    from: config.email.noReply,
    to: user.email,
    subject: 'Ward login credentials',
    html: newWardUser({
      name, email, password, loginUrl,
    }),
  });
};

const sendNewNurseUserNotification = (user, loginUrl) => {
  const { name, email, password } = user;
  return emailClient.sendMail({
    from: config.email.noReply,
    to: user.email,
    subject: 'Nurse login credentials',
    html: newNurseUser({
      name, email, password, loginUrl,
    }),
  });
};

export default {
  emailClient,
  sendNewWardUserNotification,
  sendNewNurseUserNotification,
  sendEmailAddresValidation,
};
