import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import sendEmail from '../config/sendEmail.js'; 
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'; 
import generatedAccessToken from '../utils/generatedAccessToken.js'; 
import generatedRefreshToken from '../utils/generatedRefreshToken.js'; 

// ✅ FIX 1: Added curly braces { } around the import name
// ✅ FIX 2: Corrected spelling to match the utility (Cloudinary)
import { uploadImageCloudinary } from '../utils/uploadImageCloudinary.js'; 

import generatedOtp from '../utils/generatedOtp.js'; 
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'; 

// 🛡️ Backend Data Sanitization Helper
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, "").trim();
};

/**
 * 1. REGISTER USER
 */
export async function registerUserController(request, response) {
    try {
        const { password, confirmPassword } = request.body;
        const name = sanitizeString(request.body.name);
        const email = sanitizeString(request.body.email);
        const mobile = sanitizeString(request.body.mobile);

        // ✅ FIX: Corrected missing fields validation logic
        const requiredFields = ['name', 'email', 'mobile', 'password', 'confirmPassword'];
        const missingFields = requiredFields.filter(field => !request.body[field]);

        if (missingFields.length > 0) {
            return response.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                error: true,
                success: false,
                errorFields: missingFields
            });
        }
        
        if (password !== confirmPassword) {
            return response.status(400).json({ message: "Passwords do not match", error: true, success: false });
        }

        const userExist = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (userExist) {
            return response.status(400).json({ message: "Email already registered", error: true, success: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const verifyCode = generatedOtp(); 
        
        const payload = {
            name, 
            email: email.toLowerCase().trim(),
            mobile,
            password: hashedPassword,
            role: "USER", // 🛡️ सुरक्षा: हमेशा USER रोल ही दें, रिक्वेस्ट बॉडी से रोल न लें
            forgot_password_otp: verifyCode,
            forgot_password_expiry: new Date(Date.now() + 60 * 60 * 1000) 
        };

        const newUser = new UserModel(payload);
        await newUser.save();

        await sendEmail({
            sendTo: email.toLowerCase().trim(),
            subject: "Verify Your Aaramdehi Account",
            html: verifyEmailTemplate({ name, url: verifyCode })
        });

        return response.status(201).json({
            message: "Registration successful. OTP sent to your email.",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 2. VERIFY EMAIL
 */
export async function verifyEmailController(request, response) {
    try {
        // ✅ Accept both 'code' or 'otp' to handle different frontend versions
        const { email, code, otp } = request.body; 
        const verifyCode = code || otp;

        if (!email || !verifyCode) {
            return response.status(400).json({ message: "Email and OTP are required", error: true, success: false });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return response.status(404).json({ message: "User not found", error: true, success: false });
        }

        if (String(user.forgot_password_otp) !== String(verifyCode).trim()) {
            return response.status(400).json({ message: "Invalid OTP", error: true, success: false });
        }

        if (new Date(user.forgot_password_expiry) < new Date()) {
            return response.status(400).json({ message: "OTP has expired. Please register again.", error: true, success: false });
        }

        user.verify_email = true;
        user.forgot_password_otp = ""; 
        user.forgot_password_expiry = null;
        await user.save();

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        user.refresh_token = refreshToken;
        await user.save();

        // 🛡️ Security: Set Secure HTTP-Only Cookie for Verification success
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.status(200).json({ 
            message: "Verification successful!", 
            success: true,
            accessToken: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verify_email: user.verify_email
            }
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 3. FORGOT PASSWORD
 */
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return response.status(404).json({ message: "Email not found", error: true, success: false });
        }

        const otp = generatedOtp();
        user.forgot_password_otp = otp;
        user.forgot_password_expiry = new Date(Date.now() + 60 * 60 * 1000); 
        await user.save();

        await sendEmail({
            sendTo: email.toLowerCase().trim(),
            subject: "Reset Password - Aaramdehi",
            html: forgotPasswordTemplate({ name: user.name, otp: otp })
        });

        return response.status(200).json({
            message: "Reset OTP sent to your email.",
            success: true
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 4. RESET PASSWORD
 */
export async function resetPasswordController(request, response) {
    try {
        const { email, otp, newPassword, confirmPassword } = request.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return response.status(400).json({ message: "All fields are required", error: true, success: false });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({ message: "Passwords do not match", error: true, success: false });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return response.status(404).json({ message: "User not found", error: true, success: false });
        }

        if (String(user.forgot_password_otp) !== String(otp).trim()) {
            return response.status(400).json({ message: "Invalid OTP", error: true, success: false });
        }

        if (new Date(user.forgot_password_expiry) < new Date()) {
            return response.status(400).json({ message: "OTP has expired. Request a new one.", error: true, success: false });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        
        user.password = hashedPassword;
        user.forgot_password_otp = ""; 
        user.forgot_password_expiry = null;
        await user.save();

        return response.status(200).json({ message: "Password reset successful!", error: false, success: true });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 5. LOGIN USER
 */
export async function loginController(request, response) {
    try {
        // ✅ Fix: Use sanitized email to match registration logic
        const email = sanitizeString(request.body.email);
        const password = request.body.password;

        if (!email || !password) {
            console.log("❌ Login Attempt: Email or password missing in request body");
            return response.status(400).json({ message: "Email and password are required", error: true, success: false });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log(`❌ Login Attempt: User [${email}] not found in Database`);
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log(`❌ Login Attempt: Incorrect password for ${email}`);
            return response.status(400).json({ message: "Invalid credentials", error: true, success: false });
        }

        if (!user.verify_email) {
            return response.status(403).json({ 
                message: "Email verification pending. Check your inbox for OTP.", 
                error: true, 
                success: false,
                needsVerification: true,
                email: user.email // Sending email back for OTP page context
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        user.refresh_token = refreshToken;
        
        try {
            await user.save();
        } catch (saveError) {
            console.error("❌ Database Save Error (Check Role Enum):", saveError.message);
            return response.status(500).json({ message: "Profile validation failed. Ensure role is 'ADMIN' or 'USER'.", error: true });
        }

        // 🛡️ Security: Enforced Secure HTTP-Only Cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.status(200).json({ 
            message: "Login successful", 
            success: true,
            accessToken: accessToken,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                avatar: user.avatar,
                verify_email: user.verify_email
            } 
        });

    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 6. GET USER DETAILS (For AdminRoute verification)
 */
export async function getUserDetailsController(request, response) {
    try {
        // isAuthenticatedUser middleware req.user को पॉपुलेट करता है
        if (!request.user) {
            return response.status(401).json({ message: "User not authenticated", success: false });
        }
        return response.status(200).json({
            success: true,
            user: request.user // isAuthenticatedUser middleware से आया हुआ यूजर ऑब्जेक्ट
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}

/**
 * 6. UPLOAD AVATAR
 */
export async function uploadAvatarController(request, response) {
    try {
        const userId = request.userId; 
        
        if (!request.file) {
            return response.status(400).json({ message: "No image file provided", error: true, success: false });
        }

        // ✅ Fixed function call (matched spelling and passed buffer)
        const upload = await uploadImageCloudinary(request.file.buffer, "avatars"); // ✅ Added folder name

        if (!upload.success) {
            return response.status(500).json({ message: "Upload to Cloudinary failed", error: true, success: false });
        }

        const updateUser = await UserModel.findByIdAndUpdate(userId, { avatar: upload.url }, { new: true });

        return response.status(200).json({ 
            message: "Avatar updated", 
            success: true, 
            data: { avatar: updateUser.avatar } 
        });
    } catch (error) {
        return response.status(500).json({ message: error.message, error: true, success: false });
    }
}