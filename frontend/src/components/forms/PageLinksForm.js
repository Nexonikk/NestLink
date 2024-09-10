"use client";
import SubmitButton from "@/components/buttons/SubmitButton";
import getUsername from "@/utils/getUsername";
import {
  faCloudArrowUp,
  faGripLines,
  faLink,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageLinksForm({ links, setLinks }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState(null);
  const [addLink, setAddLink] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { username } = getUsername();

  async function createLink() {
    if (!title || !url) {
      return toast.error("Url is required");
    }

    let formData = null;

    if (username) {
      if (icon) {
        formData = new FormData();
        formData.append("icon", icon);
      }

      // if (formData) {
      //   for (const [key, value] of formData.entries()) {
      //     console.log(`${key}:`, value);
      //   }
      // }

      try {
        const res = await axios.post(
          `${BACKEND_URL}/profile/createLink`,
          {
            username,
            title,
            url,
            icon: formData ? formData.get("icon") : "",
          },
          {
            headers: {
              "Content-Type": formData
                ? "multipart/form-data"
                : "application/json", // Set headers conditionally
            },
          }
        );

        const data = res.data;
        window.location.reload();
        toast.success("Link created!");
      } catch (error) {
        console.log(error);
        toast.error("Error creating link");
      }
    }
  }

  async function removeLink(linkId) {
    try {
      if (username && linkId) {
        const res = await axios.post(`${BACKEND_URL}/profile/deleteLink`, {
          username,
          linkId,
        });
        console.log(res.data);
      }
      window.location.reload();
      toast.success("Link deleted!");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting link");
    }
  }

  return (
    <>
      <div className="mb-4 mt-4">
        <h2 className="text-2xl font-bold ">Links</h2>
        <ReactSortable list={links} setList={setLinks}>
          {links &&
            links.map((link) => (
              <div className="flex gap-4 m-5" key={link.id}>
                {link.icon ? (
                  <img src={link.icon} className="w-10 h-10" alt="icon" />
                ) : (
                  <FontAwesomeIcon className="mt-2" size="lg" icon={faLink} />
                )}

                <a
                  href={"https://" + link.url}
                  target="_blank"
                  className="p-2 bg-gray-100 text-[#3b82f6] rounded-lg cursor-pointer"
                >
                  {link.title}
                </a>
                <FontAwesomeIcon
                  icon={faTrash}
                  size="lg"
                  className="text-red-500 mt-2 cursor-pointer"
                  onClick={() => removeLink(link.id)}
                />
              </div>
            ))}
        </ReactSortable>
      </div>
      <form className="mt-10" action={createLink}>
        <button
          onClick={() => setAddLink((prev) => !prev)}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer"
        >
          <FontAwesomeIcon
            className="bg-blue-500 text-white p-1 rounded-full aspect-square"
            icon={faPlus}
          />
          <span>Add new</span>
        </button>
        {addLink && (
          <>
            <div className="">
              <ReactSortable list={links} setList={setLinks}>
                <div className="mt-8 md:flex gap-6 items-center">
                  <div className="handle">
                    <FontAwesomeIcon
                      className="text-gray-500 mr-2 cursor-ns-resize"
                      icon={faGripLines}
                    />
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-300  relative aspect-square overflow-hidden w-16 h-16 inline-flex justify-center items-center">
                      {!icon && <FontAwesomeIcon size="xl" icon={faLink} />}
                      {icon && (
                        <img
                          className="w-full h-full object-cover"
                          src={links?.icon}
                          alt="icon"
                          width={64}
                          height={64}
                        />
                      )}
                    </div>
                    <div>
                      <input
                        onChange={(e) => setIcon(e.target.files[0])}
                        id="icon"
                        type="file"
                        className="hidden"
                      />
                      <label
                        htmlFor={"icon"}
                        className="border mt-2 p-2 flex items-center gap-1 text-gray-600 cursor-pointer mb-2 justify-center"
                      >
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        <span>Change icon</span>
                      </label>
                    </div>
                  </div>
                  <div className="grow">
                    <label className="input-label">Title:</label>
                    <input
                      onChange={(ev) => setTitle(ev.target.value)}
                      type="text"
                      placeholder="title"
                      maxLength={45}
                      required
                    />
                    <label className="input-label">URL:</label>
                    <input
                      onChange={(ev) => setUrl(ev.target.value)}
                      type="text"
                      placeholder="https://url"
                    />
                  </div>
                </div>
              </ReactSortable>
            </div>
            <div className="border-t pt-4 mt-4">
              <SubmitButton className="max-w-xs mx-auto">
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
              </SubmitButton>
            </div>
          </>
        )}
      </form>
    </>
  );
}
