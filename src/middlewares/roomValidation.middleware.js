const Joi = require("joi");

class Validate {
    validateRoom(req, res, isOptional = false, next) {
        const schema = Joi.object({
            name: isOptional ? Joi.string().lowercase().trim() : Joi.string().required().lowercase().trim(),
            roomType: isOptional ? Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim() : Joi.string().regex(/^[0-9a-fA-F]{24}$/).trim().required(),
            price: isOptional ? Joi.number() : Joi.number().required(),
            floor: isOptional ? Joi.number() : Joi.number().required(),
            capacity: isOptional ? Joi.number() : Joi.number().required(),
            amenities: Joi.array().items(Joi.string()),
            booked: Joi.boolean().default(false)
        });
        
        const {error, data} = schema.validate(req.body);

        if(error) {
            let errorMessage = [];    
            error.details.forEach(detail => {
                errorMessage.push(detail.message);
            });
            return res.status(403)
                .send({
                    message: error.details[0].message,
                    success: false
                });
        }
        next();
    }
}

module.exports = new Validate();