import React from 'react'

const DeclareMenuIcon = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        width='20'
        height='20'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M7 7H11'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M7 9H11'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V13C2.5 13.2761 2.72386 13.5 3 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3C13.5 2.72386 13.2761 2.5 13 2.5Z'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M5 2.5V13.5'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}

export default React.memo(DeclareMenuIcon)
