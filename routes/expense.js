const moment = require('moment');
const {Expense, MonthlyExpenseLimit} = require('../models/expnese.model');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/add',[auth], async (req, res)=>{
    
    try{
        const loggedInUserId = res.user.user_id;
         const schema = Joi.object().keys({
            amount: Joi.number().required(),
            reason: Joi.string().required(),
            items: Joi.array().allow([]),
            past_expense: Joi.boolean().required(),
            past_expense_date: Joi.string().allow(""),
         });
     
         const { error } = Joi.validate(req.body, schema);
     
         if(error){
             res.status(403).send(error.details[0].message);
         }

         let insert_obj = {
            user_id: loggedInUserId,
            amount: req.body.amount,
            reason: req.body.reason,
            spent_time_utc: moment().unix(),
            items: req.body.items,
            past_expense: req.body.past_expense,
            past_expense_date: moment(req.body.past_expense_date).unix(),
            dom_utc: 0
         }

         if(req.body.past_expense){
            insert_obj["spent_time_utc"] = moment(req.body.past_expense_date).unix();
         }

         const expenseObj = new Expense(insert_obj);
         
         const result = await expenseObj.save();
         //console.log(result);
         if(result){
             res.status(200).send(result);
         }else{
             res.status(500).send({ message : "Some error occured." });
         }
    }catch(expp){
        //console.log(expp);
        res.status(500).send(expp);
    }
   
});

router.get('/details',[auth] , async (req, res)=>{

    try{
        const loggedInUserId = res.user.user_id;

        //today expense details BEGIN
        let today_total_expense = 0;

        const startOfToday_utc = moment().startOf('day').unix();
        const endOfToday_utc   = moment().endOf('day').unix();

        const todayExpenseDetails = await Expense.find({ user_id: loggedInUserId, spent_time_utc: { $gte: startOfToday_utc, $lte: endOfToday_utc }});

        if(todayExpenseDetails != undefined && todayExpenseDetails != null && Object.keys(todayExpenseDetails).length>0){

            let todayExpenseAmountArr = todayExpenseDetails.map(obj => obj.amount);
            today_total_expense = todayExpenseAmountArr.reduce((a, b) => a + b, 0);
        }
        //today expense details END

        //current month expense details BEGIN
        let total_month_expense = 0;

        const startOfMonth_utc = moment().startOf('month').unix();
        const endOfMonth_utc   = moment().endOf('month').unix();

        const monthExpenseDetails = await Expense.find({ user_id: loggedInUserId, spent_time_utc: { $gte: startOfMonth_utc, $lte: endOfMonth_utc }});

        if(monthExpenseDetails != undefined && monthExpenseDetails != null && Object.keys(monthExpenseDetails).length>0){

            let monthExpenseAmountArr = monthExpenseDetails.map(obj => obj.amount);
            total_month_expense = monthExpenseAmountArr.reduce((a, b) => a + b, 0);
        }
        //current month expense details END

        const monthlyLimit = await MonthlyExpenseLimit.findOne({ user_id: loggedInUserId, start_utc:{ $lte: moment().unix() }, end_utc: { $gte: moment().unix() } }).lean();

        let return_obj = {
            "today_total_expense": today_total_expense,
            "total_month_expense": total_month_expense,
            "month_expense_limit": ((monthlyLimit != undefined && monthlyLimit != null && Object.keys(monthlyLimit).length>0) ? monthlyLimit.limit_amount : 0)
        }

        res.status(200).send(return_obj);
    }catch(expp){
        //console.log(expp);
        res.status(500).send(expp);
    }
});

