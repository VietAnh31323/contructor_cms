import React from 'react'

const Equal = ({ className, style }: { className?: string, style?: React.CSSProperties }) => {
  return (
    <div className={className} style={style}>
      <svg
        width='14'
        height='14'
        viewBox='0 0 14 14'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M2.1875 8.75H11.8125'
          stroke='currentColor'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M2.1875 5.25H11.8125'
          stroke='currentColor'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </div>
  )
}

export default React.memo(Equal)
