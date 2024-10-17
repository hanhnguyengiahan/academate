import express from 'express';
import {
  send_request,
  accept_friend_request,
  list_friend,
  list_received_requests,
} from '../controllers/user.controller';
const router = express.Router();

router.post('/send', send_request);
router.post('/accept', accept_friend_request);
router.get('/friends', list_friend);
router.get('/received', list_received_requests);

export default router;

