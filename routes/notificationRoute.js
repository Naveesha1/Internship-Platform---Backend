import express from 'express';
import {
  createNotificationController,
  getAdminNotificationController,
  changeNotificationStatusController,
  markAllAsReadController,
  getNotificationsController,
  getMentorNotificationsController,
} from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.post('/create', createNotificationController);
notificationRouter.post('/getAdminNotifications', getAdminNotificationController);
notificationRouter.post('/getStudentNotifications', getNotificationsController);
notificationRouter.post('/getCompanyNotifications', getNotificationsController);
notificationRouter.post('/getMentorNotifications', getMentorNotificationsController);
notificationRouter.post('/changeNotificationStatus', changeNotificationStatusController);
notificationRouter.post('/markAllAsRead', markAllAsReadController);

export default notificationRouter;