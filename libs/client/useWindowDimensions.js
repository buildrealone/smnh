import { useEffect, useState } from 'react'

export default WindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(true);

    useEffect(() => {
      function handleResize(){
          setWindowDimensions(window.innerWidth > 1023)
      };
      handleResize();
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions;
};

// example. const isWeb = WindowDimensions();