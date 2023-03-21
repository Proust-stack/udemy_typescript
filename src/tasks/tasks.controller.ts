import { AppDataSource } from '../..';
import { Task } from './tasks.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    let allTasks: Task[];
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      allTasks = await taskRepository.find({
        order: {
          date: 'ASC',
        },
      });
      allTasks = instanceToPlain(allTasks) as Task[];
      return res.json(allTasks).status(200);
    } catch (_error) {
      return res.json({ error: 'Internal Server Error' }).status(500);
    }
  }
  public async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const task = new Task();
    task.title = req.body.title;
    task.date = req.body.date;
    task.description = req.body.description;
    task.priority = req.body.priority;
    task.status = req.body.status;
    let createdTask: Task;
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      createdTask = await taskRepository.save(task);
      createdTask = instanceToPlain(createdTask) as Task;
      return res.json(createdTask).status(201);
    } catch (_error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  public async updateTask(req: Request, res: Response): Promise<Response> {
    const taskRepository = AppDataSource.getRepository(Task);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let task: Task | null;
    try {
      task = await taskRepository.findOne({
        where: { id: req.body.id },
      });
    } catch (_error) {
      return res.json({ error: 'Internal Server Error' }).status(500);
    }
    if (!task) {
      return res.status(404).json({
        error: 'The task with given Id does not exist',
      });
    }
    let updatedTask: UpdateResult;
    try {
      updatedTask = await taskRepository.update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
        }),
      );
    } catch (_error) {
      return res.json({ error: 'Internal Server Error' }).status(500);
    }
    updatedTask = instanceToPlain(updatedTask) as UpdateResult;
    return res.json(updatedTask).status(200);
  }
}

export const taskController = new TasksController();
