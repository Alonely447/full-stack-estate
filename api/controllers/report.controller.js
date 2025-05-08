import prisma from "../lib/prisma.js";

export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        reason: true,
        image: true,
        status: true,
        actionTaken: true,
        createdAt: true,
        reporter: { select: { username: true } },
        suspect: { select: { username: true } },
        postId: true,
      },
    });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports!" });
  }
};

export const getStats = async (req, res) => {
  try {
    const now = new Date();

    // Calculate date ranges
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Posts counts
    const postsWeek = await prisma.post.count({
      where: { createdAt: { gte: oneWeekAgo } },
    });
    const postsMonth = await prisma.post.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });
    const postsYear = await prisma.post.count({
      where: { createdAt: { gte: oneYearAgo } },
    });
    const postsTotal = await prisma.post.count();

    // Users counts
    const usersWeek = await prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } },
    });
    const usersMonth = await prisma.user.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });
    const usersYear = await prisma.user.count({
      where: { createdAt: { gte: oneYearAgo } },
    });
    const usersTotal = await prisma.user.count();

    // Messages counts
    const messagesWeek = await prisma.message.count({
      where: { createdAt: { gte: oneWeekAgo } },
    });
    const messagesMonth = await prisma.message.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });
    const messagesYear = await prisma.message.count({
      where: { createdAt: { gte: oneYearAgo } },
    });
    const messagesTotal = await prisma.message.count();

    res.status(200).json({
      posts: { week: postsWeek, month: postsMonth, year: postsYear, total: postsTotal },
      users: { week: usersWeek, month: usersMonth, year: usersYear, total: usersTotal },
      messages: { week: messagesWeek, month: messagesMonth, year: messagesYear, total: messagesTotal },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch statistics!" });
  }
};

export const rejectReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status: "rejected" },
    });

    res.status(200).json({ message: "Report rejected successfully.", updatedReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject report." });
  }
};

export const processReport = async (req, res) => {
  const { reportId } = req.params;
  const { action, suspensionDuration } = req.body; // "hide_post", "suspend_user", suspensionDuration: "1_day" or "1_week"

  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { post: true, suspect: true },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    if (action === "hide_post") {
      // Use transaction to delete related reports except current report, savedPosts, and update post to hide it
      await prisma.$transaction([
        // Delete related Report records except current report
        prisma.report.deleteMany({
          where: {
            postId: report.postId,
            NOT: { id: reportId },
          },
        }),
        // Delete related SavedPost records
        prisma.savedPost.deleteMany({
          where: { postId: report.postId },
        }),
        // Update the post to set verified to false (hide the post)
        prisma.post.update({
          where: { id: report.postId },
          data: { verified: false, status: "flagged" },
        }),
      ]);
      // Mark the current report as completed
      await prisma.report.update({
        where: { id: reportId },
        data: { status: "completed", actionTaken: action },
      });
    } else if (action === "suspend_user") {
      // Calculate suspension expiration date
      let suspensionExpiresAt = null;
      const now = new Date();

      console.log("Suspension duration:", suspensionDuration);

      if (suspensionDuration === "1_day") {
        suspensionExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      } else if (suspensionDuration === "1_week") {
        suspensionExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else {
        return res.status(400).json({ message: "Invalid suspension duration." });
      }

      console.log("Suspension expires at:", suspensionExpiresAt);

      // Suspend the user with expiration
      await prisma.user.update({
        where: { id: report.suspectId },
        data: { isSuspended: true, suspensionExpiresAt },
      });
    }

    // Mark the report as completed
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status: "completed", actionTaken: action },
    });

    res.status(200).json({ message: "Report processed successfully.", updatedReport });
  } catch (err) {
    console.error("Error in processReport:", err);
    res.status(500).json({ message: "Failed to process report.", error: err.message, stack: err.stack });
  }
};

export const createReport = async (req, res) => {
  const { postId, description, images, suspectId } = req.body;
  const reporterId = req.userId;

  if (!suspectId) {
    return res.status(400).json({ message: "suspectId is required." });
  }

  try {
    const newReport = await prisma.report.create({
      data: {
        postId,
        reason: description,
        image: images.length > 0 ? images[0] : null,
        reporterId,
        suspectId,
        status: "pending",
      },
    });

    res.status(201).json({ message: "Report created successfully.", report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create report." });
  }
};


