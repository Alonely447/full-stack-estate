import prisma from "../lib/prisma.js";

export const checkSuspension = async (req, res, next) => {
    const userId = req.userId;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (
        user.isSuspended &&
        user.suspensionExpiresAt &&
        new Date(user.suspensionExpiresAt) > new Date()
      ) {
        return res.status(403).json({
          message: `You are suspended until ${user.suspensionExpiresAt}. You cannot perform this action.`,
        });
      }
  
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to check suspension status." });
    }
  };
