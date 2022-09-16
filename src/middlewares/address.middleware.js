import joi from 'joi';

const purchaseDetailsSchema = joi.object({
    state: joi.string().required(),
    street: joi.string().required(),
    number: joi.number().integer().required(),
    paymentMethod: joi.string().required(),
    complement: joi.string().allow(null, ''),
});

const checkoutSchema = joi.object({
    products: joi.array().items(joi.object().keys({
        productId: joi.string().hex().length(24).required(),
        amount: joi.number().integer().min(1),
    }).min(1).required()),
});

function validatePurchaseDetails(req, res, next) {
    const validation = purchaseDetailsSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    next();
}

function validateCheckout(req, res, next) {
    const validation = checkoutSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        console.log(1)
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    next();
}

export { validatePurchaseDetails, validateCheckout };