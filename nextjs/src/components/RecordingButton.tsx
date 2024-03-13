'use client'
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { Button } from '@/components/Button'
import { useRecorder } from '@/hooks/useRecorder'
import React, { useEffect, useState } from 'react'
import LoadingButton from '@/components/LoadingButton'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { toast } from 'react-toastify'
import { loadingStateStore } from '@/stores/loadingStateStore'
import { useRouter } from 'next/navigation'
import { AudioVisualizer } from 'ts-audio-visualizer'
import { RequestInfo } from 'undici-types'

export function RecordingButton(): React.ReactElement {
  const [audioURL, setAudioURL, isRecording, startRecording, stopRecording] =
    useRecorder()
  const { startReloading: startReloadingLoadingState } = loadingStateStore()
  const [loadingSendButton, setLoadingSendButton] = useState<boolean>(false)
  const [isUploadable, setIsUploadable] = useState<boolean>(false)
  const [isPlayable, setIsPlayable] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [fpHash, setFpHash] = useState<string>('')
  const router = useRouter()

  /**
   * Get fingerprint id on initial page load
   */
  useEffect(() => {
    FingerprintJS.load().then((fp) =>
      fp.get().then((result) => {
        setFpHash(result.visitorId)
      }),
    )
  }, [])

  /**
   * Triggered when recording is stopped
   */
  useEffect(() => {
    if (!audioURL) {
      return
    }
    setIsPlayable(true)
    setIsUploadable(true)
    const audioDiv = document.getElementById('recording-button-div')
    if (audioDiv?.children.length === 0) {
      let myAudio = document.createElement('audio')
      myAudio.src = audioURL
      myAudio.controls = true
      myAudio.addEventListener('play', function () {
        setIsPlaying(true)
      })
      myAudio.addEventListener('pause', function () {
        setIsPlaying(false)
      })
      audioDiv.appendChild(myAudio)
    }
  }, [audioURL])

  /**
   * Reset audio recording and show record button again
   */
  const resetAudio = () => {
    if (document.getElementById('recording-button-div') === null) {
      return
    }
    // @ts-ignore
    document.getElementById('recording-button-div').innerHTML = ''
    setAudioURL('')
    setIsPlayable(false)
    setIsUploadable(false)
  }

  /**
   * Converts an object to FormData
   */
  const getFormData = (object: {
    [x: string]: string | Blob
    'Content-Type'?: any
    file?: any
    bucket?: any
  }) => {
    const formData = new FormData()
    Object.keys(object).forEach((key) => formData.append(key, object[key]))
    return formData
  }

  /**
   * Send audio to backend
   */
  const sendAudio = async () => {
    setLoadingSendButton(true)
    // make a pause of 0.3 sek to show button animation
    await new Promise((r) => setTimeout(r, 300))
    const audioFile = await getFileFromBlobUrl(audioURL)
    await uploadHandlerCustom(audioFile)
  }

  /**
   * Get a File object from a blob URL
   */
  const getFileFromBlobUrl = async (blobUrl: RequestInfo) => {
    // Fetch the blob data from the URL and convert it to a blob
    // @ts-ignore
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    const fileExtension = blob.type.split('/')[1]
    const uuidFilename = fpHash + '.' + fileExtension
    return new File([blob], uuidFilename, { type: blob.type })
  }

  interface ApiResponse {
    url: string
    fields: {
      bucket: string
    }
    error: boolean
  }

  async function fetchSignedUrlData(file: File): Promise<ApiResponse> {
    const response = await fetch('api/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        filename: file.name,
        userId: fpHash,
      },
    })
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      toast.error(
        <div>
          Leider ist ein technischer Fehler aufgetreten! [{response.statusText},{' '}
          {response.status}]<br />
          Bitte Versuchen Sie es später erneut.
        </div>,
        { position: toast.POSITION.TOP_CENTER, autoClose: 15000 },
      )
      setLoadingSendButton(false)
      console.log(response)
      return { error: true } as ApiResponse
    }
    return await response.json()
  }

  /**
   * Upload a file to S3 using a signed URL
   */
  const uploadHandlerCustom = async (file: File) => {
    const { url, fields, error } = await fetchSignedUrlData(file)
    if (!error) {
      const data = {
        ...fields,
        'Content-Type': file.type,
        file: file,
      }
      const config: AxiosRequestConfig = {
        onUploadProgress: function (progressEvent: AxiosProgressEvent) {
          if (progressEvent.total !== undefined) {
            const filePercentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )

            if (filePercentCompleted === 100) {
              // Update button state
              setLoadingSendButton(false)
            }
          }
        },
      }
      try {
        await axios.post(url, getFormData(data), config)
        toast.success(<div>Ihre Anfrage wurde erfolgreich gesendet!</div>, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 15000,
        })
        resetAudio()
        startReloadingLoadingState()
        router.push('/#ActionHistory')
      } catch (err: any) {
        // ignore the error if it is a CancelError, this is thrown when the user clicks the reset button
        if (err.name !== 'CanceledError') {
          console.error('### file upload failed: ' + err)
          toast.error(
            <div>
              Leider ist ein technischer Fehler aufgetreten! [{err.name}]<br />
              Bitte Versuchen Sie es später erneut.
            </div>,
            { position: toast.POSITION.TOP_CENTER, autoClose: 15000 },
          )
        }
      }
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-28" />
      <Visualizer isPlaying={isPlaying} isRecording={isRecording} />
      <div className="-mt-12">
        <RecordPlay
          isPlayable={isPlayable}
          isPlaying={isPlaying}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>
      <div className="mt-16" />
      <div className="hidden" id="recording-button-div" />
      <div className="mb-24 ml-5 flex justify-center gap-x-6">
        <Send
          isUploadable={isUploadable}
          loadingSendButton={loadingSendButton}
          sendAudio={sendAudio}
        />
        <Reset isPlayable={isPlayable} resetAudio={resetAudio} />
      </div>
    </div>
  )
}

