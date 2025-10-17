const { prisma } = require('../prismaClient');
const JSONbig = require('json-bigint');

const insertUser = async (userData) => {
    try {
        const newUser = await prisma.tbl_user.create({
            data: userData
        });
        let userInsertedData = await newUser ? JSON.parse(JSONbig.stringify(newUser)) : newUser;
        return userInsertedData;
    } catch (error) {
        throw new Error(error?.message);
    }
};

const updateUser = async (userId, updateData) => {
    try {
        const updateUserData = await prisma.tbl_user.update({
            where: {
                id: userId,
            },
            data: updateData,
        });
        let userUpdatedData = await updateUserData ? JSON.parse(JSONbig.stringify(updateUserData)) : updateUserData;
        return userUpdatedData;
    } catch (error) {
        throw new Error(error?.message);
    }
};

const userData = async (whereData = {}) => {
    try {
        const userData = await prisma.tbl_user.findFirst({
            where: {
                ...whereData
            },
            orderBy: { id: "desc" }
        });
        let user = await userData ? JSON.parse(JSONbig.stringify(userData)) : userData;
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const checkUserExists = async (whereData = {}) => {
    try {
        const checkUserExistsData = await prisma.tbl_user.findFirst({
            where: {
                ...whereData
            },
            select: {
                id: true,
                email: true,
                password: true,
                verify_token: true,
                verify_token_expiry: true,
                forgot_token: true,
                forgot_token_expiry: true,
                verified_at: true,
                forgoted_at: true,
                is_verify: true,
                is_active: true,
                is_delete: true,
                inserted_at: true,
                updated_at: true,
            }
        });
        let user = await checkUserExistsData ? JSON.parse(JSONbig.stringify(checkUserExistsData)) : checkUserExistsData;
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const userListData = async (whereData = {}) => {
    try {
        const userList = await prisma.tbl_user.findMany({
            where: {
                ...whereData
            },
            orderBy: { id: "desc" }
        });
        let users = await userList ? JSON.parse(JSONbig.stringify(userList)) : userList;
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

const verifyTokenCheck = async (token) => {
    try {
        const tokenUser = await prisma.tbl_user.findFirst({
            where: {
                token: token,
            },
            select: {
                id: true,
                token: true,
                email: true,
                is_active: true,
                is_delete: true,
                is_verify: true,
            },
        });
        let userDeviceData = await tokenUser ? JSON.parse(JSONbig.stringify(tokenUser)) : tokenUser;
        return userDeviceData;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { insertUser, updateUser, userData, checkUserExists, userListData, verifyTokenCheck };