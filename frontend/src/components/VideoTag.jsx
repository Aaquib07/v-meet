import React, { useEffect, useRef } from 'react'

const VideoTag = (props) => {
  const video = useRef()
  const sourceObject = props.srcObject
  const source = props.src
  const style = props.style

  // This event handler calls the play() method of the video tag
  const handleCanPlay = () => {
    video.current.play()
  }

  useEffect(() => {
    // Assigning srcObject (received as props) to the video tag 
    if (sourceObject && video.current) {
      video.current.srcObject = sourceObject
    }
  })

  return (
    <>
      <video style={style} ref={video} onCanPlay={handleCanPlay} playsInline className='static shadow-lg bg-slate-900 max-w-full max-h-full' autoPlay={true} src={source} />
    </>
  )
}

export default VideoTag