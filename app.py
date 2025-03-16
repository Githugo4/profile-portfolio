from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

EMAIL_USER = "githuvarghese97@gmail.com"
EMAIL_PASSWORD = "qhasogqvrpgvilwy"

app = Flask(__name__)
CORS(app)


@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json

    required_fields = ['name', 'email', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400

    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject', 'New Contact Form Submission')
    message = data.get('message')

    if not EMAIL_PASSWORD:
        logger.error("Email password not set")
        return jsonify({"status": "error",
                        "message": "Email password not configured. Set the EMAIL_PASSWORD environment variable."}), 500

    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_USER
    msg['Subject'] = f"Portfolio Contact: {subject}"

    body = f"""
    You received a new message from your portfolio website:

    Name: {name}
    Email: {email}

    Message:
    {message}
    """

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo() 
        server.starttls()
        server.ehlo()

        server.login(EMAIL_USER, EMAIL_PASSWORD)

        text = msg.as_string()
        server.sendmail(EMAIL_USER, EMAIL_USER, text)
        server.quit()

        logger.info(f"Email sent successfully from {email}")
        return jsonify({"status": "success", "message": "Email sent successfully!"}), 200

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication Error - incorrect email or password")
        return jsonify(
            {"status": "error", "message": "Email authentication failed. Check your email credentials."}), 500

    except smtplib.SMTPException as e:
        logger.error(f"SMTP Error: {e}")
        return jsonify({"status": "error", "message": "Failed to send email due to SMTP server error."}), 500

    except Exception as e:
        logger.error(f"Unexpected error sending email: {e}")
        return jsonify({"status": "error", "message": f"Failed to send email: {str(e)}"}), 500


@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "API is working!"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)