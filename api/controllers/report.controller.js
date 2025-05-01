import prisma from "../lib/prisma.js";

export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { username: true } },
        suspect: { select: { username: true } },
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
