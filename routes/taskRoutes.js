 
import express from 'express';
import Task from '../models/taskmodel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            dueDate
        } = req.body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required'
            });
        }

        const task = await Task.create({
            user: req.user._id,
            title: title.trim(),
            description: description || '',
            priority: priority || 'medium',
            status: status || 'pending',
            dueDate: dueDate || null
        });

        return res.status(201).json(task);

    } catch (error) {
        console.error('Task Creation Error:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json(tasks);

    } catch (error) {
        console.error('Get Tasks Error:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to view this task'
            });
        }

        return res.status(200).json(task);

    } catch (error) {
        console.error('Get Single Task Error:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, priority, status, dueDate } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to update this task'
            });
        }

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    message: 'Task title cannot be empty'
                });
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        const updatedTask = await task.save();

        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error) {
        console.error('Update Task Error:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to delete this task'
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            message: 'Task removed successfully'
        });

    } catch (error) {
        console.error('Delete Task Error:', error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;
