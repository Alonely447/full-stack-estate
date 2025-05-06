import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

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
        message: `You are suspended until ${user.suspensionExpiresAt}. You cannot send messages.`,
      });
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
