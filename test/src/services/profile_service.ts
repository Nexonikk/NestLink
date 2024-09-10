import { PrismaClient } from "@prisma/client";
import GetDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

class ProfileService {
  async getProfile(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        profile: true,
        links: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(
    username: string,
    bio: string,
    location: string,
    avatar: any,
    bgImg: any
  ) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let avatarCloudUrl = "";
    let bgImgCloudUrl = "";

    if (avatar) {
      const avatarUrl = GetDataUri(avatar);
      const avatarCloud = await cloudinary.v2.uploader.upload(
        avatarUrl.content
      );
      avatarCloudUrl = avatarCloud.secure_url;
    } else if (bgImg) {
      const bgImgUrl = GetDataUri(bgImg);
      const bgImgCloud = await cloudinary.v2.uploader.upload(bgImgUrl.content);
      bgImgCloudUrl = bgImgCloud.secure_url;
    }

    if (!user.profile) {
      const newProfile = await prisma.profile.create({
        data: {
          bio,
          location,
          avatar: avatarCloudUrl,
          bgImg: bgImgCloudUrl,
          user: {
            connect: { id: user.id },
          },
        },
      });
      console.log("New profile created:", newProfile);
      return newProfile;
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        bio,
        location,
        avatar: avatarCloudUrl || user.profile.avatar,
        bgImg: bgImgCloudUrl || user.profile.bgImg,
      },
    });

    return updatedProfile;
  }
}

export default ProfileService;
