import React from 'react'

const ArrowUpIcon = ({ className }: { className?: string }) => {

  return (
    <div className={className}>
      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14.0789V3.07886" stroke="#747475" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.5 7.57886L8 3.07886L12.5 7.57886" stroke="#747475" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  )
}

export default React.memo(ArrowUpIcon)
