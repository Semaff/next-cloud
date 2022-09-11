import nodemailer, { Transporter } from "nodemailer";

class MailService {
    transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationLetter(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Account activation on ${process.env.SERVER_URL}`,
            text: '',
            html:
                `
                <div>
                    <h1>To activate account you need to go over this link</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

export default MailService;