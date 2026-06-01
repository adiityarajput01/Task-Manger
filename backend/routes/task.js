const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createTask, getTasks, updateTask, deleteTask, updateStatus, getStats} = require('../controllers/taskController');


router.use(authMiddleware);

router.get('/stats', getStats)
router.route('/').get(getTasks)
.post(createTask);

router.route('/:id').put(updateTask)
.delete(deleteTask);

router.patch('/:id/status', updateStatus);

module.exports = router;