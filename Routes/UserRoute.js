import express from 'express';
import { deleteUser, followUser, getUser, unFollowUser, updateUser ,getAllUser , postNapTien , postRutTien , chuyentien} from '../Controllers/UserController.js';

const router = express.Router();

router.get('/:id/allUser' , getAllUser);
router.get('/:id' , getUser);
router.put('/:id' , updateUser);
router.delete('/:id' , deleteUser)
router.put('/:id/follow' , followUser)
router.put('/:id/unFollow' , unFollowUser)

router.post("/:id/naptien" , postNapTien)
router.post("/:id/ruttien" , postRutTien)

router.post("/chuyentien" , chuyentien)

export default router;