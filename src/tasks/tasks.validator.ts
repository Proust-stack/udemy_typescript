import { body, ValidationChain } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';
export const createValidator: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('The task title is mandatory')
    .trim()
    .isString()
    .withMessage('Title needs to be in text format'),
  body('date')
    .not()
    .isEmpty()
    .withMessage('The task date is mandatory')
    .isString()
    .withMessage('The date needs to be in text format'),
  body('description')
    .trim()
    .isString()
    .withMessage('The description needs to be in text format'),
  body('priority')
    .trim()
    .isIn([Priority.normal, Priority.low, Priority.high])
    .withMessage('The priority needs to be `low`, `normal` or `low`'),
  body('status')
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage('The status needs to be `todo`, `in progress` or `completed`'),
];
export const updateValidator: ValidationChain[] = [
  body('id')
    .not()
    .isEmpty()
    .withMessage('The id of task is mandatory')
    .trim()
    .isString()
    .withMessage('The id needs to be in a valid uuid format'),
  body('status')
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage('The status needs to be `todo`, `in progress` or `completed`'),
];
