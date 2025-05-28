const bcrypt = require('bcrypt');
const express=require('express')
const mongoose=require('mongoose') 
const cors=require('cors')
const { UserModel, TaskModel } = require('./models/schema');
const app = express()
app.use(express.json())
app.use(cors())
async function connectdb(){
try{
await mongoose.connect("mongodb://localhost:27017/speakEase");
console.log("db connnection success")
         const x= 4000;
         app.listen(x,function(){
             console.log(`starting port ${x}...`)
         })
     }
     catch(err){
        console.log("db not connected: "+err);
    }
}
connectdb();
// Get Specific User
app.get('/getuser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update User
app.put('/updateuser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    // Find if there is any other user with the new username or email
    const existingUser = await UserModel.findOne({ 
      $or: [{ name }, { email }],
      _id: { $ne: userId }  // Exclude the current user
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      } else if (existingUser.name === name) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Update the user details
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//login
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  console.log(`Login attempt: name=${name}, password=${password}`);
  try {
    const user = await UserModel.findOne({ name });
    console.log('User found:', user);
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ id: user._id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//signup
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(400).json({ message: 'Username already exists' });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User created successfully', userId: user._id });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Add Task
app.post('/addTask', async (req, res) => {
  try {
      const { taskname, date, time, status, notistatus, userId } = req.body;
      
      const task = new TaskModel({
          taskname,
          date,
          time,
          status,
          notistatus,
          user: userId 
      });
      await task.save();
      res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Update Task
app.put('/updateTask/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      const updatedFields=req.body;
      const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updatedFields, { new: true });
      res.json(updatedTask);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Delete Task
app.delete('/deleteTask/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      await TaskModel.findByIdAndDelete(taskId);
      res.json({ message: "Task deleted successfully" ,deletedTaskId:taskId});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Display Tasks for Specific User
app.get('/userTasks/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    let tasks;
    const status = req.query.status;

    if (status == 'assigned' || status == 'done' || status == 'missing') {
      tasks = await TaskModel.find({ user: userId, status: status });
    } else {
      tasks = await TaskModel.find({ user: userId });
    }
    

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getting Task Details
app.get('/taskDetails/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskModel.findById(taskId); // Use findById instead of find

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      taskname: task.taskname,
      date: task.date,
      time: task.time,
      notistatus: task.notistatus,
    });
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//mail
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'speakease2024@gmail.com',
    pass: 'sfoh dnyc djdv oklo' // Ensure this is correct
  }
});

// Function to send email reminder for tasks
async function sendTaskReminders() {
  try {
    const users = await UserModel.find();

    for (const user of users) {
      const tasks = await TaskModel.find({ user: user._id });

      for (const task of tasks) {
        // Check if notistatus is 'yes' before sending notification
        if (task.notistatus === 'yes') {
          // Extract date part in 'YYYY-MM-DD' format
          const taskDate = moment(task.date).format('YYYY-MM-DD');
          const taskDateTimeStr = `${taskDate} ${task.time}`;
          const taskDateTime = moment(taskDateTimeStr, 'YYYY-MM-DD HH:mm');
          const reminderTime = taskDateTime.subtract(10, 'minutes');
          const currentDateTime = moment();

          // Compare reminder time with current date-time down to the minute
          if (reminderTime.isSame(currentDateTime, 'minute')) {
            // Send email reminder
            const mailOptions = {
              from: 'speakease2024@gmail.com',
              to: user.emai
              
              
              ,
              subject: 'Task Reminder',
              text: `Dear ${user.name},\n\nThis is a reminder for your task "${task.taskname}" scheduled at ${task.time}.\n\nRegards,\nSpeak Ease`
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(`Error sending email for task ${task._id} to ${user.email}:`, error);
              } else {
                console.log(`Email sent for task ${task._id} to ${user.email}:`, info.response);
              }
            });
          }
        }
      }
    }
  } catch (error) {
    console.log('Error sending task reminders:', error);
  }
}


// Schedule the task reminder job to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running task reminder job...');
  sendTaskReminders();
});