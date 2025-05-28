import React, { useState, useEffect } from 'react';
import { FaRegKeyboard } from 'react-icons/fa';
import { BiSolidBellRing, BiSolidBellOff } from 'react-icons/bi';
import axios from 'axios';

const UpdateTask = ({ taskId, setTasks, clearSelectedTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [notiStatus, setNotiStatus] = useState('');
  const [keyboardClicked, setKeyboardClicked] = useState(false);
  const [listening, setListening] = useState(false);
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/taskDetails/${taskId}`);
        const { taskname, date, time, notistatus } = response.data;

        // Set task details
        setTaskName(taskname);
        setTaskDate(new Date(date).toLocaleDateString());
        setTaskTime(time);
        setNotiStatus(notistatus);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  useEffect(() => {
  startListeningForField();
}, []);

  const toggleNotiStatus = () => {
    setNotiStatus(prevStatus => prevStatus === 'yes' ? 'no' : 'yes');
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!taskName || !taskDate || !taskTime) {
      window.alert('Please fill all the fields.');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/updateTask/${taskId}`, {
        taskname: taskName,
        date: taskDate,
        time: taskTime,
        status: 'assigned',
        notistatus: notiStatus
      });

      // Fetch tasks again to reflect the updated task in the UI
      fetchTasks();

      // Clear input fields and update task list
      setTaskName('');
      setTaskDate('');
      setTaskTime('');
      clearSelectedTask();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:4000/userTasks/${userId}`);
      setTasks(response.data); // Assuming setTasks updates the state with the tasks data
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const startListeningForField = () => {
    if (keyboardClicked) {
      return;
    }
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }
    speak("Which field do you want to change? Task name, Task date, or Task time?", startListeningForFieldRecognition);
  };
  const startListeningForFieldRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () =>  setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log(transcript);
      if (transcript.includes('task name')) {
        setTaskName('');
        speak("Please say the new task name.", startListeningForTaskName);
      } else if (transcript.includes('task date')) {
        setTaskDate('');
        speak("Please say the new task date.", startListeningForTaskDate);
      } else if (transcript.includes('task time')) {
        setTaskTime('');
        speak("Please say the new task time.", startListeningForTaskTime);
      }
    };
    recognition.start();
  };

  const startListeningForTaskName = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () =>  setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.toLowerCase() !== 'please say the new task name.') {
        setTaskName(transcript);
         speak("Task name is updated.");
      }
    };
    recognition.start();
  };
  
  const startListeningForTaskDate = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.toLowerCase() !== 'please say the new task date.') {
        setTaskDate(transcript);
         speak("Task date is updated.");
      }
    };
    recognition.start();
  };
  
  const startListeningForTaskTime = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const timeComponents = extractTimeComponents(transcript);
      const { hours, minutes, meridiem } = timeComponents;
      const formattedTime = `${hours}:${minutes} ${meridiem}`;
      if (transcript.toLowerCase() !== 'please say the new task time.') {
        setTaskTime(formattedTime);
        speak("Task time is updated.");
      }
    };
    recognition.start();
  };
  const extractTimeComponents = (transcript) => {
    const timeRegex = /(\d{1,2}):(\d{1,2})\s?(am|pm)?/i;
    const match = transcript.match(timeRegex);
    if (match) {
      const hours = match[1];
      const minutes = match[2];
      let meridiem = match[3] || '';
      if (meridiem) {
        meridiem = meridiem.toLowerCase();
      }
      return { hours, minutes, meridiem };
    } else {
      return { hours: '00', minutes: '00', meridiem: '' };
    }
  };

  //convert text to speech
  const speak = (text, callback) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = callback;
    synth.speak(utterance);
  };

  const stopListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.abort(); // Use abort instead of stop for a clean stop
    setListening(false);
  };
  

  const handleKeyboardIconClick = () => {
    stopListening();
    setKeyboardClicked(true);
  };


  return (
    <div className='updatetask-container'>
      <div className='updatetask-head'>
        <p>Update a Task</p>
        <div className='updatetaskhead-left'>
          <p>Update Task -{'\u003E'}</p>
          <FaRegKeyboard size={35} style={{ paddingTop: '5px' }} onClick={handleKeyboardIconClick} />
        </div>
      </div>
      <div>
        <form onSubmit={handleUpdateTask} style={{ marginLeft: '40px' }} className='updatetaskinputs'>
          <div>
            <label htmlFor="taskname" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Name</label>
            <input className='input-box' type="text" id="taskname" name="taskname" style={{ marginLeft: '131px', height: '50px', fontSize: '22px', fontFamily: "Itim" }} value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="taskdate" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Completion Date</label>
            <input className='input-box1'type={keyboardClicked ? "date" : "text"} id="taskdate" name="taskdate" style={{ marginLeft: '55px', height: '50px', fontSize: '25px', textAlign: 'center', fontFamily: "Itim" }} value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tasktime" style={{ marginLeft: '100px', fontSize: '28px' }}>Task Completion Time</label>
            <input className='input-box2'type={keyboardClicked ? "time" : "text"} id="tasktime" name="tasktime" style={{ marginLeft: '60px', height: '50px', fontSize: '22px', textAlign: 'center', fontFamily: "Itim" }} value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
          </div>
          <div className='updatetaskbtn'>
            <button type="submit" style={{ fontSize: '28px', background: '#eddc8adc', border: 'none', height: '60px', width: '210px', borderRadius: '15px', fontFamily: "Itim" }}>Update Task</button>
            {notiStatus === 'yes' ? (
              <BiSolidBellRing size={38} onClick={toggleNotiStatus} />
            ) : (
              <BiSolidBellOff size={38} onClick={toggleNotiStatus} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;