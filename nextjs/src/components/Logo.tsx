import React from 'react'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <div className="-mt-1.5 flex items-center md:gap-x-12">
      <div className="flex items-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40 20C40 31.0457 31.0457 40 20 40C17.0415 40 14.2331 39.3576 11.7066 38.2048C12.8706 37.454 13.7028 36.233 13.9347 34.8104C15.8052 35.5772 17.8532 36 20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4C11.1634 4 4 11.1634 4 20C4 23.5107 5.13067 26.7573 7.04773 29.3955C5.75385 29.9448 4.73907 31.0235 4.27523 32.3598C1.59745 28.9577 0 24.6654 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z"
            fill="#2563EB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.4958 12.3276C18.1295 12.7401 17.5951 13 17 13C16.9832 13 16.9664 12.9998 16.9497 12.9994L14.0586 17.8178C14.2332 17.9825 14.388 18.168 14.5191 18.3702L25.0105 15.7474C25.0227 15.6015 25.0453 15.4585 25.0776 15.3193L18.4958 12.3276ZM18.9979 10.9081C18.9499 9.84621 18.0738 9 17 9C15.8954 9 15 9.89543 15 11C15 11.5414 15.2151 12.0325 15.5645 12.3926L12.7442 17.093C12.5062 17.0323 12.2569 17 12 17C10.3431 17 9 18.3431 9 20C9 21.6569 10.3431 23 12 23C13.6569 23 15 21.6569 15 20C15 19.9321 14.9977 19.8647 14.9933 19.7978L25.2631 17.2304C25.3199 17.3565 25.3852 17.4781 25.4582 17.5942L10.6598 31.5006C10.1844 31.1843 9.61374 31 9 31C7.34315 31 6 32.3431 6 34C6 35.6569 7.34315 37 9 37C10.6569 37 12 35.6569 12 34C12 33.501 11.8782 33.0305 11.6626 32.6165L26.5498 18.6268C26.7446 18.7346 26.9527 18.8214 27.1711 18.884L26.6239 27.0919C25.813 27.3471 25.225 28.1049 25.225 29C25.225 30.1046 26.1204 31 27.225 31C28.3296 31 29.225 30.1046 29.225 29C29.225 28.2169 28.7749 27.5389 28.1193 27.2106L28.6717 18.9245C30.0052 18.6195 31 17.4259 31 16C31 14.3431 29.6569 13 28 13C27.1171 13 26.3233 13.3814 25.7744 13.9884L18.9979 10.9081Z"
            fill="#2563EB"
          />
        </svg>
        {/* Text of the logo */}
        <span className="ml-2.5 whitespace-nowrap text-lg font-bold">
          Assistent
        </span>
        <span className="whitespace-nowrap text-lg font-extrabold text-blue-600">
          .one
        </span>
      </div>
      {/* Version Tag: Alpha */}
      <div className="-py-0.5 absolute -mt-9 mb-0 ml-[160px] mr-0 h-4 w-max items-center justify-between rounded-3xl bg-blue-600 px-1.5 pt-0 text-2xs font-semibold normal-case leading-loose tracking-wider text-white shadow-none">
        Beta
      </div>
    </div>
  )
}
