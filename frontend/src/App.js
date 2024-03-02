import { useEffect, useState } from 'react';
import MeetingScreen from './components/MeetingScreen'
import JoinMeeting from './components/JoinMeeting'
import './App.css';
import axios from 'axios';

// Initialize the SDK
const meteredMeeting = new window.Metered.Meeting()

function App() {

  // Initially, the user has not joined the meeting so
  // meetingJoined is initialized to false. It will be set
  // to true if the user joins the meeting
  const [meetingJoined, setMeetingJoined] = useState(false)
  
  // We store the users who are currently in the meeting.
  // We will update this whenever a new user joins or an
  // existing user leaves the meeting
  const [currentUsers, setCurrentUsers] = useState([])

  // To store the list of remote video and audio tracks
  const [remoteTracks, setRemoteTracks] = useState([])

  // This useeffect hook will take care of all event handlers
  useEffect(() => {
    // This event gets triggered when a remote user starts sharing his/her
    // camera/microphone/screen
    meteredMeeting.on('remoteTrackStarted', (trackItem) => {
      // Add the item into the remoteTracks list
      remoteTracks.push(trackItem)
      // Set the state
      setRemoteTracks([...remoteTracks])
    })

    // This event gets triggered when a remote user stops sharing his/her
    // camera/microphone/screen
    meteredMeeting.on('remoteTrackStopped', (trackItem) => {
      // We iterate through the remoteTracks list to find the
      // trackItem that was stopped and remove it from the list
      for (let i = 0; i < remoteTracks.length; i++) {
        if (trackItem.streamId === remoteTracks[i].streamId) {
          remoteTracks.splice(i, 1)
        }
      }
      // Set the state
      setRemoteTracks([...remoteTracks])
    })

    // This event gets triggered when a new user joins the meeting
    meteredMeeting.on('userJoined', (localTrackItem) => {})

    // This event gets triggered when an existing user exits from 
    // the meeting
    meteredMeeting.on('userLeft', (localTrackItem) => {})

    // This event gets triggered multiple times during the lifecycle 
    // of the meeting(whenever a user enters or leaves the meeting). 
    // It contains an array of users currently in the meeting
    meteredMeeting.on('onlineParticipants', (onlineParticipants) => {
      setCurrentUsers([...onlineParticipants])
    })
  
    return () => {
      meteredMeeting.removeListener('remoteTrackStarted')
      meteredMeeting.removeListener('remoteTrackStopped')
      meteredMeeting.removeListener('userJoined')
      meteredMeeting.removeListener('userLeft')
      meteredMeeting.removeListener('currentParticipants')
    }
  })

  // This function will call the API to create a new meeting
  // room for the user with the provided username
  const handleCreateMeeting = async (username) => {
    // Call API to create room
    const { data } = await axios.post('http://localhost:5000/api/create-room')
    // Call API to fetch Metered domain
    const response = await axios.get('http://localhost:5000/api/fetch-domain')
    // Extract Metered domain and room name from response
    const METERED_DOMAIN = response.data.METERED_DOMAIN
    const roomName = data.roomName

    // Call join() of Metered SDK
    const joinResponse = await meteredMeeting.join({
      name: username,
      roomURL: METERED_DOMAIN + '/' + roomName,
    })

    // Update meetingJoined state to true
    setMeetingJoined(true)
  }

  // This function will call the API to validate the room
  // for the user with the provided username
  const handleJoinMeeting = async (roomName, username) => {
    // Call API to validate the room name
    const response = await axios.get(`http://localhost:5000/api/validate-meeting?roomName=${roomName}`)

    if (response.data.roomFound) {
      // Call API to fetch Metered domain
      const { data } = await axios.get('http://localhost:5000/api/fetch-domain')

      // Extract Metered domain and room name from response
      const METERED_DOMAIN = data.METERED_DOMAIN

      // Call join() of Metered SDK
      const joinResponse = await meteredMeeting.join({
        name: username,
        roomURL: METERED_DOMAIN + '/' + roomName,
      })
      setMeetingJoined(true)
    }
    else {
      alert('Invalid room name')
    }
  }

  return (
    <div className="App">
      {meetingJoined ? (
        <MeetingScreen currentUsers={currentUsers} />
      ) : (
        <JoinMeeting handleCreateMeeting={handleCreateMeeting} handleJoinMeeting={handleJoinMeeting} />
      )}
    </div>
  );
}

export default App;
