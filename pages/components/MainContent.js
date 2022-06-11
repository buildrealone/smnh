import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserContext from '../../libs/client/UserContext';

export default function MainContent({ items, title }) {
    const userContext = useContext(UserContext);
return (
    <div className="mt-[77px] bg-gray-100 overflow-hidden max-w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <span className="block text-lg mb-5 text-gray-700">{userContext?.isKoreanOption ? title?.ko : title?.en}</span>
        <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {items?.map((item, idx) => (
            <Link key={idx} href={item?.href}>
                <li className="relative">
                    <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                        {/* <img src={item?.imageUrl} alt="" className="object-cover pointer-events-none group-hover:opacity-75" /> */}
                        <Image 
                        className="object-cover pointer-events-none group-hover:opacity-75" 
                        src={item?.imageUrl} 
                        alt={userContext?.isKoreanOption ? item?.title?.ko : item?.title?.en}
                        layout="fill"
                        placeholder="blur"
                        blurDataURL="/blur.jpg"
                        priority={true}
                        />
                    </div>
                    <p className="mt-3 mb-2 block text-sm font-medium text-gray-700 truncate pointer-events-none">{userContext?.isKoreanOption ? item?.title?.ko : item?.title?.en}</p>
                    <p className="block text-xs font-medium text-gray-500 pointer-events-none">{userContext?.isKoreanOption ? (item?.description?.ko?.length < 80 ? item?.description?.ko : (item?.description?.ko?.slice(0, 80) + "...")) : (item?.description?.en?.length < 80 ? item?.description?.en : (item?.description?.en?.slice(0, 80) + "..."))}</p>
                </li>
            </Link>
        ))}
        </ul>
    </div>
  )
}
