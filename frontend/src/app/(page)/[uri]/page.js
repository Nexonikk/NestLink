"use client";
import Loader from "@/components/Loader";
import getUsername from "@/utils/getUsername";
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTiktok,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEllipsisVertical,
  faEnvelope,
  faLink,
  faLocationDot,
  faMobile,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
};

const Themes = [
  {
    id: 1,
    color: "bg-gradient-to-b from-orange-300 to-red-300",
  },
  {
    id: 2,
    color: "bg-gradient-to-b from-sky-400 to-pink-300",
  },
  {
    id: 3,
    color: "bg-gradient-to-b from-purple-400 to-purple-700",
  },
  {
    id: 4,
    color: "bg-gradient-to-b from-purple-200 to-blue-400",
  },
];

const gradient = [
  "bg-gradient-to-b from-orange-300 to-red-300",
  "bg-gradient-to-b from-sky-400 to-pink-300",
  "bg-gradient-to-b from-purple-400 to-purple-700",
  "bg-gradient-to-b from-purple-200 to-blue-400",
];

export default function UserPage({ params }) {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [themeComponent, setThemeComponent] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { username } = getUsername();
  const { uri: paramUsername } = params;

  const getProfile = useCallback(async () => {
    if (!username) return; // Add this check to prevent unnecessary API calls

    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/profile/getProfile`, {
        params: { username },
      });

      const data = res.data.data;
      setProfile(data?.profile);
      setLinks(data?.links);
      console.log(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [username]); // Add username as a dependency

  useEffect(() => {
    getProfile();
  }, [getProfile]); // Now

  const ThemeComponent = () => {
    if (themeComponent) {
      return (
        <div className="h-auto w-auto p-6 mt-20 gap-2 bg-white absolute">
          <span>Choose Theme</span>
          <span className="ml-10 text-red-500 text-lg">X</span>
          <div className="flex max-w-xs">
            {gradient.map((c) => (
              <div
                className={`h-8 w-8 rounded-full ml-2 mt-2 ${c}`}
                onClick={() => {
                  localStorage.setItem("theme", c);
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />;
      </div>
    );
  }

  return (
    <>
      {username && (
        <div
          className={`bg-gradient-to-b from-purple-200 to-blue-400 ${localStorage.getItem(
            "theme"
          )} text-black min-h-screen`}
        >
          <div className="h-32 bg-cover bg-center"></div>

          <div className="aspect-square w-36 h-36 mx-auto relative -top-16 -mb-12">
            {paramUsername === username && (
              <div
                className="flex items-center justify-center ml-36 cursor-pointer"
                onClick={() => setThemeComponent((prev) => !prev)}
              >
                <FontAwesomeIcon size="md" icon={faEllipsisVertical} />
                {themeComponent && <ThemeComponent />}
              </div>
            )}
            <img
              className="rounded-full w-full h-full object-cover"
              src={profile?.avatar}
              alt="avatar"
              width={256}
              height={256}
            />
          </div>
          <h2 className="text-2xl text-center mb-1">{username}</h2>
          <h3 className="text-md flex gap-2 justify-center items-center">
            <FontAwesomeIcon className="h-4" icon={faLocationDot} />
            <span>{profile?.location}</span>
          </h3>
          <div className="mx-auto text-center my-2">
            <p>{profile?.bio}</p>
          </div>
          {links?.map((link) => (
            <div className="mx-auto gap-4 p-4 px-8 max-w-xl">
              <Link
                key={link.id}
                target="_blank"
                className="bg-white shadow-xl blur-none shadow-black p-2 flex hover:translate-x-1 hover:translate-y-1 transition-all ease-in"
                href={link.url}
              >
                <div className="relative h-10 w-10">
                  <div className="w-16 h-16">
                    {link.icon && (
                      <img
                        className="object-cover h-10 w-10"
                        src={link.icon}
                        alt="icon"
                        width={64}
                        height={64}
                      />
                    )}
                    {!link.icon && (
                      <FontAwesomeIcon
                        icon={faLink}
                        size="lg"
                        className="w-8 h-8 mt-3"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center mx-auto text-lg overflow-hidden">
                  <div>
                    <h3>{link.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
