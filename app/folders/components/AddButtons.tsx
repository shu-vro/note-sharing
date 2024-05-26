import React from "react";
import AddFolder from "./AddButtons/AddFolder";
import AddFile from "./AddButtons/AddFile";

export default function AddButtons() {
    return (
        <div className="flex">
            <div className="grow"></div>
            <div className="my-4 flex flex-row gap-3">
                <AddFolder />
                <AddFile />
            </div>
        </div>
    );
}
