const prisma = require("./prisma");

const getReceitas = (userId) => {
    return prisma.receita.findMany(
        { where: { userId } }
    );
}

const findReceitaById = (id) => {
    return prisma.receita.findFirst({
        where: { id:id}
    });
}

const addReceita = (receita, userId) => {
    return prisma.receita.create({
        data: {
            name: receita.name,
            descricao: receita.descricao,
            tempo: receita.tempo,
            userId: userId
        }
    })
}

const updateReceita = (id, receita) => {
    return prisma.receita.update({
        where: {
            id: id
        }, data: receita
    })
}

const deleteReceita = (id) => {
    return prisma.receita.delete({
        where: {
            id
        }
    })
}

module.exports = {
    addReceita,
    updateReceita,
    findReceitaById,
    getReceitas,
    deleteReceita
}