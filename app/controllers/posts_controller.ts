import type { HttpContext } from '@adonisjs/core/http'
import { PostService } from '#services/post_service'

export default class PostsController {
    private postService = new PostService();

    public async index({ response }: HttpContext){
        try {
            const posts = await this.postService.getAllPosts();
            return response.json(posts);
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }

    public async show({ params, response }: HttpContext){
        try {
            const post = await this.postService.getPostById(params.id);
            return response.json(post);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }

    public async store({ request, response }: HttpContext){
        try {
            const body = request.only(['userId', 'caption', 'mediaUrl', 'postType']);
            const newPost = await this.postService.createPost(body);
            return response.status(201).json(newPost);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async update({ params, request, response }: HttpContext){
        try {
            const body = request.only(['caption', 'mediaUrl']);
            const updatedPost = await this.postService.updatePost(params.id, body);
            return response.json(updatedPost);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async destroy({ params, response }: HttpContext){
        try {
            const result = await this.postService.deletePost(params.id);
            return response.json(result);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }

    public async getUserPosts({ params, response }: HttpContext){
        try {
            const posts = await this.postService.getPostsByUserId(params.userId);
            return response.json(posts);
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }
}