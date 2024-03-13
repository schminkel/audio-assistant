import PropTypes from 'prop-types'
import React, { FC } from 'react'

export const ProcessingSVG: FC = () => (
  <svg
    className="-ml-1 mr-2.5 mt-0.5 h-4 w-4 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-85"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

interface LoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const LoadingButton: FC<LoadingButtonProps> = (props) => {
  return (
    <>
      <style jsx>{`
        .btnSpinner {
          position: relative;
          animation: fadeIn 0.4s;
          animation-fill-mode: forwards;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .btnText {
          position: relative;
          animation-name: text;
          animation-duration: 0.2s;
          animation-fill-mode: forwards;
        }
        @keyframes text {
          0% {
            left: 0px;
            top: 0px;
          }
          100% {
            left: 10px; // 16px
            top: 0px;
          }
        }
      `}</style>

      <button
        type="button"
        onClick={props.onClick}
        className={`${props.className}${
          props.loading || props.disabled ? ' cursor-not-allowed' : ''
        }`}
        disabled={props.loading || props.disabled}
      >
        {/* State 1 - normal button */}
        {!props.loading && <span>{props.children}</span>}

        {/* State 2 - loading spinner will be shown */}
        {props.loading && (
          <>
            <span
              className={`-ml-2 mt-0.5 opacity-0${props.loading ? ' btnSpinner' : ''}`}
            >
              <ProcessingSVG />
            </span>
            <span className={`-ml-4 ${props.loading ? ' btnText' : ''}`}>
              {props.children}
            </span>
          </>
        )}
      </button>
    </>
  )
}

LoadingButton.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default LoadingButton
