import React from "react";

export default function DefaultButton({ text, onClick }) {

    return (
        <button
            className="bg-transparent border border-gray-300 text-black py-2 px-4 rounded-lg hover:brightness-110"
            style={{ background: "none", width: "100%" }}
            onClick={onClick}
        >
            { text }
        </button>
    )
}