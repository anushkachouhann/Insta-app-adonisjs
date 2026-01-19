import type { HttpContext } from '@adonisjs/core/http'
import { CommentService } from '#services/comment_service'

export default class CommentsController {
    private commentService = new CommentService();

    public async create({ request, response }: HttpContext){
        try {
            const body = request.only(['userId', 'postId', 'content', 'parentId']);
            const comment = await this.commentService.createComment(body);
            return response.status(201).json(comment);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async getPostComments({ params, response }: HttpContext){
        try {
            const comments = await this.commentService.getCommentsByPostId(params.postId);
            return response.json(comments);
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }

    public async show({ params, response }: HttpContext){
        try {
            const comment = await this.commentService.getCommentById(params.id);
            return response.json(comment);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }

    public async update({ params, request, response }: HttpContext){
        try {
            const { content } = request.only(['content']);
            const updatedComment = await this.commentService.updateComment(params.id, content);
            return response.json(updatedComment);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async destroy({ params, response }: HttpContext){
        try {
            const result = await this.commentService.deleteComment(params.id);
            return response.json(result);
        } catch (error: any) {
            return response.status(404).json({ error: error.message });
        }
    }
}
