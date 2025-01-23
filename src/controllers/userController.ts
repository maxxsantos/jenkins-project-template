import { Request, Response } from 'express';
import { users, User, findUserById } from '../model/user';

// Get all users
export const getUsers = (req: Request, res: Response) => {
    res.json(users);
};

// Get user by ID
export const getUserById = (req: Request, res: Response) => {
    const user = findUserById(Number(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Create new user
export const createUser = (req: Request, res: Response) => {
    const newUser: User = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

// Update user by ID
export const updateUser = (req: Request, res: Response) => {
    const user = findUserById(Number(req.params.id));
    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Delete user by ID
export const deleteUser = (req: Request, res: Response) => {
    const userIndex = users.findIndex(
        (user) => user.id === Number(req.params.id)
    );
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
