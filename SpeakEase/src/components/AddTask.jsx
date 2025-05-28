
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegKeyboard } from 'react-icons/fa';
import { BiSolidBellRing, BiSolidBellOff } from 'react-icons/bi';

const AddTask = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [listening, setListening] = useState(false);
  const [keyboardClicked, setKeyboardClicked] = useState(false);
  const [notiStatus, setNotiStatus] = useState('yes');

  useEffect(() => {
    startListening();
  }, []);

  const startListening = () => {
    if(keyboardClicked) {
      return;
    }
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
        speak("Tell task name");
      };
      recognition.onend = () => {
        setListening(false);
      };
      let nameRecognized = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (!nameRecognized) {
          if (transcript.toLowerCase().includes('next')) {
            recognition.stop();
          } else {
            console.log(transcript);
            setTaskName(transcript);
            speak("Tell task date");
            startListeningForDate();
          }
        } else {
          if (transcript.toLowerCase().includes('next')) {
            recognition.stop();
          } else {
            console.log(transcript);
            setTaskDate(transcript);
          }
        }
      };
      recognition.start();
    }
  };

  const startListeningForDate = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.toLowerCase().includes('next')) {
          recognition.stop();
        } else {
          console.log(transcript);
          setTaskDate(transcript);
          speak("Tell task time");
          startListeningForTime();
        }
      };
      recognition.start();
    }
  };

  const startListeningForTime = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.toLowerCase().includes('next')) {
          recognition.stop();
        } else {
          console.log(transcript);
          // Extracting time components
          const formattedTime = formatTime(transcript);

          console.log(formattedTime)
          setTaskTime(formattedTime);
        }
      };
      recognition.start();
    }
  };

  // Function to extract time components from transcript
  const formatTime = (transcript) => {
    const timeRegex = /(\d{1,2}):(\d{2})\s?(am|pm)?/i;
    const match = transcript.match(timeRegex);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const meridiem = match[3] ? match[3].toLowerCase() : '';

      if (meridiem === 'pm' && hours < 12) {
        hours += 12;
      }
      if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }

      const formattedHours = hours.toString().padStart(2, '0');
      return `${formattedHours}:${minutes}`;
    } else {
      return transcript; // Fallback to the original transcript if regex doesn't match
    }
  };
//convert text to speak
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName || !taskDate || !taskTime) {
      window.alert('Please fill all the fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const taskData = {
      taskname: taskName,
      date: taskDate,
      time: taskTime,
      status: 'assigned',
      notistatus: notiStatus,
      userId: userId,
    };
    axios.post('http://localhost:4000/addTask', taskData)
      .then(response => {
        console.log(response.data);
        setTaskName('');
        setTaskDate('');
        setTaskTime('');
        onTaskAdded();
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const stopListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.stop();
    setListening(false);
  };

  const handleKeyboardIconClick = () => {
   stopListening();
    setKeyboardClicked(true);
  };

  const toggleNotiStatus = () => {
    setNotiStatus(prevStatus => prevStatus === 'yes' ? 'no' : 'yes');
  };

  return (
    <div className='addtask-container'>
      <div className='addtask-head'>
        <p>Add a Task</p>
        <div className='addtaskhead-left'>
          <p>Add Task -{'\u003E'}</p>
          <FaRegKeyboard size={35} style={{paddingTop:'5px' }} onClick={handleKeyboardIconClick} />
        </div>
      </div>
      <div>
        <form onSubmit={handleAddTask} style={{ marginLeft: '40px' }} className='addtaskinputs'>
          <div>
            <label htmlFor="taskname" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Name</label>
            <input className='input-box' type="text" id="taskname" name="taskname" style={{ marginLeft: '131px', height: '50px', fontSize: '22px',fontFamily:"Itim" }} value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="taskdate" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Completion Date</label>
            <input className='input-box1' type={keyboardClicked ? "date" : "text"} id="taskdate" name="taskdate" style={{ marginLeft: '55px', height: '50px', fontSize: '25px', textAlign: 'center',fontFamily:"Itim" }} value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tasktime" style={{ marginLeft: '100px', fontSize: '28px' }} >Task Completion Time</label>
            <input className='input-box2' type={keyboardClicked ? "time" : "text"} id="tasktime" name="tasktime" style={{ marginLeft: '60px', height: '50px', fontSize: '22px', textAlign: 'center',fontFamily:"Itim" }} value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
          </div>
          <div className='addtaskbtn'>
            <button type="submit" style={{ fontSize: '28px', background: '#37d6cb6c', border: 'none', height: '60px', width: '210px', borderRadius: '15px' ,  fontFamily: "Itim"}}>Add Task</button>
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

export default AddTask;