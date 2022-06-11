import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export default function useUser() {

  const { data, mutate, error, isValidating } = useSWR("/api/users/profile"); // { refreshInterval: 1000 }
  const router = useRouter(); 

  const isLoggedIn = data?.userSession?.isLoggedIn;

  useEffect(() => {
    
    // if (!isLoggedIn) { // data && !data?.ok
    //   console.log("You need to log in!");
    //   router.push("/login");
    // }
    
    if (data && data?.ok && isLoggedIn && data?.isEmailVerified) {
      console.log("You are logged in and verified!");
      router.push("/");
    };
  }, [isLoggedIn]);

  return { isLoggedIn, isEmailVerified: data?.isEmailVerified, isPhoneVerified: data?.isPhoneVerified, userId: data?.userId, profile: data?.userProfile, data, mutate, error, isLoading: !data && !error, isValidating };

};   