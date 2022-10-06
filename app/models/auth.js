const mainModel 	= require(__path_schemas + 'users');
const crypto = require('crypto');
const sendEmail = require(__path_utils+'send-email');

module.exports = {
    create: async (item)=>{
        const user = await new mainModel(item).save();
        return user.getSignedJwtToken();
    },

    login: async (item,res)=>{
        const {email,password} = item;
        const result = await mainModel.findByCredentials(email, password);
        if(result.err){
            res.status(401).json({
                success: true,
                message: result.err,
            });
            return false;
        }
        return await result.user.getSignedJwtToken();
    },

    forgetPassword: async (item)=>{
        const user = await mainModel.findOne({email: item.email});
        if(!user) return false;
        const resetToken = user.resetPassword();
        await user.save();

        // Create reset token 
        const resetUrl = `/api/v1/auth/reset-password/${resetToken}`;
        const message = `Try cập vào link để đổi pass: ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Thay đổi password',
                message
            });
            return 'Vui lòng check email của bạn';
        } catch (error) {
            user.resetPassToken = undefined;
            user.resetPassTokenExp = undefined;
            user.save();
            return 'Không thể gửi email, vui vòng thử lại'
        }

    },

    resetPassword: async (item) => {
        const resetPassToken = crypto
		.createHash('sha256')
		.update(item.resetToken)
		.digest('hex');
        console.log(resetPassToken);
        const user = await mainModel.findOne({
            resetPassToken: resetPassToken,
            resetPassTokenExp: {$gt: Date.now()}
        });

        if(!user) return false;

        user.password = item.password;
        user.resetPassToken = undefined;
        user.resetPassTokenExp = undefined;
        await user.save();
        return user;
    }

}