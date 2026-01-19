import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'

export default class UsersController {
    private userService = new UserService();

    public async index({ response }: HttpContext){
        try {
            const users = await this.userService.getAllUsers();
            return response.json(users);
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }

    public async show({ params, response }: HttpContext){
        try {
            const user = await this.userService.getUserById(params.id);
            return response.json(user);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }

    public async store({ request, response }: HttpContext){
        try {
            const body = request.only([
                'name', 'email', 'username', 'password', 
                'bio', 'gender', 'profilePicture'
            ]);
            const newUser = await this.userService.createUser(body);
            return response.status(201).json(newUser);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async update({ params, request, response }: HttpContext){
        try {
            const body = request.only([
                'name', 'email', 'username', 'password',
                'bio', 'gender', 'profilePicture'
            ]);
            const updatedUser = await this.userService.updateUser(params.id, body);
            return response.json(updatedUser);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async destroy({ params, response }: HttpContext){
        try {
            const result = await this.userService.deleteUser(params.id);
            return response.json(result);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }
}   