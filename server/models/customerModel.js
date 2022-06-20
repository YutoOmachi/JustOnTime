import mongoose from 'mongoose'
import { addressSchema } from './schemas/address.schema.js';
import validator from 'validator'
const { isEmail, isMobilePhone } = validator

const customerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },    
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: addressSchema,
        required: false
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [isEmail, "please fill a valid email"]
    }, 
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validator: [isMobilePhone, "please fill a valid phone number"]
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},  {
    timestamps: true,
});

const Customer = mongoose.model("Customer", customerSchema);

export { Customer }