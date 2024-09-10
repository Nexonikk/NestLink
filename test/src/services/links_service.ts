import { PrismaClient } from "@prisma/client";
import GetDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

class LinksService {
  async createLink(username: string, icon: any, title: string, url: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        links: true,
      },
    });
    if (!user || !title || !url) {
      throw new Error("User not found or missing required fields");
    }
    if (icon) {
      const iconUrl = GetDataUri(icon);
      const iconCloudUrl = await cloudinary.v2.uploader.upload(iconUrl.content);
      icon = iconCloudUrl.secure_url;
    }

    const link = await prisma.links.create({
      data: {
        icon: icon || "",
        title,
        url,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return link;
  }
  async deleteLink(username: string, linkId: number) {
    const userWithLink = await prisma.user.findFirst({
      where: {
        username,
        links: {
          some: {
            id: linkId,
          },
        },
      },
    });

    if (!userWithLink) {
      throw new Error("User not found or link does not belong to this user");
    }

    const deletedLink = await prisma.links.delete({
      where: {
        id: linkId,
      },
    });

    return deletedLink;
  }
}

export default LinksService;
