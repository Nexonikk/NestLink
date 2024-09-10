import { Request, Response } from "express";
import ProfileService from "../services/profile_service.js";
import logger from "../config/logger.js";
import LinksService from "../services/links_service.js";

const profileService = new ProfileService();
const linksService = new LinksService();

class ProfileController {
  async getProfile(req: Request, res: Response) {
    try {
      const { username } = req.query;

      const profile = await profileService.getProfile(username as string);

      res.status(200).json({
        message: "Profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: "Error retrieving profile",
        error: error.message,
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { username, bio, location } = req.body;

      // Handle the file based on the name of the field
      const avatar =
        req.files && "avatar" in req.files ? req.files.avatar[0] : undefined;
      const bgImg =
        req.files && "bgImg" in req.files ? req.files.bgImg[0] : undefined;

      if (!username) {
        return res.status(400).json({
          message: "Username, bio, and location are required",
        });
      }

      // Pass the relevant file to the profileService
      const profile = await profileService.updateProfile(
        username,
        bio,
        location,
        avatar, // avatar file or undefined
        bgImg // bgImg file or undefined
      );

      res.status(200).json({
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      logger.error("Error updating profile:", error);
      res.status(500).json({
        message: "Error updating profile",
        error: error.message,
      });
    }
  }

  async createLink(req: Request, res: Response) {
    try {
      const { username, title, url } = req.body;
      const icon =
        req.files && "icon" in req.files ? req.files.icon[0] : undefined;

      if (!username || !title || !url) {
        return res.status(400).json({
          message: "Username, title, and url are required",
        });
      }

      const link = await linksService.createLink(username, icon, title, url);
      res.status(200).json({
        message: "Link created successfully",
        data: link,
      });
    } catch (error) {
      logger.error("Error creating LInk:", error);
      res.status(500).json({
        message: "Error creating link",
        error: error,
      });
    }
  }
  async deleteLink(req: Request, res: Response) {
    try {
      const { username, linkId } = req.body;

      if (!username || !linkId) {
        return res.status(400).json({
          message: "Username and linkId are required",
        });
      }

      const parsedLinkId = parseInt(linkId, 10);
      if (isNaN(parsedLinkId)) {
        return res.status(400).json({
          message: "linkId must be a valid number",
        });
      }

      const link = await linksService.deleteLink(username, parsedLinkId);

      res.status(200).json({
        message: "Link deleted successfully",
        data: link,
      });
    } catch (error) {
      logger.error("Error deleting link:", error);
      res.status(500).json({
        message: "Error deleting link",
        error: error.message,
      });
    }
  }
}
export default ProfileController;
