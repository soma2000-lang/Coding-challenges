import React, { useEffect, useState } from 'react'
import { useSpotify } from '../hooks/useSpotify'
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import Loading from '../components/Loading'
import { Link } from 'react-router-dom'

function Playlists() {
  const sdk = useSpotify()
  const [playlists, setPlaylists] = useState([] as SimplifiedPlaylist[])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Playlists'
    sdk?.currentUser.playlists
      .playlists()
      .then((data) => {
        const sortedItems = data.items.sort((a, b) =>
          a.name.localeCompare(b.name),
        )
        setPlaylists(sortedItems)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [sdk])

  if (loading) {
    return <Loading />
  }

  return sdk ? (
    <div className='flex flex-wrap'>
      {Object.values(playlists).map((value) => {
        return PlaylistEntry(value)
      })}
    </div>
  ) : (
    <></>
  )
}

function PlaylistEntry(obj: SimplifiedPlaylist) {
  return (
    <Link
      className='flex w-full cursor-pointer p-2 sm:w-1/2 md:w-1/3 xl:w-1/4'
      key={obj.id}
      to={'/playlist/' + obj.id}
    >
      <div className='flex gap-2 rounded-md p-2 transition duration-150 ease-in-out hover:scale-110 hover:bg-gray-800'>
        {obj.images.length > 0 && (
          <img
            className='w-3/12 rounded-md'
            src={obj.images[0].url}
            loading='lazy'
          />
        )}
        
        
        
          <p className='tex-sm font-medium'>{obj.name}</p>
          <p className='text-xs font-medium'>
            Playlist • {obj.tracks?.total} songs
          </p>
        </div>
      </div>
    </Link>
  )
}

export default Playlists