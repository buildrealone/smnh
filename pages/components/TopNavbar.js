import React, { Fragment, useContext, useState, useEffect } from 'react';
import ItemContext from '../../libs/client/ItemContext';
import { Popover, Transition } from '@headlessui/react';
import {
  MenuIcon,
  XIcon,
  LibraryIcon,
  CollectionIcon,
  GiftIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  EmojiHappyIcon,
  VolumeUpIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from '../../libs/client/classNames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserContext from '../../libs/client/UserContext';
import useMutation from '../../libs/client/useMutation';
import useUser from '../../libs/client/useUser';

const exhibitions = [
  {
    id: 1,
    category: "first_floor",
    name: {
      ko: "1층 전시관",
      en: "1st Floor Gallery"
    },
    description: {
      ko: "서대문 자연사 박물관 1층 전시관",
      en: "Seodaemun Museum of Natural History 1st Floor Gallery"
    },
    href: "/",
    icon: LibraryIcon,
  },
  { 
    id: 2,
    category: "second_floor",
    name: {
      ko: "2층 전시관",
      en: "2nd Floor Gallery"
    },
    description: {
      ko: "서대문 자연사 박물관 2층 전시관",
      en: "Seodaemun Museum of Natural History 2nd Floor Gallery"
    },
    href: "/", 
    icon: LibraryIcon,
  },
  {
    id: 3,
    category: "third_floor",
    name: {
      ko: "3층 전시관",
      en: "3rd Floor Gallery"
    },
    description: {
      ko: "서대문 자연사 박물관 3층 전시관",
      en: "Seodaemun Museum of Natural History 3rd Floor Gallery"
    },
    href: "/",
    icon: LibraryIcon,
  },
  {
    id: 4,
    category: "VR",
    name: {
      ko: "VR 전시관",
      en: "VR Gallery"
    },
    description: {
      ko: "실감나는 360° 가상현실 미술작품 전시관",
      en: "Realistic 360° VR Art Gallery"
    },
    href: "/",
    icon: CollectionIcon,
  },
  {
    id: 5,
    category: "special",
    name: {
      ko: "특별 전시관",
      en: "Special Gallery"
    },
    description: {
      ko: "새롭게 단장한 특별 전시관을 구경하세요!",
      en: "Meet our new Special Gallery!"
    },
    href: "/",
    icon: GiftIcon,
  },
];

const resources = [
  {
    id: 1,
    name: {
      ko: "교육 프로그램",
      en: "Education Program"
    },
    description: {
      ko: "서대문 자연사 박물관의 교육 프로그램 소개",
      en: "Introduction of the education program of Seodaemun Museum of Natural History"
    },
    href: "/",
    icon: AcademicCapIcon,
  },
  { 
    id: 2,
    name: {
      ko: "새소식",
      en: "New Updates"
    },
    description: {
      ko: "서대문 자연사 박물관의 새소식",
      en: "Follow new updates of Seodaemun Museum of Natural History"
    },
    href: "/",
    icon: VolumeUpIcon,
  },
  { 
    id: 3,
    name: {
      ko: "이벤트",
      en: "Events"
    },
    description: {
      ko: "서대문 자연사 박물관에서 진행하는 이벤트",
      en: "Join the events of Seodaemun Museum of Natural History"
    },
    href: "/",
    icon: EmojiHappyIcon,
  },
  { 
    id: 4,
    name: {
      ko: "FAQ",
      en: "FAQ"
    },
    description: {
      ko: "자주 묻는 질문들이 궁금하신가요?",
      en: "Let's check our frequently-asked-questions!"
    },
    href: "/",
    icon: QuestionMarkCircleIcon,
  },
];

export default function TopNavbar() {

  const userContext = useContext(UserContext);
  const itemContext = useContext(ItemContext);
  const { isLoggedIn, isVerified, data: userData, mutate: boundMutate, isValidating, isLoading } = useUser();
  const [mutateLogout, { data: logoutData, isLoading: isLogoutLoading }] = useMutation("/api/users/logout");
  // const [isLoginRequest, setIsLoginRequest] = useState(false);
  // const [isLoginCompleted, setIsLoginCompleted] = useState(false);
  const [isLogoutRequest, setIsLogoutRequest] = useState(false);
  const [isLogoutCompleted, setIsLogoutCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (itemContext?.selectedItem) {
      console.log("selectedItem: ", itemContext?.selectedItem);
    };
  }, [itemContext?.selectedItem]);
  
  useEffect(() => {
    if (isLogoutRequest && userData) {
      mutateLogout({ userId: userData?.userId });
    }
  }, [isLogoutRequest]);

  useEffect(() => {
    if (logoutData && logoutData?.ok) {
      setIsLogoutRequest(false);
      setIsLogoutCompleted(true);
      boundMutate();
    }
  }, [logoutData?.ok]);

  return (
    <div className="fixed top-0 w-full z-30">
    <Popover className="bg-white">
      <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div>
          <Link href="/">
            <a className="flex">
                <span className="sr-only">Seodaemun Museum of Natural History</span>
                <Image 
                    className="pointer-events-none"
                    src="/museum_logo.png" 
                    alt="Seodaumun Museum of Natural History"
                    height={30}
                    width={180}
                    placeholder="blur"
                    blurDataURL="/blur.jpg"
                    priority={true}
                    // layout="fill"
                />
            </a>
          </Link>
        </div>
        <div className="-mr-2 -my-2 md:hidden">
          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
          <Popover.Group as="nav" className="flex space-x-10">
            {/* xl:hidden */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-700' : 'text-gray-500',
                      'text-sm md:text-base py-1 px-2 group bg-white rounded-md inline-flex items-center font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    )}
                  >
                    <span>{userContext?.isKoreanOption ? "메타버스 전시관" : "Metaverse Gallery"}</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 group-hover:text-gray-500'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform w-screen max-w-md lg:max-w-3xl">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        
                        {/* lg:grid-cols-1 */}
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-1">
                          {exhibitions?.slice(0, exhibitions?.length - 1)?.map((item, idx) => (
                            <Link key={idx} href={item?.href}>
                                <a 
                                  className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                                  onClick={() => { itemContext?.setSelectedItem(item?.category) }}
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white sm:h-12 sm:w-12">
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                        {/* <FontAwesomeIcon className="h-6 w-6" aria-hidden="true" icon={faSolid, item?.icon} /> */}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-700">{userContext?.isKoreanOption ? item?.name?.ko : item?.name?.en}</p>
                                        <p className="mt-1 text-sm text-gray-500">{userContext?.isKoreanOption ? item?.description?.ko : item?.description?.en}</p>
                                    </div>
                                </a>
                            </Link>
                          ))} 
                        </div>
                        <div className="p-5 bg-gray-50 sm:p-8">
                          <Link href={exhibitions?.[exhibitions?.length - 1]?.href}>
                            <a 
                              className="-m-3 p-3 flow-root rounded-md hover:bg-gray-100"
                              onClick={() => { itemContext?.setSelectedItem(exhibitions?.[exhibitions?.length - 1]?.category) }}
                            >
                                <div className="flex items-center mb-2">
                                <div className="text-sm font-medium text-gray-700">{userContext?.isKoreanOption ? exhibitions?.[exhibitions?.length - 1]?.name?.ko : exhibitions?.[exhibitions?.length - 1]?.name?.en}</div>
                                <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-green-100 text-green-800">
                                    New
                                </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {userContext?.isKoreanOption ? exhibitions?.[exhibitions?.length - 1]?.description?.ko : exhibitions?.[exhibitions?.length - 1]?.description?.en}
                                </p>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            
            {/* 상단탭 (xl) */}
            {/* {exhibitions?.map((item, idx) => (
                <Link key={idx} href={item?.href}>
                    <a 
                      className={classNames(
                        userContext?.isKoreanOption ? "" : "text-sm",
                        "hidden xl:flex xl:items-center xl:justify-center p-1 text-base font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
                      )}
                      onClick={() => { itemContext?.setSelectedItem(item?.category) }}
                    >
                        {userContext?.isKoreanOption ? item?.name?.ko : item?.name?.en}
                    </a>
                </Link>
            ))} */}

            <Popover className="relative hidden lg:flex">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-gray-700' : 'text-gray-500',
                      'py-1 px-2 group bg-white rounded-md inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    )}
                  >
                    <span 
                      className={classNames(
                        userContext?.isKoreanOption ? "" : "",
                    "text-sm md:text-base font-medium text-gray-500 hover:text-gray-900"
                    )}
                    >
                      {userContext?.isKoreanOption ? "더보기" : "More"}
                    </span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 group-hover:text-gray-500'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {resources.map((item, idx) => (
                            <Link key={idx} href={item?.href}>
                                <a 
                                  className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50"
                                  // onClick={() => { itemContext?.setSelectedItem(item?.category) }}
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                        {/* <FontAwesomeIcon className="h-6 w-6" aria-hidden="true" icon={faSolid, item?.icon} /> */}
                                    </div>
                                    <div className="ml-4 text-sm font-medium text-gray-700">{userContext?.isKoreanOption ? item?.name?.ko : item?.name?.en}</div>
                                </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>
          <div className="flex items-center md:ml-12">
            {/* <button 
              onClick={() => userContext?.setIsKoreanOption(!userContext?.isKoreanOption)}
              className="hidden lg:inline-flex text-sm lg:text-base items-center justify-center bg-gray-300 px-4 py-2 rounded-md font-medium shadow-sm border-transparent text-white hover:text-gray-600">
              {userContext?.isKoreanOption ? "KOR" : "ENG"}
            </button> */}
            {/* <Link href="/login">
              <a  */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    router?.push("/login");
                  }
                  else {
                    setIsLogoutRequest(true);
                  };
                }}
                className={classNames(
                  userContext?.isKoreanOption ? "" : "",
                  "text-sm md:text-base font-medium text-gray-500 hover:text-gray-900"
                )}
              >
                {!isLoggedIn 
                ? (userContext?.isKoreanOption ? "로그인" : "Login")
                : (userContext?.isKoreanOption ? "로그아웃" : "Logout")}

              </button>
              {/* </a>
            </Link> */}
            <Link href="/login">
              <a 
                className={classNames(
                  isLoggedIn ? "hidden" : "inline-flex",
                  "text-sm md:text-base ml-4 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-white bg-green-600 hover:bg-green-700"
                )}
              >
                {userContext?.isKoreanOption ? "회원가입" : "Join"}
              </a>
            </Link>
            <button 
              onClick={() => userContext?.setIsKoreanOption(!userContext?.isKoreanOption)}
              className={classNames(
                userContext?.isKoreanOption ? "" : "",
                "inline-flex text-sm md:text-base ml-4 items-center justify-center bg-gray-400 px-4 py-2 rounded-md font-medium shadow-sm border-transparent text-white hover:bg-gray-500"
              )}
            >
              {userContext?.isKoreanOption ? "KOR" : "ENG"}
            </button>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Image 
                    className="pointer-events-none"
                    src="/museum_logo.png" 
                    alt="Seodaumun Museum of Natural History"
                    height={30}
                    width={180}
                    placeholder="blur"
                    blurDataURL="/blur.jpg"
                    // priority={true}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-6">
                  {exhibitions.map((item, idx) => (
                    <Link key={idx} href={item?.href}>
                        <a 
                          className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50"
                          onClick={() => { itemContext?.setSelectedItem(item?.category) }}
                        >
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                                <item.icon className="h-6 w-6" aria-hidden="true" />
                                {/* <FontAwesomeIcon className="h-6 w-6" aria-hidden="true" icon={faSolid, item?.icon} /> */}
                            </div>
                            <div className="ml-4 text-sm font-medium text-gray-700">{userContext?.isKoreanOption ? item?.name?.ko : item?.name?.en}</div>
                        </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="grid grid-cols-2 gap-4">
                {/* <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Pricing
                </a>
                <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Enterprise
                </a> */}
                {resources.map((item, idx) => (
                  <Link key={idx} href={item?.href}>
                    <a className="text-sm font-medium text-gray-600 hover:text-gray-700">
                        {userContext?.isKoreanOption ? item?.name?.ko : item?.name?.en}
                    </a>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => userContext?.setIsKoreanOption(!userContext?.isKoreanOption)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-500">
                  {userContext?.isKoreanOption ? "Language: Korean" : "언어: 영어"}
                </button>
                <Link href="/login">
                    <a className={classNames(
                      isLoggedIn ? "hidden" : "flex",
                      "mt-3 w-full items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    )}
                    >
                    {userContext?.isKoreanOption ? "회원가입" : "Create an account"}
                    </a>
                </Link>
                <p className="mt-6 text-center text-sm font-medium text-gray-500">
                  {userContext?.isKoreanOption ? "기존 회원이신가요? " : "Already signed up?"}
                  {/* <Link href="/login">
                    <a className="ml-1 font-bold text-green-600 hover:text-green-500">
                      {!isLoggedIn 
                      ? (userContext?.isKoreanOption ? "로그인" : "Login")
                      : (userContext?.isKoreanOption ? "로그아웃" : "Logout")}
                    </a>
                  </Link> */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        router?.push("/login");
                      }
                      else {
                        setIsLogoutRequest(true);
                      };
                    }}
                    className={classNames(
                      userContext?.isKoreanOption ? "" : "",
                      "ml-1 font-bold text-green-600 hover:text-green-500"
                    )}
                  >
                    {!isLoggedIn 
                    ? (userContext?.isKoreanOption ? "로그인" : "Login")
                    : (userContext?.isKoreanOption ? "로그아웃" : "Logout")}

                  </button>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
    </div>
  )
}
