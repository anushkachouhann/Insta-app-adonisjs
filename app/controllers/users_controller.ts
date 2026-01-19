import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { handleError, created, ok, noContent } from '#utils/response'
import { parseId } from '#utils/params'
import { createUserValidator } from '#validators/users/create_user_validator'
import { updateUserValidator } from '#validators/users/update_user_validator'

export default class UsersController {
  private userService = new UserService()

  public async index(ctx: HttpContext) {
    try {
      const users = await this.userService.getAllUsers()
      return ok(ctx, { data: users })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const user = await this.userService.getUserById(id)
      return ok(ctx, { data: user })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async store(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(createUserValidator)
      const newUser = await this.userService.createUser(payload)
      return created(ctx, { messageKey: 'CREATED', data: newUser })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const payload = await ctx.request.validateUsing(updateUserValidator)
      const updatedUser = await this.userService.updateUser(id, payload)
      return ok(ctx, { messageKey: 'UPDATED', data: updatedUser })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async destroy(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      await this.userService.deleteUser(id)
      return noContent(ctx, { messageKey: 'DELETED' })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}