interface SendProps {
  isUploadable: boolean
  loadingSendButton: boolean
  sendAudio: () => void
}

/**
 * Send button to send audio recording (Frage absenden, links)
 */
function Send({
  isUploadable,
  loadingSendButton,
  sendAudio,
}: SendProps): React.ReactElement<SendProps> | null {
  return (
    <>
      <LoadingButton
        loading={loadingSendButton}
        disabled={!isUploadable}
        className={`inline-flex justify-center overflow-hidden rounded-full px-6 py-2 pl-8 pr-8 text-sm font-medium text-white
          ${
            isUploadable
              ? 'bg-slate-900 transition duration-150 ease-in-out hover:bg-slate-700 hover:ring-slate-200'
              : 'bg-slate-300'
          }`}
        onClick={() => sendAudio()}
      >
        <span className="ml-1">
          <span className="hidden sm:mr-1.5 sm:inline">Anfrage</span>
          <span className="">absenden</span>
        </span>
      </LoadingButton>
    </>
  )
}

interface ResetProps {
  isPlayable: boolean
  resetAudio: () => void
}

/**
 * Reset button to reset audio recording (Aufnahme zurücksetzen, rechts)
 */
function Reset({
  isPlayable,
  resetAudio,
}: ResetProps): React.ReactElement<ResetProps> | null {
  return (
    <Button
      disabled={!isPlayable}
      variant="outline"
      color={`${isPlayable ? 'slate' : 'slate_disabled'}`}
      onClick={() => resetAudio()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke={`${isPlayable ? 'red' : 'currentColor'}`}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span className="ml-2">
        <span className="hidden sm:inline">Aufnahme&nbsp;</span>zurücksetzen
      </span>
    </Button>
  )
}

interface VisualizerProps {
  isPlaying: boolean
  isRecording: boolean
}

function Visualizer({
  isPlaying,
  isRecording,
}: VisualizerProps): React.ReactElement<VisualizerProps> | null {
  let barColor = '#ffffff'
  if (isRecording) {
    barColor = '#fee2e2'
  }
  if (isPlaying) {
    barColor = '#f0fdf4'
  }
  if (isRecording || isPlaying) {
    return (
      <>
        <span className="relative -z-50 -mb-[120px] flex rotate-180 justify-center">
          <AudioVisualizer
            mode="wave"
            height="120px"
            width="25%"
            barColor={barColor}
          />
        </span>
        <span className="relative -z-50 -mt-[120px] flex justify-center">
          <AudioVisualizer
            mode="wave"
            height="120px"
            width="25%"
            barColor={barColor}
          />
        </span>
      </>
    )
  } else {
    return null
  }
}

interface RecordPlayProps {
  isPlayable: boolean
  isPlaying: boolean
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => void
}

/**
 * Record/Play button
 */
function RecordPlay({
  isPlayable,
  isPlaying,
  isRecording,
  startRecording,
  stopRecording,
}: RecordPlayProps): React.ReactElement<RecordPlayProps> | null {
  if (isPlayable) {
    return <Play isPlaying={isPlaying} />
  } else {
    return (
      <Record
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
    )
  }
}

interface RecordProps {
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => void
}

/**
 * Record button
 */
function Record({
  isRecording,
  startRecording,
  stopRecording,
}: RecordProps): React.ReactElement<RecordProps> | null {
  return (
    <div className="justify-center gap-x-6">
      {isRecording ? (
        // Recording button
        <Button
          variant="solid"
          color="red"
          className="h-24 w-24 rounded-full p-6"
          onClick={() => stopRecording()}
        >
          <span className="relative m-24 flex h-24 w-24">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60"></span>
            <span className="relative inline-flex h-24 w-24 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="#ffffff"
                className="m-5 h-14 w-14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
              </svg>
            </span>
          </span>
        </Button>
      ) : (
        // Microphone button
        <Button
          color="blue"
          className="h-24 w-24 rounded-full p-6"
          onClick={() => startRecording()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        </Button>
      )}
    </div>
  )
}

interface PlayProps {
  isPlaying: boolean
}

/**
 * Play button
 */
function Play({ isPlaying }: PlayProps): React.ReactElement<PlayProps> | null {
  return (
    <div className="flex justify-center gap-x-6">
      {isPlaying ? (
        // pause button
        <Button
          variant="solid"
          color="green"
          className="pl-4.5 h-24 w-24 rounded-full"
          // @ts-ignore
          onClick={() =>
            document
              .getElementById('recording-button-div') // @ts-ignore
              ?.childNodes[0].pause()
          }
        >
          <span className="relative m-24 flex h-24 w-24">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60"></span>
            <span className="relative inline-flex h-24 w-24 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ffffff"
                className="m-5 h-14 w-14"
              >
                {/*green-100*/}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            </span>
          </span>
        </Button>
      ) : (
        // play button
        <Button
          color="green"
          className="h-24 w-24 rounded-full pl-6"
          // @ts-ignore
          onClick={() =>
            document
              .getElementById('recording-button-div') // @ts-ignore
              ?.childNodes[0].play()
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-14 w-14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        </Button>
      )}
    </div>
  )
}
