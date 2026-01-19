import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const PostsController = () => import('#controllers/posts_controller')
const LikesController = () => import('#controllers/likes_controller')
const CommentsController = () => import('#controllers/comments_controller')
const SharesController = () => import('#controllers/shares_controller')
const ReportsController = () => import('#controllers/reports_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [UsersController, 'index'])
        router.get('/:id', [UsersController, 'show'])
        router.get('/:userId/posts', [PostsController, 'getUserPosts'])
        router.post('/', [UsersController, 'store'])
        router.put('/:id', [UsersController, 'update'])
        router.delete('/:id', [UsersController, 'destroy'])
      })
      .prefix('/users')

    router
      .group(() => {
        router.get('/', [PostsController, 'index'])
        router.get('/:id', [PostsController, 'show'])
        router.post('/', [PostsController, 'store'])
        router.put('/:id', [PostsController, 'update'])
        router.delete('/:id', [PostsController, 'destroy'])
        router.get('/:postId/likes', [LikesController, 'getPostLikes'])
        router.get('/:postId/comments', [CommentsController, 'getPostComments'])
        router.get('/:postId/shares', [SharesController, 'getPostShares'])
        router.get('/:postId/shares/count', [SharesController, 'getShareCount'])
      })
      .prefix('/posts')

    router
      .group(() => {
        router.post('/', [LikesController, 'like'])
        router.delete('/', [LikesController, 'unlike'])
      })
      .prefix('/likes')

    router
      .group(() => {
        router.post('/', [CommentsController, 'create'])
        router.get('/:id', [CommentsController, 'show'])
        router.put('/:id', [CommentsController, 'update'])
        router.delete('/:id', [CommentsController, 'destroy'])
      })
      .prefix('/comments')

    router
      .group(() => {
        router.post('/', [SharesController, 'share'])
      })
      .prefix('/shares')

    router
      .group(() => {
        router.get('/likes', [ReportsController, 'likes'])
        router.get('/comments', [ReportsController, 'comments'])
      })
      .prefix('/reports')
  })
  .prefix('/insta-api')