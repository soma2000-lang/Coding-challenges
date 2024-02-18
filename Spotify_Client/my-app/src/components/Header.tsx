import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../spotify-logo.svg'
import { useSpotify } from '../hooks/useSpotify'

function Header() {
  const location = useLocation()
  const sdk = useSpotify()

  const handleSignOut = () => {
    sdk?.logOut()
    window.location.assign('/')
  }

  useEffect(() => {
    const url: string = location?.pathname ?? ''

    const navBtn = document.querySelectorAll('nav .btn-nav')

    const headerPlaylist = document.getElementById('id-header-playlist')
    const headerHome = document.getElementById('id-header-home')

    navBtn.forEach((btn) => btn.classList.remove('active'))

    if (url && url.includes('/playlist')) {
      headerPlaylist?.classList.add('active')
    } else {
      headerHome?.classList.add('active')
    }
  }, [location])

  return (
    <nav className='sticky top-0 z-50 flex flex-wrap items-center justify-between bg-gray-800 p-3'>
      <Link
        className='mr-6 flex flex-shrink-0 items-center justify-center gap-2'
        to={'/'}
      >
        <img src={logo} width={20} height={20} />
        <p className='text-sm font-medium'>Spotify Client</p>
      </Link>
      <div className='flex flex-grow justify-between'>
        <div className='flex gap-2'>
          <Link className='btn btn-nav' to={'/'} id='id-header-home'>
            Home
          </Link>

          <Link
            className='btn btn-nav'
            to={'/playlists'}
            id='id-header-playlist'
          >
            Playlists
          </Link>
        </div>
        <div className='flex gap-2'>
          {sdk && (
            <button className='btn btn-nav btn-danger' onClick={handleSignOut}>
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header