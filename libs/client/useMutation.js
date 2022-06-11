import { useState } from 'react';
import axios from'axios';

export default function useMutation(url) {
  
  const [states, setStates] = useState({
    data: undefined,
    isLoading: false,
    error: undefined,
  }); 

  function mutate(data) {
    setStates((prevStates) => ({ ...prevStates, isLoading: true }));

    axios(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    })
      .then((res) => setStates((prevStates) => ({ ...prevStates, data: res.data, isLoading: false })))
      .catch((error) => setStates((prevStates) => ({ ...prevStates, error, isLoading: false })));


  };

  return [mutate, { ...states }];

};