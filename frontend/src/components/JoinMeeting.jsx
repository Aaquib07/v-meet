import React, { useState } from 'react'

const JoinMeeting = ({ handleCreateMeeting, handleJoinMeeting }) => {

  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')

  return (
    <div className="w-full items-center justify-center flex">
      <div className="bg-emerald-950 w-1/4 max-w-screen-md rounded-lg mt-40 p-10">
        <h1 className='mb-4 text-5xl'>V-Meet</h1>
        <div>
          <label htmlFor="" className="label">
            <span className='label-text'>Name:</span>
          </label>
          <input type="text" className='w-full input input-primary input-bordered' value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder='Enter your name' />
        </div>

        <div className="divider"></div>

        <div className="form-control">
          <label htmlFor="" className="label">
            <span className='label-text'>Meeting ID</span>
          </label>
          <div className="relative">
            <input type="text" className='w-full pr-16 input input-primary input-bordered' id='meetingId' placeholder='Meeting ID' />
            <button id='joinExistingMeeting' className='relative top-2 right-0 rounded-1-none btn btn-primary text-xs mt-2'>
              <span onClick={() => { handleJoinMeeting(roomName, username) }} className='hidden sm:block'>Join Existing Meeting</span>
              <span className="sm:hidden">Join</span>
            </button>
          </div>
        </div>
        <div className="divider">OR</div>
        <div className="flex justify-center">
          <button onClick={() => { handleCreateMeeting(username) }} id='createNewMeeting' className='btn btn-primary'>Create a new meeting</button>
        </div>
      </div>
    </div>
  )
}

export default JoinMeeting