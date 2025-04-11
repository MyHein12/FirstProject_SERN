import bcrypt from "bcryptjs";
import db from "../models/index";
import { where } from "sequelize";

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise (async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phonenumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            });
            resolve('create new user successfully.');
        } catch (e) {
            reject(e);
        }
    })
}


let getAllUsers = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}


let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            resolve(user || {});
        } catch(e) {
            reject(e);
        }
    })
}


let hashUserPassword = (password) => {
    return new Promise (async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserDate = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
            else {
                resolve();
            }
        } catch(e) {
            reject(e);
        }
    })
}

let deleteUserById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userid}
            })

            if (user) {
                await user.destroy();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
            resolve();
        } catch(e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers, 
    getUserInfoById: getUserInfoById,
    updateUserDate: updateUserDate,
    deleteUserById: deleteUserById
}