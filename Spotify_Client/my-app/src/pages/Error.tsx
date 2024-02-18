import React from "react";
import { useEffect } from "react";
 
function errorpage()
{

        useEffect(() => {
            document.title = 'Error | Spotify Client'
          }, [])
        

          return (
            <div>
            <p>Error</p>
            </div>
          )

    }
    


export default errorpage