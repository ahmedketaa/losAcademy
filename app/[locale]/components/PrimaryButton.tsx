"use client";

const PrimaryButton = ({text, ourStyle, onClick ,disabled}: {text: string,disabled?:boolean , ourStyle: string, onClick?: () => void}) => {
    return(
        <button disabled={disabled} className={ ourStyle} onClick={onClick}>{text}</button>
    )
}

export default PrimaryButton;