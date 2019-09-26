import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css"

export default function LoaderButton({
    isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
}) {
    return (
        <div>
            <Button 
                className={className}
                disabled={ disabled }
                {...props}
            >
                {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
                {!isLoading ? text : loadingText}
            </Button>
        </div>
    )
}
