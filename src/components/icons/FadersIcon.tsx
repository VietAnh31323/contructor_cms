import { memo } from 'react'

const FadersIcon = ({ color = '#545965', ...props }: { color?: string }) => {
  return (
    <div {...props} className='items-center flex'>
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 8.57886L13.5 8.57884" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.5 8.57884L5.5 8.57886" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 4.07886L13.5 4.07875" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.5 4.07875L10.5 4.07886" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10.5 2.57886V5.57886" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10.5 13.0788L13.5 13.0789" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.5 13.0789L8.5 13.0788" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.5 14.5789V11.5789" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.5 7.07886V10.0789" stroke="#747475" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
    </div>
  )
}

export default memo(FadersIcon)
