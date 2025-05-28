import React from 'react'
import notask from "../images/notask.jpg";

const NoTask = () => {
  return (
    <div className='notaskcontainer'>
      <img src={notask}alt="Empty list!"style={{height:'150px',width:"220px" ,borderRadius:'20px'}}/>
      <h1>Oops! There are no items in this field</h1>
         <ul >
         <span>Organize your tasks with speakease. Here's how:</span>
         <li>
             <strong>Add a Task:</strong> Click the button on the bottom left. Speak by default or type your task details by clicking on keyboard icon. Hit submit.
           </li>
           <li>
            <strong>Task Filtering:</strong>To see the todo tasks,missing tasks,done taks , click todo button,missing button,done button respectively at top. 
            </li>
           
           <li>
             <strong>Update a Task:</strong> Each task is displayed as a list item. Click the pencil icon to update a task.
          </li>
           <li>
             <strong>Notification:</strong> By default, notifications are on when adding a task. Toggle the bell icon to turn notifications on/off. You will receive a mail 10 minutes before the completion of each task to respective user's email.
         </li>
         <li>
            <strong>No of Tasks:</strong>You can see the total no of tasks , no of tasks in todo,no of tasks in missing and no of tasks in done on the dashboard which is at left side
         </li>
         </ul>
    </div>
  )
}
 export default NoTask