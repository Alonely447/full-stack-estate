import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  const tokenUserId = req.userId;

  try {
    const search = query.search || undefined;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId },
    });
    const isAdmin = user?.isAdmin || false;

    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
        verified: isAdmin ? undefined : true,
        AND: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { postDetail: { desc: { contains: search, mode: "insensitive" } } },
              ],
            }
          : undefined,
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            email: true
          },
        },
      },
    });

    let userId = null;

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = payload.id;
      } catch (err) {
        console.log("Invalid token:", err);
      }
    }

    // Check if the post is saved by the user
    const saved = userId
      ? await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId,
            },
          },
        })
      : null;

    // Return the post details with the `isSaved` flag
    res.status(200).json({ ...post, isSaved: saved ? true : false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get post details" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Check if user is suspended and suspension is active
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId },
    });

    if (
      user.isSuspended &&
      user.suspensionExpiresAt &&
      new Date(user.suspensionExpiresAt) > new Date()
    ) {
      return res.status(403).json({
        message: `You are suspended until ${user.suspensionExpiresAt}. You cannot create new posts.`,
      });
    }

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        verified: false,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const verifyPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { verified: true },
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to verify post" });
  }
};


export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!isAdmin && post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete related PostDetail if exists
    await prisma.postDetail.deleteMany({
      where: { postId: id },
    });

    // Delete related SavedPost records
    await prisma.savedPost.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

