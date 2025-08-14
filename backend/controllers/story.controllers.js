import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    const { mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" });
    }

    const story = await Story.create({
      author: req.userId,
      mediaType,
      media,
    });

    user.story = story._id;
    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `story upload error ${error}` });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({ messsage: "story not found" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());
    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `story view error ${error}` });
  }
};

export const getStoryByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;
    console.log("USERNAME PARAM ===>", userName);

    const user = await User.findOne({ userName: userName });

    if (!user) {
      console.log("USER NOT FOUND!");
      return res.status(400).json({ message: "user not found" });
    }

    const stories = await Story.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("viewers author");

    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: "No story found" });
    }

    console.log("FOUND STORIES ===>", stories);

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: `get story error ${error}` });
  }
};


export const getAllStories = async (req, res) => {
  try {

    const currentUser = await User.findById(req.userId).select("following");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const followingIds = currentUser.following.map(id => id.toString());

    const stories = await Story.find({
      author: { $in: [...followingIds, req.userId.toString()] },
    })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: `All story get error: ${error.message}` });
  }
};
