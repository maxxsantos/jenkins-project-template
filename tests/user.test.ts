import request from 'supertest';
import {app, server} from '../src'; // Ajuste o caminho conforme necessário
import { users, User } from '../src/model/user';

// Clear users array before each test
beforeEach(() => {
  users.length = 0; // Clear the users array
});

afterAll((done) => {
    server.close(done); // Feche o servidor após todos os testes
});

describe('User API', () => {
    afterEach(() => {
        jest.clearAllTimers(); // Limpa todos os timers pendentes
    });

    test('should get all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should create a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
        const response = await request(app).post('/api/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 1, ...newUser });
    });

    test('should get a user by ID', async () => {
        const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
        users.push({ id: 1, ...newUser } as User);
        const response = await request(app).get('/api/users/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, ...newUser });
    });

    test('should update a user by ID', async () => {
        const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
        users.push({ id: 1, ...newUser } as User);
        const updatedUser = { name: 'Jane Smith', email: 'jane.smith@example.com' };
        const response = await request(app).put('/api/users/1').send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, ...updatedUser });
    });

    test('should delete a user by ID', async () => {
        const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
        users.push({ id: 1, ...newUser } as User);
        const response = await request(app).delete('/api/users/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted' });
    });

    test('should return 404 for non-existent user when get', async () => {
        const response = await request(app).get('/api/users/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    test('should return 404 for non-existent user when update', async () => {
        const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
        users.push({ id: 1, ...newUser } as User);
        const updatedUser = { name: 'Jane Smith', email: 'jane.smith@example.com' };
        const response = await request(app).put('/api/users/999').send(updatedUser);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    test('should return 404 for non-existent user when delete', async () => {
        const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
        users.push({ id: 1, ...newUser } as User);
        const response = await request(app).delete('/api/users/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });
});
