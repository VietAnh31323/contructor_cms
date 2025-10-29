import { Box, Step, StepLabel, Stepper } from '@mui/material'
import { memo } from 'react'

interface Props {
  className?: string
  step: number
  stepList: string[]
  onChangeStep: (val: number) => void
}

const CoreStep = ({ step, stepList, className, onChangeStep }: Props) => {
  return (
    <Box className="flex items-center justify-center w-full">
      <Stepper activeStep={step} className={className ?? 'w-full px-30'}>
        {stepList.map((item, index) => (
          <Step key={item} disabled={true}>
            <StepLabel
              onClick={() => {
                onChangeStep(index)
              }}
            >
              {item}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default memo(CoreStep)
