import type { HttpContext } from '@adonisjs/core/http'
import { PostService } from '#services/post_service'
import { handleError, created, ok, noContent } from '#utils/response'
import { parseId } from '#utils/params'
import { createPostValidator } from '#validators/posts/create_post_validator'
import { updatePostValidator } from '#validators/posts/update_post_validator'

export default class PostsController {
  private postService = new PostService()

  public async index(ctx: HttpContext) {
    try {
      const posts = await this.postService.getAllPosts()
      return ok(ctx, { data: posts })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const post = await this.postService.getPostById(id)
      return ok(ctx, { data: post })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async store(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(createPostValidator)
      const newPost = await this.postService.createPost(payload)
      return created(ctx, { messageKey: 'CREATED', data: newPost })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const payload = await ctx.request.validateUsing(updatePostValidator)
      const updatedPost = await this.postService.updatePost(id, payload)
      return ok(ctx, { messageKey: 'UPDATED', data: updatedPost })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async destroy(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      await this.postService.deletePost(id)
      return noContent(ctx, { messageKey: 'DELETED' })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async getUserPosts(ctx: HttpContext) {
    try {
      const userId = parseId(ctx.params.userId, 'userId')
      const posts = await this.postService.getPostsByUserId(userId)
      return ok(ctx, { data: posts })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}
