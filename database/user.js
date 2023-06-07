const prisma = require("./prisma");

const createUser = (user) =>{
    return prisma.user.create({
        data: user
    }); 
};

const findUserByEmail = (email)=>{
    return prisma.user.findFirst({
        where:{email}
    });
};

module.exports= {
    createUser,
    findUserByEmail
};
