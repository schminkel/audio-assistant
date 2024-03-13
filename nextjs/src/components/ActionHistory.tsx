'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SpeakerWaveIcon } from '@heroicons/react/20/solid'
import { Container } from '@/components/Container'
import { DateFormatter } from '@/components/DateFormatter'
import backgroundImage from '@/images/background-faqs.jpg'
import axios from 'axios'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { PulseLoader } from 'react-spinners'
import { useInterval } from '@/hooks/useInterval'
import { loadingStateStore } from '@/stores/loadingStateStore'
import { dashboardStore } from '@/stores/dashboardStore'
import { Button } from '@/components/Button'
import { toast } from 'react-toastify'
// @ts-ignore
import readySfx from '../../public/sounds/ready.mp3'
// @ts-ignore
import useSound from 'use-sound'

type Activity = {
  actionType: string
  actionUuid: string
  actionResult: string
  actionUpdated: string
}

export function ActionHistory(): React.ReactElement {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fpHash, setFpHash] = useState<string>('')
  const { isReloading } = loadingStateStore()
  const [playReadySound] = useSound(readySfx)

  const { startReloading: startReloadingLoadingState } = loadingStateStore()
  const { stopReloading: stopReloadingLoadingState } = loadingStateStore()

  const { setUserRequests: setUserRequestsDashboardStore } = dashboardStore()
  const { setAllUserRequests: setAllUserRequestsDashboardStore } =
    dashboardStore()
  const { setGlobalRequests: setGlobalRequestsDashboardStore } =
    dashboardStore()
  const { setUserLimit: setUserLimitDashboardStore } = dashboardStore()
  const { setGlobalLimit: setGlobalLimitDashboardStore } = dashboardStore()
  const { setUserId: setUserIdDashboardStore } = dashboardStore()

  useEffect(() => {
    const fetchData = async () => {
      FingerprintJS.load().then((fp) =>
        fp.get().then(async (resultFp) => {
          setFpHash(resultFp.visitorId)

          // Get quota information and update dashboard
          await quota(resultFp.visitorId)

          const result = await axios(
            'api/action-history/show?daysAgo=3&userId=' + resultFp.visitorId,
          )
          const activities = result.data
          if (activities.length > 0) {
            if (activities[0].actionType !== 'chatgpt') {
              startReloadingLoadingState()
            } else {
              stopReloadingLoadingState()
            }
          }
          setActivities(activities)
          setIsLoading(false)
        }),
      )
    }
    void fetchData()
  }, [])

  useInterval(
    async () => {
      try {
        const result = await axios(
          'api/action-history/show?daysAgo=3&userId=' + fpHash,
        )
        const activities = result.data
        if (activities.length > 0) {
          if (activities[0].actionType !== 'chatgpt') {
            startReloadingLoadingState()
          } else {
            stopReloadingLoadingState()
            playReadySound()
            await quota(fpHash)
          }
        }
        setActivities(activities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setIsLoading(false)
      }
    },
    isReloading ? 10000 : null,
  )

  const quota = async (fpHash: string) => {
    try {
      const response = await fetch(`api/quota?userId=${fpHash}`)
      const {
        userRequests,
        allUserRequests,
        globalRequests,
        userLimit,
        globalLimit,
      } = await response.json()

      if (response.ok) {
        // update dashboard store with quota information
        setUserRequestsDashboardStore(userRequests)
        setAllUserRequestsDashboardStore(allUserRequests)
        setGlobalRequestsDashboardStore(globalRequests)
        setUserLimitDashboardStore(userLimit)
        setGlobalLimitDashboardStore(globalLimit)
        setUserIdDashboardStore(fpHash)
      }
    } catch (error) {
      console.error('Error getting quota information:', error)
    }
  }

  const deleteEntriesPerUserID = async () => {
    try {
      const response = await fetch(`api/action-history/delete?userId=${fpHash}`)
      const { itemsUpdated } = await response.json()

      if (response.ok) {
        toast.success(
          'Alle ' +
            Math.round(parseFloat(String(itemsUpdated / 3))) +
            ' Einträge wurden erfolgreich gelöscht 🎉',
          {
            position: toast.POSITION.TOP_CENTER,
          },
        )
        startReloadingLoadingState()
      }
    } catch (error) {
      console.error('Error when deleting user data:', error)
      toast.error(
        'Leider ist ein Fehler aufgetreten, kontaktieren Sie den Kundenservice.',
        {
          position: toast.POSITION.TOP_CENTER,
        },
      )
    }
  }

  return (
    <section
      id="ActionHistory"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 z-0 max-w-none -translate-y-1/4 translate-x-[-30%] opacity-50"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />

      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-20 font-display text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
            Aktivitätsverlauf
          </h2>
          {isReloading ? (
            <PulseLoader
              className="mb-16"
              color="#000000"
              size={16}
              loading={true}
            />
          ) : (
            <></>
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="flow-root">
              {isLoading ? (
                <ul role="list" className="-mb-8">
                  <li className="flex items-center justify-center">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                    </div>
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="mt-4 text-base font-medium">
                      Loading...
                    </span>
                  </li>
                </ul>
              ) : (
                <>
                  {activities.length === 0 ? (
                    <ul role="list" className="-mb-8">
                      <li className="flex items-center justify-center">
                        <span
                          className="mt-4
                         text-base font-medium"
                        >
                          Sie haben noch <b>keine</b> Anfragen gestellt.
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <ul role="list" className="-mb-8">
                      {activities.map((activityItem, activityItemIdx) => (
                        <li key={activityItem.actionUuid}>
                          <div className="relative pb-8">
                            {activityItemIdx !== activities.length - 1 ? (
                              <span
                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              {getActivityItemByType(activityItem)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
      <Container className="relative flex items-center justify-center pt-32">
        <Button
          color="red"
          onClick={() => deleteEntriesPerUserID()}
          className="bg-red-600 text-lg tracking-wider text-white"
        >
          <span>Alle Anfragen löschen</span>
        </Button>
      </Container>
    </section>
  )
}

/**
 * Get the activity item by type.
 * @param {object} activityItem
 * @returns {JSX.Element}
 */
function getActivityItemByType(activityItem: Activity): React.ReactElement {
  if (activityItem.actionType === 'audio') {
    return (
      <>
        <div>
          <div className="relative px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white ring-opacity-0">
              <SpeakerWaveIcon
                className="h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1 py-1.5">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                Audio aufgenommen
              </span>
              &nbsp;&nbsp;
              <span className="whitespace-nowrap">
                <DateFormatter isoTimestamp={activityItem.actionUpdated} />
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <audio controls id="tts-audio" className="w-full pl-0 pr-1">
              <source src={activityItem.actionResult} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      </>
    )
  } else if (activityItem.actionType === 'transcription') {
    return (
      <>
        <div>
          <div className="relative px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-8 ring-white ring-opacity-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 32 32"
              >
                <title>voice-recognition</title>
                <g fill="#fff">
                  <path
                    d="M28,1.023H4a4,4,0,0,0-4,4v16a4,4,0,0,0,4,4h6.532L16,31.585l5.468-6.562H28a4,4,0,0,0,4-4v-16A4,4,0,0,0,28,1.023ZM7,16a1,1,0,0,1-2,0V10a1,1,0,0,1,2,0Zm5,3a1,1,0,0,1-2,0V7a1,1,0,0,1,2,0Zm5-4a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm5,2a1,1,0,0,1-2,0V9a1,1,0,0,1,2,0Zm5-2a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z"
                    fill="#e5e7eb"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1 py-1.5">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                Audio umgewandelt in Text
              </span>
              &nbsp;&nbsp;
              <span className="whitespace-nowrap">
                <DateFormatter isoTimestamp={activityItem.actionUpdated} />
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>{activityItem.actionResult}</p>
          </div>
        </div>
      </>
    )
  } else if (activityItem.actionType === 'chatgpt') {
    return (
      <>
        <div>
          <div className="relative px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#75AA9C] ring-8 ring-white ring-opacity-0">
              <span className="h-5 w-5 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <title>open-ai</title>
                  <g fill="#ffffff">
                    <path
                      d="M55.487,23.844c1.426-3.694,1.147-7.897-.862-11.377-1.765-3.055-4.612-5.24-8.02-6.153-3.371-.905-6.886-.451-9.918,1.265-2.486-3.083-6.272-4.939-10.291-4.939-7.243,0-13.138,5.862-13.202,13.09-3.915,.612-7.414,2.963-9.422,6.443-3.624,6.274-1.493,14.315,4.741,17.983-1.426,3.694-1.147,7.897,.862,11.377,1.765,3.055,4.612,5.24,8.02,6.153,1.139,.306,2.293,.456,3.44,.456,2.25,0,4.468-.586,6.477-1.722,2.486,3.084,6.272,4.94,10.292,4.94,7.243,0,13.138-5.862,13.202-13.09,3.915-.612,7.414-2.963,9.422-6.443,3.624-6.274,1.493-14.315-4.741-17.983Zm-4.326-9.377c1.294,2.241,1.55,4.91,.801,7.335l-9.937-5.737-14.812,8.552v-6.956l11.371-6.563c4.396-2.537,10.038-1.027,12.577,3.37Zm-14.372,20.297l-4.788,2.765-4.788-2.764v-5.529l4.788-2.765,4.788,2.764v5.529ZM17.188,15.848c0-5.077,4.131-9.208,9.208-9.208,2.587,0,5.026,1.113,6.752,2.975l-9.936,5.737v17.104l-6.024-3.478V15.848ZM7.236,24.173c1.293-2.241,3.477-3.796,5.952-4.36v11.474s14.811,8.553,14.811,8.553l-6.023,3.478-11.371-6.564c-4.396-2.54-5.908-8.183-3.369-12.579Zm5.604,25.36c-1.294-2.241-1.55-4.91-.801-7.335l9.937,5.737,14.812-8.552v6.956l-11.371,6.563c-4.396,2.538-10.038,1.026-12.577-3.37Zm33.972-1.381c0,5.077-4.131,9.208-9.208,9.208-2.587,0-5.026-1.113-6.752-2.975l9.936-5.737V31.544l6.024,3.478v13.13Zm9.951-8.325c-1.293,2.241-3.477,3.796-5.952,4.36v-11.474s-14.811-8.553-14.811-8.553l6.023-3.478,11.371,6.564c4.396,2.54,5.908,8.183,3.369,12.579Z"
                      fill="#ffffff"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1 py-1.5">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                ChatGPT antwortete
              </span>
              &nbsp;&nbsp;
              <span className="whitespace-nowrap">
                <DateFormatter isoTimestamp={activityItem.actionUpdated} />
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>{activityItem.actionResult}</p>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="text-xs font-bold text-red-600">
          type not found for: {activityItem.actionType}
        </div>
      </>
    )
  }
}
