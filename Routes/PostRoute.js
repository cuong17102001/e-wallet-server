import express from 'express'
import { commentPosts, createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from '../Controllers/PostController.js';
const router = express.Router();

router.post('/' , createPost)
router.get('/:id' , getPost)
router.put('/:id' , updatePost)
router.delete('/:id' , deletePost)
router.get('/:id/timeline' , getTimelinePosts)
router.put('/:id/like' , likePost)
router.post("/:id/comment" , commentPosts)

export default router