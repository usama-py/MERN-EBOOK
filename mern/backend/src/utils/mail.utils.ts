import nodemailer from 'nodemailer';

interface VerificationMailOptions{
    link: string
    to: string,
}
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_TEST_USER,
        pass: process.env.MAILTRAP_TEST_PASS,
    }
});
const mail = {
    async sendVerificationMail(options: VerificationMailOptions){
        await transport.sendMail({
            to: options.to,
            from: process.env.VERIFICATION_MAIL,
            subject: 'Auth Verification',
            html:`
                <div>
                    <p>Please click on <a href="${options.link}">Link</a> to verify your account</p>
                <div/>
            `
        });
    }
}

export default mail
