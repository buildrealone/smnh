import { useState, useEffect } from 'react';
import MainContent from '../pages/components/MainContent';
import TopNavbar from '../pages/components/TopNavbar';
import Footer from '../pages/components/Footer';
import { first_floor_items, second_floor_items, third_floor_items } from '../galleryData';
import Head from 'next/head';
import ItemContext from '../libs/client/ItemContext';
import useMutation from '../libs/client/useMutation';
import { useRouter } from 'next/router';
import useUser from '../libs/client/useUser';
// import { useSWRConfig } from 'swr';

const Home = () => {
  
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("first_floor");
  const [verifyingUserAccountInfo, setVerifyingUserAccountInfo] = useState({});
  const [shortUrl, setShortUrl] = useState(null);
  
  const [isEmailVerificationTextMessageRequest, setIsEmailVerificationTextMessageRequest] = useState(false);
  const [isEmailVerificationTextMessageCompleted, setIsEmailVerificationTextMessageCompleted] = useState(false);
  const [isPhoneVerificationTextMessageRequest, setIsPhoneVerificationTextMessageRequest] = useState(false);
  const [isPhoneVerificationTextMessageCompleted, setIsPhoneVerificationTextMessageCompleted] = useState(false);
  const [isEmailVerificationRequest, setIsEmailVerificationRequest] = useState(false);
  const [isPhoneVerificationRequest, setIsPhoneVerificationRequest] = useState(false);
  const [isEmailVerificationCompleted, setIsEmailVerificationCompleted] = useState(false);
  const [isPhoneVerificationCompleted, setIsPhoneVerificationCompleted] = useState(false);
  const [isShortUrlCreationRequest, setIsShortUrlCreationRequest] = useState(false);
  const [isShortUrlCreationCompleted, setIsShortUrlCreationCompleted] = useState(false);

  const [mutateUserEmailVerificationStatus, { data: userEmailVerificationStatusData, loading: isUserEmailVerificationStatusLoading, error: userEmailVerificationStatusError }] = useMutation("/api/users/email-verification-status");
  const [mutateUserPhoneVerificationStatus, { data: userPhoneVerificationStatusData, loading: isUserPhoneVerificationStatusLoading, error: userPhoneVerificationStatusError }] = useMutation("/api/users/phone-verification-status");
  const [mutateShortUrl, { data: shortUrlData, loading: isShortUrlLoading, error: shortUrlError }] = useMutation("/api/users/short-url");
  const [mutateSendMessage, { data: sendMessageData, loading: isSendMessageLoading, error: sendMessageError }] = useMutation("/api/users/send-message");
  const [mutatePhoneVerificationSendMessage, { data: phoneVerificationSendMessageData, loading: isPhoneVerificationSendMessageLoading, error: phoneVerificationSendMessageError }] = useMutation("/api/users/send-message2");
  const { isLoggedIn, isEmailVerified, isPhoneVerified, data: userData, mutate: boundMutate, isValidating, isLoading } = useUser();
  // const { mutate: unboundMutate, cache } = useSWRConfig();

  useEffect(() => {
    if (router?.query?.email && !isEmailVerificationCompleted) {
      setIsEmailVerificationRequest(true);
      setVerifyingUserAccountInfo({ ...verifyingUserAccountInfo, email: router?.query?.email });
    };
  }, [router?.query?.email]);

  useEffect(() => {
    if (isEmailVerificationRequest) {
      if (isUserEmailVerificationStatusLoading || !verifyingUserAccountInfo?.email) return;
      mutateUserEmailVerificationStatus({ email: verifyingUserAccountInfo?.email });
    };
  }, [isEmailVerificationRequest]);

  useEffect(() => {
    if (userEmailVerificationStatusData && userEmailVerificationStatusData?.ok) {
      setIsEmailVerificationRequest(false);
      setIsEmailVerificationCompleted(true);
      boundMutate();
    };
  }, [userEmailVerificationStatusData]);

  useEffect(() => {
    if (isEmailVerificationCompleted && !isShortUrlCreationRequest) {
      // setIsEmailVerificationTextMessageRequest(true);
      setIsShortUrlCreationRequest(true);
    };
  }, [isEmailVerificationCompleted]);

    useEffect(() => {
    if (isShortUrlCreationRequest && !isShortUrlCreationCompleted) {
      if (isShortUrlLoading || !verifyingUserAccountInfo?.email) return;
      mutateShortUrl({ email: verifyingUserAccountInfo?.email });
    };
  }, [isShortUrlCreationRequest]);

  // useEffect(() => {
  //   if (isEmailVerificationTextMessageRequest) {
  //     if (isShortUrlLoading) return;
  //     mutateShortUrl({ email: verifyingUserAccountInfo?.email });
  //   };
  // }, [isEmailVerificationTextMessageRequest]);

  // useEffect(() => {
  //   if (shortUrlData && shortUrlData?.ok) {
  //     console.log("shortUrl: ", shortUrlData?.shortUrl);
  //     if (isSendMessageLoading || !shortUrlData?.userProfile?.phone || !shortUrlData?.shortUrl) return;
  //     mutateSendMessage({ phone: shortUrlData?.userProfile?.phone, shortUrl: shortUrlData?.shortUrl });
  //   };
  // }, [shortUrlData]);

  useEffect(() => {
    if (shortUrlData && shortUrlData?.ok) {
      setShortUrl(shortUrlData?.shortUrl);
      setIsShortUrlCreationRequest(false);
      setIsShortUrlCreationCompleted(true);
    };
  }, [shortUrlData]); 

  useEffect(() => {
    if (isShortUrlCreationCompleted && !isEmailVerificationTextMessageRequest) {
      setIsEmailVerificationTextMessageRequest(true);
    };
  }, [isShortUrlCreationCompleted]);

  useEffect(() => {
    if (isEmailVerificationTextMessageRequest) {
        if (isSendMessageLoading || !verifyingUserAccountInfo?.email || !shortUrl) return;
        mutateSendMessage({ email: verifyingUserAccountInfo?.email, shortUrl });
    };
  }, [isEmailVerificationTextMessageRequest]); 

  useEffect(() => {
    if (sendMessageData && sendMessageData?.ok) {
      setIsEmailVerificationTextMessageRequest(false);
      setIsEmailVerificationTextMessageCompleted(true);
      console.log("Email Verification Message has been sent!")
    };
  }, [sendMessageData]);

  useEffect(() => {
    if (router?.query?.phone && !isPhoneVerificationCompleted) {
      setIsPhoneVerificationRequest(true);
      setVerifyingUserAccountInfo({ ...verifyingUserAccountInfo, phone: router?.query?.phone });
    };
  }, [router?.query?.phone]);

  useEffect(() => {
    if (isPhoneVerificationRequest) {
      if (isUserPhoneVerificationStatusLoading || !verifyingUserAccountInfo?.phone) return;
      mutateUserPhoneVerificationStatus({ phone: verifyingUserAccountInfo?.phone });
    };
  }, [isPhoneVerificationRequest]);

  useEffect(() => {
    if (userPhoneVerificationStatusData && userPhoneVerificationStatusData?.ok) {
      setIsPhoneVerificationRequest(false);  
      setIsPhoneVerificationCompleted(true);
      // setIsPhoneVerificationTextMessageRequest(true);
      boundMutate();
    };
  }, [userPhoneVerificationStatusData]);

  useEffect(() => {
    if (isPhoneVerificationCompleted && !isPhoneVerificationTextMessageRequest) {
      setIsPhoneVerificationTextMessageRequest(true);
    };
  }, [isPhoneVerificationCompleted]);

  useEffect(() => {
    if (isPhoneVerificationTextMessageRequest) {
      if (isPhoneVerificationSendMessageLoading || !verifyingUserAccountInfo?.phone) return;
      mutatePhoneVerificationSendMessage({ phone: verifyingUserAccountInfo?.phone });
    }
  }, [isPhoneVerificationTextMessageRequest]);

  useEffect(() => {
    if (phoneVerificationSendMessageData && phoneVerificationSendMessageData?.ok) {
      setIsPhoneVerificationTextMessageRequest(false);
      setIsPhoneVerificationTextMessageCompleted(true);
      console.log("Phone Verification Message sent!");
    };
  }, [phoneVerificationSendMessageData]);

  return (
    <div>
      <Head>
        <title>Seodaemun Museum of Natural History</title>
      </Head>
      <ItemContext.Provider value={{ selectedItem, setSelectedItem }}>
        <TopNavbar />
        {selectedItem === "first_floor"
        ? <MainContent items={first_floor_items} title={{ko: "1층 전시관 (인간과 자연관)", en: "1st Floor Gallery (Human and Nature Hall)"}} />
        : selectedItem === "second_floor"
        ? <MainContent items={second_floor_items} title={{ko: "2층 전시관 (생명진화관)", en: "2nd Floor Gallery (Life Evolution Hall)"}} />
        : selectedItem === "third_floor"
        ? <MainContent items={third_floor_items} title={{ko: "3층 전시관 (지구환경관)", en: "3rd Floor Gallery (Earth Environment Hall)"}} />
        : null}
      </ItemContext.Provider>
      <Footer/>
    </div> 
  )
};

export default Home;