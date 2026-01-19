import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import PostsController from '#controllers/posts_controller'
import LikesController from '#controllers/likes_controller'
import CommentsController from '#controllers/comments_controller'
import SharesController from '#controllers/shares_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {

  // Users routes
  router.get('/users', [UsersController, 'index']);
  router.get('/users/:id', [UsersController, 'show']);
  router.post('/users', [UsersController, 'store']);
  router.put('/users/:id', [UsersController, 'update']);
  router.delete('/users/:id', [UsersController, 'destroy']);

// Posts routes 
  router.get('/posts', [PostsController, 'index']);
  router.get('/posts/:id', [PostsController, 'show']);
  router.post('/posts', [PostsController, 'store']);
  router.put('/posts/:id', [PostsController, 'update']);
  router.delete('/posts/:id', [PostsController, 'destroy']);
  router.get('/users/:userId/posts', [PostsController, 'getUserPosts']);
  
// Likes routes 
  router.post('/likes', [LikesController, 'like']);
  router.delete('/likes', [LikesController, 'unlike']);
  router.get('/posts/:postId/likes', [LikesController, 'getPostLikes']);
  // router.get('/posts/:postId/likes/check', [LikesController, 'checkLike']);


// Comments routes 
  router.post('/comments', [CommentsController, 'create']);
  router.get('/posts/:postId/comments', [CommentsController, 'getPostComments']);
  router.get('/comments/:id', [CommentsController, 'show']);
  router.put('/comments/:id', [CommentsController, 'update']);
  router.delete('/comments/:id', [CommentsController, 'destroy']);

// Shares routes 
  router.post('/shares', [SharesController, 'share']);
  router.get('/posts/:postId/shares', [SharesController, 'getPostShares']);
  router.get('/posts/:postId/shares/count', [SharesController, 'getShareCount']);

}).prefix('/insta-api');


