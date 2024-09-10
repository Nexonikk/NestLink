"use client";
import SubmitButton from "@/components/buttons/SubmitButton";
import {
  faCloudArrowUp,
  faImage,
  faPalette,
  faSave,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLinksForm from "./PageLinksForm";
import getUsername from "@/utils/getUsername";
import axios from "axios";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import Loader from "@/components/Loader";

export default function PageSettingsForm() {
  const [bgType, setBgType] = useState();
  const [bgColor, setBgColor] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [avatar, setAvatar] = useState();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState(null);
  const [bio, setBio] = useState("");
  const [location, setlocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username } = getUsername();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/profile/getProfile`, {
        params: { username },
      });

      const data = res.data.data;
      setProfile(data.profile);
      setLinks(data.links);
      console.log(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      getProfile();
    }
  }, [username]);

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      if (username) {
        setLoading(true);
        await axios.post(`${BACKEND_URL}/profile/updateProfile`, {
          username,
          avatar: avatar ? avatar : profile?.avatar,
          bgImage,
          bio: bio ? bio : profile?.bio,
          location: location ? location : profile?.location,
        });
      }
      window.location.reload();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
      console.log("Error updating profile", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const formData = new FormData();
    const avatar = e.target.files[0];
    formData.set("avatar", avatar);
    formData.set("username", username);
    await axios.post(`${BACKEND_URL}/profile/updateProfile`, formData);

    window.location.reload();
    toast.success("Profile updated successfully");
  };

  const handlebgImgUpload = async (e) => {
    const formData = new FormData();
    const bgImg = e.target.files[0];
    formData.set("bgImg", bgImg);
    formData.set("username", username);
    await axios.post(`${BACKEND_URL}/profile/updateProfile`, formData);

    window.location.reload();
    toast.success("Profile updated successfully");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {username && (
        <div className="bg-white m-2 p-2 md:m-8 md:p-4 shadow w-screen items-center">
          <form onSubmit={handleProfile}>
            <img
              className="max-h-60 w-full object-cover"
              name="bgImage"
              src={profile?.bgImg}
            />
            <div
              className="py-4 -m-4 min-h-[200px] flex justify-center items-center bg-cover bg-center"
              style={
                bgType === "color"
                  ? { backgroundColor: bgColor }
                  : { backgroundImage: setBgImage }
              }
            >
              <div>
                <div className="flex justify-center">
                  <label className="bg-white shadow px-4 py-2 flex gap-2">
                    <input
                      type="file"
                      onChange={handlebgImgUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2 items-center cursor-pointer">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        className="text-gray-700"
                      />
                      <span>Change image</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-9">
              <div className="relative -top-8 w-[128px] h-[128px]">
                <div className="overflow-hidden h-full rounded-full border-4 border-white shadow shadow-black/50">
                  <img
                    className="w-full h-full object-cover"
                    src={profile?.avatar}
                    alt={"avatar"}
                    width={128}
                    height={128}
                  />
                </div>
                <label
                  htmlFor="avatarIn"
                  className="absolute bottom-0 -right-2 bg-white p-2 rounded-full shadow shadow-black/50 aspect-square flex items-center cursor-pointer"
                >
                  <FontAwesomeIcon size={"lg"} icon={faCloudArrowUp} />
                </label>
                <input
                  onChange={handleAvatarUpload}
                  id="avatarIn"
                  type="file"
                  className="hidden"
                />
                <input type="hidden" name="avatar" value={avatar} />
              </div>
            </div>
            <div className="p-0">
              <label className="flex w-full" htmlFor="nameIn">
                Display name <span className="font-bold mx-2">{username}</span>
                <span className="flex flex-grow justify-end cursor-pointer  ">
                  <FontAwesomeIcon
                    onClick={() => setIsOpen((prev) => !prev)}
                    size="lg"
                    icon={faPenToSquare}
                  />
                </span>
              </label>

              <label className="input-label" htmlFor="locationIn">
                Location
              </label>
              <input
                type="text"
                id="locationIn"
                name="location"
                defaultValue={profile?.location}
                onChange={(e) => setlocation(e.target.value)}
                placeholder="Somewhere only you know"
                maxLength={25}
                disabled={!isOpen}
              />
              <label className="input-label" htmlFor="bioIn">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={profile?.bio}
                id="bioIn"
                placeholder="Something about yourself"
                onChange={(e) => setBio(e.target.value)}
                maxLength={45}
                disabled={!isOpen}
              />
              <div className="max-w-[200px] mx-auto">
                {isOpen && (
                  <SubmitButton>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save</span>
                  </SubmitButton>
                )}
              </div>
            </div>
          </form>
          {links && <PageLinksForm links={links} setLinks={setLinks} />}
        </div>
      )}
    </>
  );
}
