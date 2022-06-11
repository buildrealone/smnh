import { useState } from 'react';
import { SWRConfig } from 'swr';
import axios from 'axios';
import UserContext from '../libs/client/UserContext';
import '../styles/globals.css';

const SWRConfigOptions = {

  // (1). axios fetcher 
  fetcher: (url) => axios.get(url).then(res => res.data),
  
  // (2). revalidate: should the cache revalidate once the asynchorous update resolves. (default = true)
  revalidate: true,

  // (3). rollbackOnError: should the cache rollback if the remote mutation errors. (default = true)
  rollbackOnError: true,

  // (4). refreshInterval: how frequently the page should be refreshed in milliseconds. (default = 0)
  refreshInterval: 0,

  // (5). dedupingInterval: dedupe requests with the same key in this time span in milliseconds. (default = 2000)
  dedupingInterval: 2000,
};

const App = ({ Component, pageProps }) => {

  const [isKoreanOption, setIsKoreanOption] = useState(true);

  return (
    <SWRConfig value = { SWRConfigOptions }>
      <UserContext.Provider value={{ isKoreanOption, setIsKoreanOption }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </SWRConfig>
  )
};

export default App;
