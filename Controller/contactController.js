require('dotenv').config();
const nodemailer = require('nodemailer');
const Contact = require('../Models/Contact');

exports.submitContactForm = async (req, res) => {
  try {
    // Destructure and trim input to avoid leading/trailing spaces
    const { name, email, phone, address, message } = req.body;
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedAddress = address?.trim();
    const trimmedMessage = message?.trim();

    // Save contact info to MongoDB
    const newContact = new Contact({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      address: trimmedAddress,
      message: trimmedMessage,
    });

    await newContact.save();

    // Configure nodemailer transporter with Office365 SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // TLS is used with port 587
      auth: {
        user: process.env.EMAIL_USER, // e.g. it@ncg.sa
        pass: process.env.EMAIL_PASS, // app password or real password (use env variables!)
      },
    });

    // Define email options
    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: "it@ncg.sa",
      replyTo: trimmedEmail,
      subject: "New Contact Form Submission",
      text: `
You have a new message from the contact form:

Name: ${trimmedName}
Email: ${trimmedEmail}
Phone: ${trimmedPhone || "N/A"}
Address: ${trimmedAddress || "N/A"}
Message:
${trimmedMessage}
      `.trim(),
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: 'Contact form submitted and email sent successfully.' });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res.status(500).json({ message: 'Server error. Could not submit form or send email.' });
  }
};
