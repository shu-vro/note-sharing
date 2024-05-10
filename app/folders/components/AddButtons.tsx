import React, { useState } from "react";
import { auth, createFolder, firestoreDb } from "@/firebase";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useRefresh } from "./RefreshContext";
import Dialog from "./Dialog";
import { isValidFolderId } from "@/lib/utils";

export default function AddButtons() {
    const params = useParams();
    const { setRefresh } = useRefresh();
    const [openFolderDialog, setOpenFolderDialog] = useState(false);
    const [folderName, setFolderName] = useState("");

    const onAddFolderClick = async (folderName: string) => {
        let slug: string[] = (params.slug as string[]) || [];
        slug = ["folders", ...slug.flatMap(s => [s, "folders"])].map(e =>
            decodeURIComponent(e)
        );
        if (slug.length > 1) {
            slug.pop();
        }
        const querySnapshot = await getDoc(
            doc(firestoreDb, ...(slug as [string, ...string[]]))
        );
        if (querySnapshot.exists()) {
            if (!auth.currentUser) {
                return alert("Not logged in");
            }
            if (!isValidFolderId(folderName)) {
                return alert("Invalid folder name");
            }
            if (slug.length > 1) {
                slug.push("folders");
            }
            try {
                await createFolder(
                    auth.currentUser.uid,
                    [],
                    slug.join("/"),
                    folderName
                );
            } catch (error) {
                return alert(error);
            }

            // if (slug.length > 1) {
            //     slug.pop();
            // }
            setRefresh(t => t + 1);
        } else {
            alert("Base Folder not found");
        }
    };
    return (
        <div className="flex">
            <div className="grow"></div>
            <div className="my-4">
                <Dialog
                    title="Create Folder"
                    open={openFolderDialog}
                    setOpen={setOpenFolderDialog}
                    onConfirm={async () => {
                        await onAddFolderClick(folderName);
                    }}>
                    <div>
                        <label className="block text-lg" htmlFor="folderName">
                            Folder Name
                        </label>
                        <input
                            value={folderName}
                            onChange={e => setFolderName(e.target.value)}
                            type="text"
                            id="folderName"
                            className="w-full primary-border p-2 bg-transparent !rounded-lg"
                        />
                    </div>
                </Dialog>

                <button
                    type="button"
                    className="capitalize primary-border p-4"
                    onClick={() => {
                        setOpenFolderDialog(true);
                        //  await onAddFolderClick()
                    }}>
                    <span>+</span>add folder
                </button>
                <button
                    type="button"
                    className="capitalize primary-border p-4 ml-3">
                    <span>+</span> add files
                </button>
            </div>
        </div>
    );
}
