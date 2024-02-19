'use client'

import { Button } from '@mui/material'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    return (

        <html>
            <body>
                <h1>Something is wrong</h1>
                <h1>Cause: {error.cause?.toString()}</h1>
                <h1>Message:{error.message}</h1>
                <Button variant="contained" onClick={() => reset()}>
                Try again
                </Button>
            </body>

        </html>
    )
}