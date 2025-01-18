import { env } from "~config/environment";

// https://github.com/getbrevo/brevo-node?tab=readme-ov-file#typescript-supported-with-version-v211
// eslint-disable-next-line @typescript-eslint/no-require-imports
const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications["apiKey"];

apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (toEmail: string, customSubject: string, htmlContent: string) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = { name: env.BREVO_EMAIL_NAME, email: env.BREVO_EMAIL_ADDRESS };
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.subject = customSubject;
    sendSmtpEmail.htmlContent = htmlContent;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = { sendEmail };
