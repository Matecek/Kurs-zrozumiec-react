import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import NotesList from "./components/notes-list/NotesList";
import { deleteNote, Note } from "./components/note/Note";
import { createFolder } from "./components/folders-list/FoldersList";
import { createNote } from "./components/notes-list/NotesList";
import { updateNote } from "./components/note/Note";

const router = createBrowserRouter([
    {
        element: <App />,
        path: "/",
        action: createFolder,
        shouldRevalidate: ({ formAction }) => {
            if (formAction === "/") {
                return true;
            } else {
                return false;
            }
        },
        loader: () => {
            return fetch("http://localhost:3000/folders");
        },
        children: [
            {
                path: "notes/:folderId",
                element: <NotesList />,
                action: createNote,
                loader: ({ params }) => {
                    return fetch(
                        `http://localhost:3000/notes?folderId=${params.folderId}`
                    );
                },
                children: [
                    {
                        path: `note/:noteId`,
                        action: updateNote,
                        element: <Note />,
                        shouldRevalidate: ({ formAction }) => {
                            if (formAction) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        loader: ({ params }) => {
                            return fetch(
                                `http://localhost:3000/notes/${params.noteId}`
                            );
                        },
                        children: [
                            {
                                path: "delete",
                                action: deleteNote,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
