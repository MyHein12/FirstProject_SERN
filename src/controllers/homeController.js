import { json } from 'body-parser';
import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        }); //trong cofig da set duong dan den Views
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs') //trong cofig da set duong dan den Views
}

let getCRUD = (req, res) => {
    return res.render('CRUD.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('POST CRUD from server');
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('User Not Found');    
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserDate(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let userid = req.query.id;
    if (userid) {
        let allUsers = await CRUDService.deleteUserById(userid);
        return res.render('displayCRUD.ejs', {
            dataTable: allUsers
        });
    }
    else {
        return res.send('User not found.')
    }
}
module.exports = {
    getHomePage : getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}