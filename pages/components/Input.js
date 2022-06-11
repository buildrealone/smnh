// import Image from 'next/image';
// import type { UseFormRegisterReturn } from "react-hook-form";
// interface InputProps {
//     label: string;
//     name: string;
//     kind?: "text" | "phone" | "price";
//     type: string;
//     register: UseFormRegisterReturn;
//     required: boolean;
//   }

export default function Input({
    label,
    name,
    kind = "text",
    register,
    type,
    placeholder = "",
    description = false,
    selectedEmail = "",
    selectedPhone = "",
    language = "korean",
    required,
}) {
return (
    <div>
    
    { name === "token" && (selectedEmail || selectedPhone) && description && language === "korean"
    ?
    <p className="text-[9px] text-red-500 mb-5 -mt-2">*임시 비밀번호가 {selectedEmail || selectedPhone}으로 전송되었습니다.</p>
    
    :
    name === "token" && (selectedEmail || selectedPhone) && description && language !== "korean"

    ?
    <p className="text-[9px] text-red-500 mb-5 -mt-2">*Your temporary password has been sent to {selectedEmail || selectedPhone}.</p>

    : null}

    <label
        className="text-xs mb-1 block font-medium text-gray-700"
        htmlFor={name}
    >
        {label}
    </label>

    {kind === "text" 
    ? 
    (
        <div className="rounded-md relative flex items-center shadow-sm">
            <input
                id={name}
                required={required}
                {...register}
                type={type}
                placeholder={placeholder}
                spellCheck="false"
                className="appearance-none w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
        </div>
    ) : null}

    {kind === "price" 
    ? 
    (
        <div className="rounded-md relative flex items-center shadow-sm">
            <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
                <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
                id={name}
                required={required}
                {...register}
                type={type}
                placeholder={placeholder}
                spellCheck="false"
                className="appearance-none pl-7 w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
                <span className="text-gray-500">KRW</span>
            </div>
        </div>
    ) : null}

    {kind === "phone" 
    ? 
    (
        <div className="flex rounded-md shadow-sm">
            <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-400 bg-gray-50 text-gray-500 select-none text-sm">
                010
            </span>
            <input
                id={name}
                required={required}
                {...register}
                type={type}
                placeholder={placeholder}
                spellCheck="false"
                className="appearance-none w-full px-4 py-2 border border-gray-400 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
        </div>
    ) : null}

    {kind === "password" 
    ? 
    (
        <div className="rounded-md relative flex items-center shadow-sm">
            <input
                id={name}
                required={required}
                {...register}
                type={type}
                placeholder={placeholder}
                spellCheck="false"
                className="appearance-none w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
        </div>
    ) : null}

    </div>
  );
}