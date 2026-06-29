require("dotenv").config();

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.handler = async (event) => {

    try {

        const { amount } = JSON.parse(event.body);

        const order = await razorpay.orders.create({

            amount: amount,
            currency: "INR",
            receipt: "PK_" + Date.now()

        });

        return {

            statusCode: 200,

            body: JSON.stringify(order)

        };

    } catch (err) {

        return {

            statusCode: 500,

            body: JSON.stringify({

                error: err.message

            })

        };

    }

};