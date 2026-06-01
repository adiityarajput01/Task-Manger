const Task = require('../models/Task');

const createTask = async (req, res)=>{
    try{
    const {title, description, priority, dueDate} = req.body
    const userId = req.user.id;

    if(!title) return res.status(400).json({message: "title is required"});

    const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        userId
    })

    res.status(201).json({
        message: "Task created successfully",
        task
    })
}catch(err){
     res.status(500).json({message: "Server error", error: err.message});

}};


const getTasks = async (req, res)=>{
    try{
    const userId = req.user.id

    const {search, priority} = req.query;

    let filter = { userId: req.user.id};
    if(priority) filter.priority = priority;
    if(search) filter.title = { $regex: search, $options: 'i'}

    const tasks = await Task.find(filter);

    res.status(200).json({
        message: "Task fetched succcessfully",
        count: tasks.length,
        tasks
    });
} catch (err){
     res.status(500).json({ message: "Server error", error: err.message });
}};

const updateTask = async (req, res)=> {
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            { new: true }
        );
        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
    }catch (err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const deleteTask = async (req, res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

         await task.deleteOne();
         return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

const updateStatus = async (req, res) => {
    try{
        const taskId = req.params.id;
        const {status} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {status},
        { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);

    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        
        const total = await Task.countDocuments({ userId });

        
        const completed = await Task.countDocuments({ userId, status: "completed" });
        const pending = await Task.countDocuments({ userId, status: "pending" });
        const inProgress = await Task.countDocuments({ userId, status: "in-progress" });

        
        const completionPercentage = total > 0 
            ? Math.round((completed / total) * 100) 
            : 0;

        res.status(200).json({
            total,
            completed,
            pending,
            inProgress,
            completionPercentage
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    updateStatus,
    getStats
};