import React from 'react';

const Dashboard = ({ assignedTasks,missingTasks,doneTasks,totaltask,onAddTaskClick }) => {
    
  const addLeadingZero = (count) => {
    return count < 10 ? `0${count}` : count;
  };
  return (
    <div className='dashboard'>
      <div className='dash-title'>
        <p>Dashboard</p> 
      </div>
      <div className='card-container'>
        <div className='cards card1'>
          <span className='card-title'>Total</span>
          <span className='card-value'>{addLeadingZero(totaltask)}</span>
        </div>
        
        <div className='cards card2'>
          <span className='card-title'>To - Do</span>
          <span className='card-value'>{addLeadingZero(assignedTasks)}</span>
        </div>
        

        <div className='cards card3'>
          <span className='card-title'>Done</span>
          <span className='card-value'>{addLeadingZero(doneTasks)}</span>
        </div>
        <div className='cards card4'>
          <span className='card-title'>Missing</span>
          <span className='card-value'>{addLeadingZero(missingTasks)}</span>
        </div>
        <button className='add-task-btn' onClick={onAddTaskClick}>Add a Task</button>
      </div>
    </div>
  );
}

export default Dashboard;