"use client"
import { LoadingButtonProps } from '@/types'
import { Button, CustomFlowbiteTheme } from 'flowbite-react'
import React from 'react'

function LoadingButton({title, isProcessing, customStyle, action}: LoadingButtonProps) {

    const buttonTheme: CustomFlowbiteTheme['button'] = {
        color: {
            purple: "bg-secondary-color hover:bg-secondary-hover",
        }
    }

  return (
        <Button
            type='submit'
            theme={buttonTheme}
            color='purple'
            isProcessing={isProcessing}
            pill
            size="lg"
            className={
                customStyle ? customStyle :
                "transition-colors rounded-full font-semibold px-5 py-2 text-white"
            }
            onClick={action}
        >
            <p>
                {title}
            </p>
    </Button>
  )
}

export default LoadingButton