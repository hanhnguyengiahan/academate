import express from 'express';
import {
  send_request,
  accept_friend_request,
  list_friend,
  list_received_requests,
  list_sent_requests,
} from '../controllers/user.controller';
const router = express.Router();

router.post('/send', send_request);
router.post('/accept', accept_friend_request);
router.post('/friends', list_friend);
router.post('/sent', list_sent_requests);
router.post('/received', list_received_requests);

export default router;

