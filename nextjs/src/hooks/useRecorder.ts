import React, { useEffect, useState } from 'react'

async function requestRecorder(): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return new MediaRecorder(stream)
}

/**
 * React hook to use browser's recorder.
 */
export const useRecorder = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  boolean,
  () => void,
  () => void,
] => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [audioURL, setAudioURL] = useState<string>('')

  useEffect(() => {
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder).catch(console.error)
      }
      return
    }

    const handleRecording = () => {
      if (isRecording) {
        try {
          recorder.start()
        } catch (error) {
          console.error('Error starting recorder:', error)
        }
      } else {
        try {
          recorder.stop()
        } catch (error) {
          console.error('Error stopping recorder:', error)
        }
      }
    }

    handleRecording()

    const handleDataAvailable = (e: BlobEvent) => {
      setAudioURL(URL.createObjectURL(e.data))
    }

    recorder.addEventListener('dataavailable', handleDataAvailable)
    return () => {
      recorder.removeEventListener('dataavailable', handleDataAvailable)
    }
  }, [recorder, isRecording])

  const startRecording = () => {
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  return [audioURL, setAudioURL, isRecording, startRecording, stopRecording]
}
