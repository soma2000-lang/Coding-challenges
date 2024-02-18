import React, { useEffect, useState } from 'react'
import { useSpotify } from '../hooks/useSpotify'
import {
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
  VolumeUp,
} from '@mui/icons-material'
import { Slider } from '@mui/material'
import Loading from './Loading'

function WebPlayback() {
  const sdk = useSpotify()
  const [player, setPlayer] = useState(null as Spotify.Player | null)
  const [currentTrack, setCurrentTrack] = useState(null as Spotify.Track | null)
  const [paused, setPaused] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [deviceId, setDeviceId] = useState(null as string | null)
  const [transferringPlayback, setTransferringPlayback] = useState(false)

  const onVolumeChange = (event: Event, newValue: number[] | number) => {
    const newVolume = newValue as number
    player?.setVolume(newVolume)
    setVolume(newVolume)
  }

  const transferPlayback = async () => {
    if (sdk && deviceId) {
      setTransferringPlayback(true)
      await sdk.player.transferPlayback([deviceId])
    }
  }

  useEffect(() => {
    if (sdk === null) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Spotify Client',
        getOAuthToken: (cb) => {
          sdk
            .getAccessToken()
            .then((token) => {
              if (token) {
                cb(token.access_token)
              } else {
                console.error('Access Token not found')
              }
            })
            .catch((e) => {
              console.error(e)
            })
        },
        volume: volume,
      })

      setPlayer(player)

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
        setDeviceId(device_id)
      })

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
      })

      player.addListener('player_state_changed', (state) => {
        if (!state) {
          setIsActive(false)
          return
        }

        setCurrentTrack(state.track_window.current_track)
        setPaused(state.paused)

        player.getVolume().then((value) => {
          setVolume(value)
        })

        player.getCurrentState().then((currentState) => {
          if (currentState) {
            setIsActive(true)
            setTransferringPlayback(false)
          } else {
            setIsActive(false)
          }
        })
      })

      player.connect()
    }

    return () => {
      player?.disconnect()
      setPlayer(null)
    }
  }, [sdk])

  if (!isActive) {
    return (
      <div className='sticky bottom-0 left-0 right-0 mt-auto w-full bg-gray-700 p-2'>
        <div className='width-full flex flex-col items-center justify-center gap-3'>
          {transferringPlayback ? (
            <Loading />
          ) : (
            <>
              <p className='text-sm'>Transfer playback to this Webpage.</p>
              <p className='text-xs'>
                In order to run the player, you need to transfer the playback to
                this Webpage
              </p>
              <button
                className='btn btn-green text-xs'
                onClick={transferPlayback}
              >
                Transfer playback
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='sticky bottom-0 left-0 right-0 h-20 w-full bg-gray-700 p-2'>
      <div className='flex h-full w-full'>
        {currentTrack && (
          <div className='flex w-1/3 flex-row gap-3'>
            <img
              src={currentTrack.album.images[0].url}
              width={64}
              className='rounded-sm'
            ></img>
            <div className='flex flex-col justify-center gap-1 overflow-hidden text-ellipsis'>
              <p className='text-xs'>{currentTrack.name}</p>
              <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs'>
                {currentTrack.artists.map((obj) => obj.name).join(', ')}
              </p>
            </div>
          </div>
        )}
        <div className='flex w-1/3 flex-row items-center justify-center gap-3'>
          <button
            className='btn-spotify'
            onClick={() => {
              player?.previousTrack()
            }}
          >
            <SkipPrevious titleAccess='Previous' />
          </button>

          <button
            className='btn-spotify'
            onClick={() => {
              player?.togglePlay()
            }}
          >
            {paused ? (
              <PlayArrow titleAccess='Play' />
            ) : (
              <Pause titleAccess='Pause' />
            )}
          </button>

          <button
            className='btn-spotify'
            onClick={() => {
              player?.nextTrack()
            }}
          >
            <SkipNext titleAccess='Next' />
          </button>
        </div>
        <div className='flex w-1/3 flex-col items-end justify-center'>
          <div className='flex flex-row items-center justify-end gap-3 sm:w-1/2 xl:w-1/3'>
            <VolumeUp fontSize='small' />
            <Slider
              size='small'
              aria-label='Volume'
              onChange={onVolumeChange}
              value={volume}
              step={0.01}
              min={0}
              max={1}
              title='Volume'
              sx={{ color: 'white' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebPlayback