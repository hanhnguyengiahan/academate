import express from 'express';
import {
  send_request,
  accept_friend_request,
  list_friend,
  list_received_requests,
  remove_current_friend,
} from '../controllers/user.controller';
const router = express.Router();

router.get('/friends', list_friend);
router.post('/send', send_request);
router.post('/accept', accept_friend_request);
router.get('/received', list_received_requests);
router.delete('/remove', remove_current_friend);

export default router;

