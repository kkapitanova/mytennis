import React, { useEffect, useState } from 'react';

const TournamentSubmission = () => {
    const [initialLoad, setInitialLoad] = useState(false)

    useEffect(() => {
        window.scrollTo(0,0)
        setInitialLoad(true)
      }, [initialLoad])

    return (
        <div>This is the tournament submission screen.</div>
    )
}

export default TournamentSubmission