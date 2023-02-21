const Joi = require("joi");

class Validate {
    validateRoomType(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required().trim().lowercase()
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