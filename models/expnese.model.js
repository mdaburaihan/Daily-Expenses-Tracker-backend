const mongoose = require('mongoose');
//const autoIncrement = require('../index').autoIncrement;

const expenseSchema = new mongoose.Schema({
    user_id:  {
        type: Number,
        default: 0,
        required: true
    },
    amount:  {
        type: Number,
        default: 0,
        required: true
    },
    reason: {
        type: String,
        default: "",
        required: true
    },
    spent_time_utc: {
        type: Number,
        default: 0,
        required: true
    },
    items: {
        type: Array,
        default: []
    },
    past_expense: {
        type: Boolean,
        default: false
    },
    past_expense_date: {
        type: String,
        default: ""
    },
    dom_utc: {
        type: Number,
        default: 0
    },
 });

//  expenseSchema.plugin(autoIncrement.plugin, {
//     model: 't_expense',
//     field: 'expense_id',
//     startAt: 1,
//     incrementBy: 1
// });

const Expense = mongoose.model('t_expense', expenseSchema);

const monthlyExpenseLimitSchema = new mongoose.Schema({
    user_id:  {
        type: Number,
        default: 0,
        required: true
    },
    limit_amount:  {
        type: Number,
        default: 0,
        required: true
    },
    start_utc:  {
        type: Number,
        default: 0,
        required: true
    },
    end_utc:  {
        type: Number,
        default: 0,
        required: true
    },
    doc_utc: {
        type: Number,
        default: 0
    },
    dom_utc: {
        type: Number,
        default: 0
    },
 });

//  monthlyExpenseLimitSchema.plugin(autoIncrement.plugin, {
//     model: 't_monthly_expense_limit',
//     field: 'expense_limit_id',
//     startAt: 1,
//     incrementBy: 1
// });

const MonthlyExpenseLimit = mongoose.model('t_monthly_expense_limit', monthlyExpenseLimitSchema);

exports.Expense = Expense;
exports.MonthlyExpenseLimit = MonthlyExpenseLimit;