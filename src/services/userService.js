import { where } from 'sequelize'
import db from '../models/index'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                })

                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password.";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found.";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist.";
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })

            user ? resolve(true) : resolve(false);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used.'
                });
            } else {
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
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })

            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "The user isn't exist"
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                errMessage: "The user is deleted."
            })
        } catch (e) {
            reject(e);
        }
    })
}

let editData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('date edit', data)
            if (!data) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter.'
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Updating the user successfully.'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "User's not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters."
                })
            } else {
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editData: editData,
    getAllCodeService: getAllCodeService
}