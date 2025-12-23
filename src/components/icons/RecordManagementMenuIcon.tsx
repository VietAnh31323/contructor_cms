import React from 'react'

const RecordManagementMenuIcon = ({ className }: { className?: string }) => {
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
          d='M13.5 3H2.5C2.22386 3 2 3.22386 2 3.5V5.5C2 5.77614 2.22386 6 2.5 6H13.5C13.7761 6 14 5.77614 14 5.5V3.5C14 3.22386 13.7761 3 13.5 3Z'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13 6V12.5C13 12.6326 12.9473 12.7598 12.8536 12.8536C12.7598 12.9473 12.6326 13 12.5 13H3.5C3.36739 13 3.24021 12.9473 3.14645 12.8536C3.05268 12.7598 3 12.6326 3 12.5V6'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.5 8.5H9.5'
          stroke='#242424'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  )
}

export default React.memo(RecordManagementMenuIcon)