router.get('/list',[auth] , async (req, res)=>{

    try{
        let returnArr = [];

        const loggedInUserId = res.user.user_id;
        const startOfToday_utc = moment().startOf('day').unix();
        const endOfToday_utc   = moment().endOf('day').unix();

        const expenseDetailsListArr = await Expense.find({ user_id: loggedInUserId });

        if(expenseDetailsListArr != undefined && expenseDetailsListArr != null && expenseDetailsListArr.length>0){
            
            for(let i=0; i<expenseDetailsListArr.length; i++){
                try{
                    const expense_date = moment(expenseDetailsListArr[i].spent_time_utc, 'X').format('DD-MMM-Y');
                    const expense_date_time = moment(expenseDetailsListArr[i].spent_time_utc, 'X').format('DD MMM Y hh:mm A');

                    const findIndex = returnArr.findIndex(obj => obj.expense_date === expense_date);

                    let expenseObj = {};

                    let itemStr = "";
                    if(expenseDetailsListArr[i].items != undefined && expenseDetailsListArr[i].items != null && expenseDetailsListArr[i].items.length>0){

                        for(let j=0; j<expenseDetailsListArr[i].items.length; j++){

                            let customText = expenseDetailsListArr[i].items[j].item_name+"-"+expenseDetailsListArr[i].items[j].item_price+", ";

                            (itemStr == "") ? itemStr = customText : itemStr += customText;
                        }   
                    }

                    expenseObj = {
                        "expense_date_time": expense_date_time,
                        "amount": expenseDetailsListArr[i].amount,
                        "reason": expenseDetailsListArr[i].reason,
                        "items": itemStr
                    };

                    if(findIndex > -1){

                        returnArr[findIndex].expense_details.push(expenseObj);
                    }else{
                        returnArr.push({
                            "expense_date": expense_date,
                            "expense_details": [expenseObj]
                        });
                    }
                   
                }catch(e){

                }
            }
        }

        res.status(200).send(returnArr);
    }catch(expp){
        //console.log(expp);
        res.status(500).send(expp);
    }
});

router.post('/addMonthlyLimit',[auth], async (req, res)=>{
    
    try{
        const loggedInUserId = res.user.user_id;
        const schema = Joi.object().keys({
            limit_amount: Joi.number().required()
        });
     
         const { error } = Joi.validate(req.body, schema);
     
         if(error){
             res.status(403).send(error.details[0].message);
         }

        const startOfMonth_utc = moment().startOf('month').unix();
        const endOfMonth_utc   = moment().endOf('month').unix();

        let result = {};

        const isExistLimit = await MonthlyExpenseLimit.countDocuments({ user_id: loggedInUserId, start_utc:{ $lte: moment().unix() }, end_utc: { $gte: moment().unix() } });
        if(isExistLimit>0){
            result = await MonthlyExpenseLimit.findOneAndUpdate({user_id: loggedInUserId, start_utc:{ $lte: moment().unix() }, end_utc: { $gte: moment().unix() }}, 
            {$set: { limit_amount: req.body.limit_amount }}, {new: true});
        }else{
            const monthlyExpenseLimitObj = new MonthlyExpenseLimit({
                user_id: loggedInUserId,
                limit_amount: req.body.limit_amount,
                start_utc: startOfMonth_utc,
                end_utc: endOfMonth_utc,
                doc_utc: moment().unix(),
                dom_utc: 0
            });
             
            result = await monthlyExpenseLimitObj.save();
        }

       
         //console.log(result);
         if(result){
             res.status(200).send(result);
         }else{
             res.status(500).send({ message : "Some error occured." });
         }
    }catch(expp){
        //console.log(expp);
        res.status(500).send(expp);
    }
   
});

router.get('/getMonthlyLimit',[auth] , async (req, res)=>{

    try{
        let returnObj = {};

        const loggedInUserId = res.user.user_id;

        const monthlyLimit = await MonthlyExpenseLimit.findOne({ user_id: loggedInUserId, start_utc:{ $lte: moment().unix() }, end_utc: { $gte: moment().unix() } }).lean();

        if(monthlyLimit != undefined && monthlyLimit != null && Object.keys(monthlyLimit).length>0){
            returnObj = {...monthlyLimit};
        }

        res.status(200).send(returnObj);
    }catch(expp){
        //console.log(expp);
        res.status(500).send(expp);
    }
});
module.exports = router;