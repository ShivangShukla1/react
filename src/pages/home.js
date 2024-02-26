import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import styled from 'styled-components'
import mediaJSON from '../files/source'


const VideoContainer = styled.div`
  width: ${(props) => (props.isFocused ? '75%' : '25%')};
  transition: width 0.5s;
  cursor: pointer;
  position: relative;
`

const ClickableOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #fff;
`

const Home = () => {
  const [focusedVideo, setFocusedVideo] = useState(null)
  const [videoError, setVideoError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleVideoClick = (videoIndex) => {
    setFocusedVideo(videoIndex)
    setVideoError(false)
    setLoading(true)
  }

  const handleVideoStart = (videoIndex) => {
    setFocusedVideo(videoIndex)
  }

  const handleVideoError = (error) => {
    console.error('Video error:', error)
    setVideoError(true)
    setLoading(false)
  }

  const handleBuffer = () => {
    setLoading(true)
  }

  const handleBufferEnd = () => {
    setLoading(false)
  }

  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu)
    }
  }, [])

  return (
    <div>
      {mediaJSON.categories[0].videos.map((link) => (
        <VideoContainer
          key={link.i}
          isFocused={focusedVideo === link.i}
          onClick={() => handleVideoClick(link.i)}
        >
          {focusedVideo === link.i && (
            <ClickableOverlay onClick={() => setFocusedVideo(null)} />
          )}
          {loading && <Spinner>Loading...</Spinner>}
          <ReactPlayer
            playing={focusedVideo === link.i}
            url={link.sources[0]}
            controls={false}
            width='100%'
            height='100%'
            style={{ width: '100%' }}
            onStart={() => handleVideoStart(link.i)}
            onError={handleVideoError}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
          />
          {videoError && (
            <p style={{ color: 'red' }}>Error loading the video</p>
          )}
        </VideoContainer>
      ))}
    </div>
  )
}

export default Home
